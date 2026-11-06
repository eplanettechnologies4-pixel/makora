import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ApplicationFilterDto } from './dto/application-filter.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { BrandStatus, Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) {}

  /**
   * List brand applications with filtering, search, pagination, and sorting
   */
  async listApplications(filter: ApplicationFilterDto) {
    const page = filter.page && filter.page > 0 ? Number(filter.page) : 1;
    const limit = filter.limit && filter.limit > 0 ? Number(filter.limit) : 10;
    const skip = (page - 1) * limit;

    const where: Prisma.BrandApplicationWhereInput = {};

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.search) {
      const search = filter.search.trim();
      where.OR = [
        { brand: { name: { contains: search, mode: 'insensitive' } } },
        { brand: { slug: { contains: search, mode: 'insensitive' } } },
        { applicant: { email: { contains: search, mode: 'insensitive' } } },
        { applicant: { firstName: { contains: search, mode: 'insensitive' } } },
        { applicant: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const sortOrder: Prisma.SortOrder = filter.sortOrder === 'asc' ? 'asc' : 'desc';
    const orderBy: Prisma.BrandApplicationOrderByWithRelationInput = {
      [filter.sortBy || 'createdAt']: sortOrder,
    };

    const [total, items] = await Promise.all([
      this.prisma.brandApplication.count({ where }),
      this.prisma.brandApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
              country: true,
              businessType: true,
              status: true,
              logoUrl: true,
            },
          },
          applicant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single application details by ID (with masked bank info and audit history)
   */
  async getApplicationById(id: string) {
    const application = await this.prisma.brandApplication.findUnique({
      where: { id },
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
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Brand application with ID ${id} not found`);
    }

    // Fetch audit history for this application
    const auditLogs = await this.auditLogsService.findByEntity('BrandApplication', id);

    return {
      ...application,
      auditLogs,
    };
  }

  /**
   * Update brand application status (Approve, Reject, Request Info, Under Review)
   */
  async updateApplicationStatus(
    id: string,
    adminUserId: string,
    dto: UpdateApplicationStatusDto,
  ) {
    const application = await this.prisma.brandApplication.findUnique({
      where: { id },
      include: { brand: true },
    });

    if (!application) {
      throw new NotFoundException(`Brand application with ID ${id} not found`);
    }

    if (dto.status === BrandStatus.REJECTED && !dto.rejectionReason?.trim()) {
      throw new BadRequestException('A reason is required when rejecting a brand application');
    }

    if (
      dto.status === BrandStatus.NEEDS_MORE_INFORMATION &&
      !dto.additionalInfoRequest?.trim()
    ) {
      throw new BadRequestException(
        'A descriptive message is required when requesting additional information from the brand owner',
      );
    }

    const previousStatus = application.status;
    const now = new Date();

    const updated = await this.prisma.$transaction(async (tx) => {
      // 1. Synchronize Brand Status
      const brandUpdateData: Prisma.BrandUpdateInput = {
        status: dto.status,
      };

      if (dto.status === BrandStatus.APPROVED) {
        brandUpdateData.approvedAt = now;
        brandUpdateData.approvedBy = { connect: { id: adminUserId } };
        brandUpdateData.rejectionReason = null;
      } else if (dto.status === BrandStatus.REJECTED) {
        brandUpdateData.rejectionReason = dto.rejectionReason?.trim();
      }

      await tx.brand.update({
        where: { id: application.brandId },
        data: brandUpdateData,
      });

      // 2. Update Brand Application
      const updatedApp = await tx.brandApplication.update({
        where: { id },
        data: {
          status: dto.status,
          adminNotes: dto.adminNotes?.trim() || application.adminNotes,
          rejectionReason:
            dto.status === BrandStatus.REJECTED
              ? dto.rejectionReason?.trim()
              : application.rejectionReason,
          additionalInfoRequest:
            dto.status === BrandStatus.NEEDS_MORE_INFORMATION
              ? dto.additionalInfoRequest?.trim()
              : application.additionalInfoRequest,
          reviewedById: adminUserId,
          reviewedAt: now,
        },
        include: {
          brand: true,
          applicant: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return updatedApp;
    });

    // Record Audit Log
    await this.auditLogsService.log({
      userId: adminUserId,
      brandId: application.brandId,
      action: `BRAND_APPLICATION_${dto.status}`,
      entity: 'BrandApplication',
      entityId: id,
      metadata: {
        previousStatus,
        newStatus: dto.status,
        reason: dto.rejectionReason || dto.additionalInfoRequest || dto.adminNotes,
      },
    });

    return updated;
  }
}
