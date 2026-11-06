import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BusinessType, DocumentType } from '@prisma/client';

export class BrandDocumentDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty()
  fileSize: number;
}

export class CreateBrandApplicationDto {
  // Step 1: Owner Details (required if not already authenticated)
  @ApiPropertyOptional({ example: 'Zainab' })
  @IsOptional()
  @IsString()
  ownerFirstName?: string;

  @ApiPropertyOptional({ example: 'Ahmed' })
  @IsOptional()
  @IsString()
  ownerLastName?: string;

  @ApiPropertyOptional({ example: 'brand@example.com' })
  @IsOptional()
  @IsEmail()
  ownerEmail?: string;

  @ApiPropertyOptional({ example: '+92 300 7654321' })
  @IsOptional()
  @IsString()
  ownerPhone?: string;

  @ApiPropertyOptional({ example: 'BrandPass123!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  ownerPassword?: string;

  // Step 2: Brand Details
  @ApiProperty({ example: 'Glow Botanics' })
  @IsString()
  @IsNotEmpty({ message: 'Brand name is required' })
  brandName: string;

  @ApiProperty({ example: 'glow-botanics' })
  @IsString()
  @IsNotEmpty({ message: 'Brand slug is required' })
  brandSlug: string;

  @ApiPropertyOptional({ example: 'Organic herbal skincare handcrafted in Lahore.' })
  @IsOptional()
  @IsString()
  brandDescription?: string;

  @ApiPropertyOptional({ enum: BusinessType, default: BusinessType.SOLE_PROPRIETORSHIP })
  @IsOptional()
  @IsEnum(BusinessType)
  businessType?: BusinessType;

  @ApiPropertyOptional({ example: 'Suite 401, Luxury Commerce Arcade' })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  @ApiPropertyOptional({ example: 'Lahore' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Pakistan', default: 'Pakistan' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'https://glowbotanics.example.com' })
  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: { instagram: '@glowbotanics' } })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800' })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  // Step 3: Verification
  @ApiPropertyOptional({ example: 'REG-987654-2026' })
  @IsOptional()
  @IsString()
  businessRegNumber?: string;

  @ApiPropertyOptional({ type: [BrandDocumentDto] })
  @IsOptional()
  @IsArray()
  documents?: BrandDocumentDto[];

  // Step 4: Banking Information
  @ApiProperty({ example: 'Standard Chartered Bank' })
  @IsString()
  @IsNotEmpty({ message: 'Bank name is required' })
  bankName: string;

  @ApiProperty({ example: 'Glow Botanics Pvt Ltd' })
  @IsString()
  @IsNotEmpty({ message: 'Account holder name is required' })
  accountHolderName: string;

  @ApiProperty({ example: '010123456789' })
  @IsString()
  @IsNotEmpty({ message: 'Account number is required' })
  accountNumber: string;

  @ApiPropertyOptional({ example: 'PK36SCBL0000001123456702' })
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiPropertyOptional({ example: 'Gulberg Branch (042)' })
  @IsOptional()
  @IsString()
  branchCode?: string;
}
