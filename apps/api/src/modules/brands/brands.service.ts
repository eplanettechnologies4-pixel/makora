import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get brand belonging to the authenticated user
   */
  async getMyBrand(userId: string) {
    const brand = await this.prisma.brand.findFirst({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        bankAccounts: {
          select: {
            id: true,
            bankName: true,
            accountHolderName: true,
            accountNumberMasked: true,
            ibanMasked: true,
            branchCode: true,
            isVerified: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        documents: true,
      },
    });

    if (!brand) {
      throw new NotFoundException('No brand found associated with this user account');
    }

    return brand;
  }

  /**
   * Update brand profile
   */
  async updateBrandProfile(userId: string, data: any) {
    const brand = await this.prisma.brand.findFirst({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId, role: { in: ['OWNER', 'MANAGER'] } } } },
        ],
      },
    });

    if (!brand) {
      throw new ForbiddenException('You do not have management permissions for this brand');
    }

    return this.prisma.brand.update({
      where: { id: brand.id },
      data: {
        description: data.description,
        story: data.story,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
        websiteUrl: data.websiteUrl,
        socialLinks: data.socialLinks,
        businessAddress: data.businessAddress,
        city: data.city,
        country: data.country,
      },
    });
  }
}
