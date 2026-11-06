import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateAuditLogParams {
  userId?: string;
  brandId?: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Sanitizes metadata to strictly remove any banking or sensitive credential data
   */
  private sanitizeMetadata(data?: Record<string, any>): Record<string, any> | undefined {
    if (!data) return undefined;

    const sanitized = { ...data };
    const sensitiveKeys = [
      'password',
      'passwordHash',
      'accountNumber',
      'accountNumberEncrypted',
      'iban',
      'ibanEncrypted',
      'refreshToken',
      'hashedRefreshToken',
      'secret',
    ];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeMetadata(sanitized[key]);
      }
    }

    return sanitized;
  }

  async log(params: CreateAuditLogParams) {
    try {
      const sanitizedMeta = this.sanitizeMetadata(params.metadata);

      return await this.prisma.auditLog.create({
        data: {
          userId: params.userId,
          brandId: params.brandId,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          metadata: sanitizedMeta as any,
        },
      });
    } catch (err: any) {
      this.logger.error(`Failed to record audit log: ${err.message}`, err.stack);
    }
  }

  async findByEntity(entity: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });
  }
}
