-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "BrandStatus" ADD VALUE 'DRAFT';
ALTER TYPE "BrandStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "BrandStatus" ADD VALUE 'NEEDS_MORE_INFORMATION';

-- AlterTable
ALTER TABLE "brand_applications" ADD COLUMN     "additionalInfoRequest" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "brand_bank_accounts" ADD COLUMN     "accountNumberEncrypted" TEXT,
ADD COLUMN     "accountNumberMasked" VARCHAR(50),
ADD COLUMN     "ibanEncrypted" TEXT,
ADD COLUMN     "ibanMasked" VARCHAR(50),
ALTER COLUMN "accountNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "businessRegNumber" VARCHAR(100),
ADD COLUMN     "socialLinks" JSONB,
ADD COLUMN     "websiteUrl" VARCHAR(500);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hashedRefreshToken" VARCHAR(255),
ADD COLUMN     "lastLoginAt" TIMESTAMPTZ(6);
