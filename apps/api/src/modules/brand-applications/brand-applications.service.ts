import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateBrandApplicationDto } from './dto/create-brand-application.dto';
import { UpdateBrandApplicationDto } from './dto/update-brand-application.dto';
import {
  BrandStatus,
  BrandMemberRole,
  BusinessType,
  UserRoleType,
} from '@prisma/client';
import {
  encryptData,
  maskAccountNumber,
  maskIban,
  hashPassword,
} from '../../common/utils/crypto.util';

@Injectable()
export class BrandApplicationsService {
  private readonly logger = new Logger(BrandApplicationsService.name);

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private auditLogsService: AuditLogsService,
  ) {}

  /**
   * Submit a new brand application (Step 1-5 wizard)
   */
  async createApplication(
    dto: CreateBrandApplicationDto,
    authenticatedUserId?: string,
  ) {
    let ownerUserId = authenticatedUserId;
    let createdUser: any = null;

    // If user is not authenticated, validate and create owner account
    if (!ownerUserId) {
      if (!dto.ownerEmail || !dto.ownerPassword || !dto.ownerFirstName || !dto.ownerLastName) {
        throw new BadRequestException(
          'Owner account details (first name, last name, email, password) are required for new registration',
        );
      }

      const existingUser = await this.usersService.findByEmail(dto.ownerEmail);
      if (existingUser) {
        throw new ConflictException(
          'An account with this email already exists. Please log in first to apply.',
        );
      }

      const passwordHash = await hashPassword(dto.ownerPassword);
      createdUser = await this.prisma.user.create({
        data: {
          email: dto.ownerEmail.toLowerCase().trim(),
          passwordHash,
          firstName: dto.ownerFirstName.trim(),
          lastName: dto.ownerLastName.trim(),
          phone: dto.ownerPhone?.trim() || null,
          role: UserRoleType.BRAND_OWNER,
          isActive: true,
        },
      });

      ownerUserId = createdUser.id;
    } else {
      // User is authenticated: ensure role is upgraded to BRAND_OWNER if currently CUSTOMER
      const currentUser = await this.usersService.findById(ownerUserId);
      if (currentUser && currentUser.role === UserRoleType.CUSTOMER) {
        await this.prisma.user.update({
          where: { id: ownerUserId },
          data: { role: UserRoleType.BRAND_OWNER },
        });
      }
    }

    // Check for duplicate application for this user
    const existingApplication = await this.prisma.brandApplication.findFirst({
      where: {
        submittedBy: ownerUserId,
        status: {
          in: [
            BrandStatus.PENDING_APPROVAL,
            BrandStatus.UNDER_REVIEW,
            BrandStatus.APPROVED,
            BrandStatus.NEEDS_MORE_INFORMATION,
          ],
        },
      },
    });

    if (existingApplication) {
      throw new ConflictException(
        `You already have an active or pending brand application (Status: ${existingApplication.status})`,
      );
    }

    // Validate slug uniqueness
    const cleanSlug = dto.brandSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
    const existingSlug = await this.prisma.brand.findUnique({
      where: { slug: cleanSlug },
    });

    if (existingSlug) {
      throw new ConflictException(
        `Brand handle / slug "${cleanSlug}" is already taken. Please choose a different slug.`,
      );
    }

    // Encrypt sensitive banking information
    const accountNumberEncrypted = encryptData(dto.accountNumber);
    const accountNumberMasked = maskAccountNumber(dto.accountNumber);
    const ibanEncrypted = dto.iban ? encryptData(dto.iban) : null;
    const ibanMasked = dto.iban ? maskIban(dto.iban) : null;

    // Transaction to create Brand, Member, Bank Account, Documents, and Application
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create Brand
      const brand = await tx.brand.create({
        data: {
          name: dto.brandName.trim(),
          slug: cleanSlug,
          description: dto.brandDescription?.trim() || null,
          logoUrl: dto.logoUrl || null,
          bannerUrl: dto.bannerUrl || null,
          status: BrandStatus.PENDING_APPROVAL,
          businessType: dto.businessType || BusinessType.SOLE_PROPRIETORSHIP,
          businessAddress: dto.businessAddress?.trim() || null,
          city: dto.city?.trim() || null,
          country: dto.country?.trim() || 'Pakistan',
          websiteUrl: dto.websiteUrl?.trim() || null,
          socialLinks: dto.socialLinks || null,
          businessRegNumber: dto.businessRegNumber?.trim() || null,
          ownerId: ownerUserId!,
        },
      });

      // 2. Link Brand Member as OWNER
      await tx.brandMember.create({
        data: {
          brandId: brand.id,
          userId: ownerUserId!,
          role: BrandMemberRole.OWNER,
          isAccepted: true,
        },
      });

      // 3. Create Bank Account with masked and encrypted fields
      await tx.brandBankAccount.create({
        data: {
          brandId: brand.id,
          bankName: dto.bankName.trim(),
          accountHolderName: dto.accountHolderName.trim(),
          accountNumber: accountNumberMasked, // Safe masked version in default field
          accountNumberEncrypted,
          accountNumberMasked,
          iban: ibanMasked,
          ibanEncrypted,
          ibanMasked,
          branchCode: dto.branchCode?.trim() || null,
          isVerified: false,
        },
      });

      // 4. Create Documents metadata if provided
      if (dto.documents && dto.documents.length > 0) {
        await tx.brandDocument.createMany({
          data: dto.documents.map((doc) => ({
            brandId: brand.id,
            documentType: doc.documentType,
            fileKey: doc.fileKey,
            originalName: doc.originalName,
            mimeType: doc.mimeType,
            fileSize: doc.fileSize || 0,
            isVerified: false,
          })),
        });
      }

      // 5. Create Brand Application
      const application = await tx.brandApplication.create({
        data: {
          brandId: brand.id,
          submittedBy: ownerUserId!,
          status: BrandStatus.PENDING_APPROVAL,
          submittedAt: new Date(),
        },
        include: {
          brand: true,
          applicant: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      });

      return application;
    });

    // Record Audit Log (Notice: absolutely no sensitive bank details in log payload)
    await this.auditLogsService.log({
      userId: ownerUserId,
      brandId: result.brandId,
      action: 'BRAND_APPLICATION_SUBMITTED',
      entity: 'BrandApplication',
      entityId: result.id,
      metadata: {
        brandName: result.brand.name,
        brandSlug: result.brand.slug,
        status: result.status,
      },
    });

    return {
      applicationId: result.id,
      referenceNumber: `MAK-${result.id.substring(0, 8).toUpperCase()}`,
      brandId: result.brandId,
      status: result.status,
      submittedAt: result.submittedAt,
      createdUser: createdUser ? { id: createdUser.id, email: createdUser.email } : null,
    };
  }

  /**
   * Get own submitted brand application
   */
  async getOwnApplication(userId: string) {
    const application = await this.prisma.brandApplication.findFirst({
      where: { submittedBy: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        brand: {
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
            documents: true,
          },
        },
        applicant: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException('No brand application found for this user account');
    }

    return application;
  }

  /**
   * Update own application (when in DRAFT or NEEDS_MORE_INFORMATION status)
   */
  async updateOwnApplication(userId: string, dto: UpdateBrandApplicationDto) {
    const application = await this.prisma.brandApplication.findFirst({
      where: { submittedBy: userId },
      orderBy: { createdAt: 'desc' },
      include: { brand: true },
    });

    if (!application) {
      throw new NotFoundException('Brand application not found');
    }

    if (
      application.status !== BrandStatus.NEEDS_MORE_INFORMATION &&
      application.status !== BrandStatus.DRAFT
    ) {
      throw new ForbiddenException(
        `Application cannot be updated in current status: ${application.status}. Updates are only allowed when additional information is requested.`,
      );
    }

    // Update Brand details
    await this.prisma.brand.update({
      where: { id: application.brandId },
      data: {
        name: dto.brandName?.trim(),
        description: dto.brandDescription?.trim(),
        businessType: dto.businessType,
        businessAddress: dto.businessAddress?.trim(),
        city: dto.city?.trim(),
        country: dto.country?.trim(),
        websiteUrl: dto.websiteUrl?.trim(),
        socialLinks: dto.socialLinks,
        logoUrl: dto.logoUrl,
        bannerUrl: dto.bannerUrl,
        businessRegNumber: dto.businessRegNumber?.trim(),
      },
    });

    // Update banking if provided
    if (dto.bankName && dto.accountHolderName && dto.accountNumber) {
      const existingBank = await this.prisma.brandBankAccount.findFirst({
        where: { brandId: application.brandId },
      });

      const accountNumberEncrypted = encryptData(dto.accountNumber);
      const accountNumberMasked = maskAccountNumber(dto.accountNumber);
      const ibanEncrypted = dto.iban ? encryptData(dto.iban) : null;
      const ibanMasked = dto.iban ? maskIban(dto.iban) : null;

      if (existingBank) {
        await this.prisma.brandBankAccount.update({
          where: { id: existingBank.id },
          data: {
            bankName: dto.bankName.trim(),
            accountHolderName: dto.accountHolderName.trim(),
            accountNumber: accountNumberMasked,
            accountNumberEncrypted,
            accountNumberMasked,
            iban: ibanMasked,
            ibanEncrypted,
            ibanMasked,
            branchCode: dto.branchCode?.trim() || null,
          },
        });
      }
    }

    // Update documents if provided
    if (dto.documents && dto.documents.length > 0) {
      await this.prisma.brandDocument.createMany({
        data: dto.documents.map((doc) => ({
          brandId: application.brandId,
          documentType: doc.documentType,
          fileKey: doc.fileKey,
          originalName: doc.originalName,
          mimeType: doc.mimeType,
          fileSize: doc.fileSize || 0,
        })),
      });
    }

    // Update application notes if owner provided an explanation
    if (dto.applicantNotes) {
      await this.prisma.brandApplication.update({
        where: { id: application.id },
        data: {
          adminNotes: application.adminNotes
            ? `${application.adminNotes}\n[Owner Response]: ${dto.applicantNotes}`
            : `[Owner Response]: ${dto.applicantNotes}`,
        },
      });
    }

    await this.auditLogsService.log({
      userId,
      brandId: application.brandId,
      action: 'BRAND_APPLICATION_UPDATED',
      entity: 'BrandApplication',
      entityId: application.id,
      metadata: {
        previousStatus: application.status,
      },
    });

    return this.getOwnApplication(userId);
  }

  /**
   * Resubmit application after providing requested information
   */
  async resubmitOwnApplication(userId: string) {
    const application = await this.prisma.brandApplication.findFirst({
      where: { submittedBy: userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!application) {
      throw new NotFoundException('Brand application not found');
    }

    if (
      application.status !== BrandStatus.NEEDS_MORE_INFORMATION &&
      application.status !== BrandStatus.DRAFT
    ) {
      throw new BadRequestException(
        `Application cannot be resubmitted from status: ${application.status}`,
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.brand.update({
        where: { id: application.brandId },
        data: { status: BrandStatus.PENDING_APPROVAL },
      });

      return tx.brandApplication.update({
        where: { id: application.id },
        data: {
          status: BrandStatus.PENDING_APPROVAL,
          submittedAt: new Date(),
        },
      });
    });

    await this.auditLogsService.log({
      userId,
      brandId: application.brandId,
      action: 'BRAND_APPLICATION_RESUBMITTED',
      entity: 'BrandApplication',
      entityId: application.id,
      metadata: {
        newStatus: BrandStatus.PENDING_APPROVAL,
      },
    });

    return updated;
  }
}
