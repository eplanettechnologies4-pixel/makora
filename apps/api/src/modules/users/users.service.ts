import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRoleType, User } from '@prisma/client';
import { hashPassword } from '../../common/utils/crypto.util';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRoleType;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserWithBrand(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        ownedBrands: {
          take: 1,
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            logoUrl: true,
          },
        },
        brandMemberships: {
          include: {
            brand: {
              select: {
                id: true,
                name: true,
                slug: true,
                status: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const primaryBrand =
      user.ownedBrands?.[0] || user.brandMemberships?.[0]?.brand || null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      brand: primaryBrand,
    };
  }

  async create(data: CreateUserData): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('A user with this email address already exists');
    }

    const passwordHash = await hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        passwordHash,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone?.trim() || null,
        role: data.role || UserRoleType.CUSTOMER,
        isActive: true,
      },
    });
  }

  async updateRefreshToken(id: string, hashedRefreshToken: string | null): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { hashedRefreshToken },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
