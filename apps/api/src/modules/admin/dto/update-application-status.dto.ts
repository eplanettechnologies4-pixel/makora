import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BrandStatus } from '@prisma/client';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    enum: BrandStatus,
    description: 'Target status: APPROVED, REJECTED, NEEDS_MORE_INFORMATION, or UNDER_REVIEW',
  })
  @IsEnum(BrandStatus)
  @IsNotEmpty()
  status: BrandStatus;

  @ApiPropertyOptional({
    description: 'Mandatory when rejecting an application',
    example: 'Missing valid proof of commercial cosmetics registration in Pakistan',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional({
    description: 'Mandatory when requesting more information',
    example: 'Please provide a clearer photo of your business tax certificate (NTN).',
  })
  @IsOptional()
  @IsString()
  additionalInfoRequest?: string;

  @ApiPropertyOptional({
    description: 'Internal administrative notes',
    example: 'Verified SECP registration on 02-Nov-2026',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
