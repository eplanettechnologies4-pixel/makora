import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRoleType } from '@prisma/client';

@Injectable()
export class BrandOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Admins have marketplace-level access
    if (user.role === UserRoleType.ADMIN || user.role === UserRoleType.SUPER_ADMIN) {
      return true;
    }

    const brandId =
      request.params?.brandId ||
      request.params?.id ||
      request.body?.brandId ||
      request.query?.brandId;

    if (!brandId) {
      // If endpoint doesn't specify a brand ID, check if user has ANY brand
      const brandMember = await this.prisma.brandMember.findFirst({
        where: { userId: user.id },
      });
      if (!brandMember) {
        throw new ForbiddenException('You are not associated with any brand');
      }
      return true;
    }

    // Check if user is the brand owner or an active brand member
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        members: {
          where: { userId: user.id },
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const isOwner = brand.ownerId === user.id;
    const isMember = brand.members && brand.members.length > 0;

    if (!isOwner && !isMember) {
      throw new ForbiddenException(
        'Access denied: You do not have permission to access or modify this brand',
      );
    }

    return true;
  }
}
