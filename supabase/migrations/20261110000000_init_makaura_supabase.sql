-- ==============================================================================
-- MAKAURA BEAUTY BRAND MULTI-VENDOR MARKETPLACE — SUPABASE SCHEMA & RLS MIGRATION
-- Mirrors apps/api/prisma/schema.prisma + Auth sync + RBAC + RLS Policies
-- Run this in your Supabase Dashboard -> SQL Editor (or via Supabase CLI).
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ENUMS (Safe idempotent creation)
-- ------------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE "UserRoleType" AS ENUM (
    'CUSTOMER',
    'BRAND_OWNER',
    'BRAND_STAFF',
    'ADMIN',
    'SUPER_ADMIN'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BrandStatus" AS ENUM (
    'DRAFT',
    'PENDING_APPROVAL',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'NEEDS_MORE_INFORMATION',
    'REQUIRES_INFO',
    'SUSPENDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BusinessType" AS ENUM (
    'INDIVIDUAL',
    'SOLE_PROPRIETORSHIP',
    'PARTNERSHIP',
    'PRIVATE_LIMITED',
    'CORPORATION'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "DocumentType" AS ENUM (
    'CNIC_FRONT',
    'CNIC_BACK',
    'NTN_CERTIFICATE',
    'BUSINESS_REGISTRATION',
    'CHEQUE_LEAF',
    'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "BrandMemberRole" AS ENUM (
    'OWNER',
    'MANAGER',
    'STAFF'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------------------------
-- 2. TABLES
-- ------------------------------------------------------------------------------

-- Application users table linked 1:1 to Supabase auth.users(id)
CREATE TABLE IF NOT EXISTS public.users (
  "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "passwordHash" VARCHAR(255),
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(30),
  "role" "UserRoleType" NOT NULL DEFAULT 'CUSTOMER',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "hashedRefreshToken" VARCHAR(255),
  "lastLoginAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMPTZ(6)
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  "avatarUrl" VARCHAR(1000),
  "bio" TEXT,
  "dateOfBirth" DATE,
  "gender" VARCHAR(30),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_addresses (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "label" VARCHAR(50),
  "recipientName" VARCHAR(150) NOT NULL,
  "phone" VARCHAR(30) NOT NULL,
  "streetAddress" VARCHAR(255) NOT NULL,
  "apartment" VARCHAR(100),
  "city" VARCHAR(100) NOT NULL,
  "state" VARCHAR(100),
  "postalCode" VARCHAR(20),
  "country" VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
  "isDefaultShipping" BOOLEAN NOT NULL DEFAULT false,
  "isDefaultBilling" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roles (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(50) NOT NULL UNIQUE,
  "description" VARCHAR(255),
  "isSystem" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "module" VARCHAR(50) NOT NULL,
  "description" VARCHAR(255),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  "roleId" UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  "permissionId" UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("roleId", "permissionId")
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "roleId" UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  PRIMARY KEY ("userId", "roleId")
);

CREATE TABLE IF NOT EXISTS public.brands (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(150) NOT NULL,
  "slug" VARCHAR(180) NOT NULL UNIQUE,
  "description" TEXT,
  "story" TEXT,
  "logoUrl" VARCHAR(1000),
  "bannerUrl" VARCHAR(1000),
  "status" "BrandStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
  "businessType" "BusinessType" NOT NULL DEFAULT 'SOLE_PROPRIETORSHIP',
  "businessAddress" VARCHAR(255),
  "city" VARCHAR(100),
  "country" VARCHAR(100) NOT NULL DEFAULT 'Pakistan',
  "websiteUrl" VARCHAR(500),
  "socialLinks" JSONB,
  "businessRegNumber" VARCHAR(100),
  "commissionRate" DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
  "ownerId" UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  "approvedAt" TIMESTAMPTZ(6),
  "approvedById" UUID REFERENCES public.users(id) ON DELETE SET NULL,
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "deletedAt" TIMESTAMPTZ(6)
);

CREATE TABLE IF NOT EXISTS public.brand_members (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "brandId" UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "role" "BrandMemberRole" NOT NULL DEFAULT 'STAFF',
  "isAccepted" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  UNIQUE ("brandId", "userId")
);

CREATE TABLE IF NOT EXISTS public.brand_applications (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "brandId" UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  "submittedBy" UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  "status" "BrandStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
  "adminNotes" TEXT,
  "rejectionReason" TEXT,
  "additionalInfoRequest" TEXT,
  "submittedAt" TIMESTAMPTZ(6),
  "reviewedById" UUID REFERENCES public.users(id) ON DELETE SET NULL,
  "reviewedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.brand_bank_accounts (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "brandId" UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  "bankName" VARCHAR(150) NOT NULL,
  "accountHolderName" VARCHAR(150) NOT NULL,
  "accountNumber" VARCHAR(100),
  "accountNumberEncrypted" TEXT,
  "accountNumberMasked" VARCHAR(50),
  "iban" VARCHAR(50),
  "ibanEncrypted" TEXT,
  "ibanMasked" VARCHAR(50),
  "branchCode" VARCHAR(50),
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "verifiedAt" TIMESTAMPTZ(6),
  "verifiedById" UUID,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.brand_documents (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "brandId" UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  "documentType" "DocumentType" NOT NULL,
  "fileKey" VARCHAR(500) NOT NULL,
  "originalName" VARCHAR(255) NOT NULL,
  "mimeType" VARCHAR(100) NOT NULL,
  "fileSize" INTEGER NOT NULL DEFAULT 0,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "verifiedAt" TIMESTAMPTZ(6),
  "verifiedById" UUID,
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID REFERENCES public.users(id) ON DELETE SET NULL,
  "brandId" UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  "action" VARCHAR(100) NOT NULL,
  "entity" VARCHAR(50) NOT NULL,
  "entityId" VARCHAR(100) NOT NULL,
  "ipAddress" VARCHAR(45),
  "userAgent" VARCHAR(255),
  "metadata" JSONB,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_settings (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" VARCHAR(100) NOT NULL UNIQUE,
  "value" TEXT NOT NULL,
  "description" VARCHAR(255),
  "isPublic" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES
-- ------------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "users_email_idx" ON public.users("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON public.users("role");
CREATE INDEX IF NOT EXISTS "users_isActive_idx" ON public.users("isActive");
CREATE INDEX IF NOT EXISTS "user_addresses_userId_idx" ON public.user_addresses("userId");
CREATE INDEX IF NOT EXISTS "permissions_module_idx" ON public.permissions("module");
CREATE INDEX IF NOT EXISTS "brands_slug_idx" ON public.brands("slug");
CREATE INDEX IF NOT EXISTS "brands_status_idx" ON public.brands("status");
CREATE INDEX IF NOT EXISTS "brands_ownerId_idx" ON public.brands("ownerId");
CREATE INDEX IF NOT EXISTS "brand_members_brandId_idx" ON public.brand_members("brandId");
CREATE INDEX IF NOT EXISTS "brand_members_userId_idx" ON public.brand_members("userId");
CREATE INDEX IF NOT EXISTS "brand_applications_brandId_idx" ON public.brand_applications("brandId");
CREATE INDEX IF NOT EXISTS "brand_applications_submittedBy_idx" ON public.brand_applications("submittedBy");
CREATE INDEX IF NOT EXISTS "brand_applications_status_idx" ON public.brand_applications("status");
CREATE INDEX IF NOT EXISTS "brand_bank_accounts_brandId_idx" ON public.brand_bank_accounts("brandId");
CREATE INDEX IF NOT EXISTS "brand_documents_brandId_idx" ON public.brand_documents("brandId");
CREATE INDEX IF NOT EXISTS "brand_documents_documentType_idx" ON public.brand_documents("documentType");
CREATE INDEX IF NOT EXISTS "audit_logs_action_idx" ON public.audit_logs("action");
CREATE INDEX IF NOT EXISTS "audit_logs_entity_entityId_idx" ON public.audit_logs("entity", "entityId");
CREATE INDEX IF NOT EXISTS "audit_logs_userId_idx" ON public.audit_logs("userId");
CREATE INDEX IF NOT EXISTS "audit_logs_brandId_idx" ON public.audit_logs("brandId");
CREATE INDEX IF NOT EXISTS "audit_logs_createdAt_idx" ON public.audit_logs("createdAt");

-- ------------------------------------------------------------------------------
-- 4. AUTOMATIC updatedAt & SUPABASE AUTH USER SYNC TRIGGERS
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_user_addresses_updated_at ON public.user_addresses;
CREATE TRIGGER set_user_addresses_updated_at BEFORE UPDATE ON public.user_addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_roles_updated_at ON public.roles;
CREATE TRIGGER set_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_permissions_updated_at ON public.permissions;
CREATE TRIGGER set_permissions_updated_at BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_brands_updated_at ON public.brands;
CREATE TRIGGER set_brands_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_brand_members_updated_at ON public.brand_members;
CREATE TRIGGER set_brand_members_updated_at BEFORE UPDATE ON public.brand_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_brand_applications_updated_at ON public.brand_applications;
CREATE TRIGGER set_brand_applications_updated_at BEFORE UPDATE ON public.brand_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_brand_bank_accounts_updated_at ON public.brand_bank_accounts;
CREATE TRIGGER set_brand_bank_accounts_updated_at BEFORE UPDATE ON public.brand_bank_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_brand_documents_updated_at ON public.brand_documents;
CREATE TRIGGER set_brand_documents_updated_at BEFORE UPDATE ON public.brand_documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_system_settings_updated_at ON public.system_settings;
CREATE TRIGGER set_system_settings_updated_at BEFORE UPDATE ON public.system_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Sync new Supabase Auth signups into public.users (strictly locked to CUSTOMER)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    "id",
    "email",
    "firstName",
    "lastName",
    "phone",
    "role",
    "isActive",
    "emailVerified"
  )
  VALUES (
    NEW.id,
    LOWER(TRIM(NEW.email)),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data ->> 'firstName'), ''), 'Makaura'),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data ->> 'lastName'), ''), 'User'),
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'phone'), ''),
    'CUSTOMER'::"UserRoleType",
    true,
    (NEW.email_confirmed_at IS NOT NULL)
  )
  ON CONFLICT ("id") DO UPDATE
  SET
    "email" = EXCLUDED."email",
    "emailVerified" = (NEW.email_confirmed_at IS NOT NULL),
    "updatedAt" = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

CREATE OR REPLACE FUNCTION public.handle_auth_user_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET
    "email" = LOWER(TRIM(NEW.email)),
    "emailVerified" = (NEW.email_confirmed_at IS NOT NULL),
    "updatedAt" = NOW()
  WHERE "id" = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email, email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_updated();

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS "UserRoleType"
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT "role" FROM public.users WHERE "id" = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(public.current_user_role() IN ('ADMIN'::"UserRoleType", 'SUPER_ADMIN'::"UserRoleType"), false);
$$;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- users policies
DROP POLICY IF EXISTS "users_select_own_or_admin" ON public.users;
CREATE POLICY "users_select_own_or_admin" ON public.users
  FOR SELECT TO authenticated
  USING ("id" = auth.uid() OR public.is_admin());

-- user_profiles policies
DROP POLICY IF EXISTS "user_profiles_own" ON public.user_profiles;
CREATE POLICY "user_profiles_own" ON public.user_profiles
  FOR ALL TO authenticated
  USING ("userId" = auth.uid() OR public.is_admin())
  WITH CHECK ("userId" = auth.uid() OR public.is_admin());

-- user_addresses policies
DROP POLICY IF EXISTS "user_addresses_own" ON public.user_addresses;
CREATE POLICY "user_addresses_own" ON public.user_addresses
  FOR ALL TO authenticated
  USING ("userId" = auth.uid() OR public.is_admin())
  WITH CHECK ("userId" = auth.uid() OR public.is_admin());

-- brands policies
DROP POLICY IF EXISTS "brands_select_approved_or_owner_or_admin" ON public.brands;
CREATE POLICY "brands_select_approved_or_owner_or_admin" ON public.brands
  FOR SELECT
  USING (
    "status" = 'APPROVED'::"BrandStatus"
    OR "ownerId" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.brand_members bm
      WHERE bm."brandId" = brands."id" AND bm."userId" = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "brands_update_owner_or_admin" ON public.brands;
CREATE POLICY "brands_update_owner_or_admin" ON public.brands
  FOR UPDATE TO authenticated
  USING (
    "ownerId" = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.brand_members bm
      WHERE bm."brandId" = brands."id"
        AND bm."userId" = auth.uid()
        AND bm."role" IN ('OWNER'::"BrandMemberRole", 'MANAGER'::"BrandMemberRole")
    )
    OR public.is_admin()
  );

-- brand_members policies
DROP POLICY IF EXISTS "brand_members_select_own_or_admin" ON public.brand_members;
CREATE POLICY "brand_members_select_own_or_admin" ON public.brand_members
  FOR SELECT TO authenticated
  USING ("userId" = auth.uid() OR public.is_admin());

-- brand_applications policies
DROP POLICY IF EXISTS "brand_applications_select_own_or_admin" ON public.brand_applications;
CREATE POLICY "brand_applications_select_own_or_admin" ON public.brand_applications
  FOR SELECT TO authenticated
  USING ("submittedBy" = auth.uid() OR public.is_admin());

-- brand_bank_accounts: strictly deny direct PostgREST access so encrypted ciphertext
-- is never selectable directly from browser clients (Server Actions use service_role
-- and strip encrypted/plaintext values before returning masked fields).
DROP POLICY IF EXISTS "brand_bank_accounts_deny_direct" ON public.brand_bank_accounts;
CREATE POLICY "brand_bank_accounts_deny_direct" ON public.brand_bank_accounts
  FOR ALL TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- brand_documents policies
DROP POLICY IF EXISTS "brand_documents_select_owner_or_admin" ON public.brand_documents;
CREATE POLICY "brand_documents_select_owner_or_admin" ON public.brand_documents
  FOR SELECT TO authenticated
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.brands b
      WHERE b."id" = brand_documents."brandId"
        AND (b."ownerId" = auth.uid() OR EXISTS (
          SELECT 1 FROM public.brand_members bm WHERE bm."brandId" = b."id" AND bm."userId" = auth.uid()
        ))
    )
  );

-- audit_logs policies (admins only; writes handled server-side)
DROP POLICY IF EXISTS "audit_logs_select_admin" ON public.audit_logs;
CREATE POLICY "audit_logs_select_admin" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- system_settings policies
DROP POLICY IF EXISTS "system_settings_select_public_or_admin" ON public.system_settings;
CREATE POLICY "system_settings_select_public_or_admin" ON public.system_settings
  FOR SELECT
  USING ("isPublic" = true OR public.is_admin());

-- roles / permissions policies
DROP POLICY IF EXISTS "roles_select_authenticated" ON public.roles;
CREATE POLICY "roles_select_authenticated" ON public.roles
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "permissions_select_admin" ON public.permissions;
CREATE POLICY "permissions_select_admin" ON public.permissions
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. SEED DEFAULT RBAC ROLES & PERMISSIONS (mirrors apps/api/prisma/seed.ts)
-- ------------------------------------------------------------------------------

INSERT INTO public.roles ("name", "description", "isSystem")
VALUES
  ('CUSTOMER', 'Marketplace retail customer', true),
  ('BRAND_OWNER', 'Beauty brand owner and primary seller', true),
  ('BRAND_STAFF', 'Brand store manager or fulfillment operator', true),
  ('ADMIN', 'Marketplace administrator with operational access', true),
  ('SUPER_ADMIN', 'Platform super administrator with root privileges', true)
ON CONFLICT ("name") DO UPDATE SET "description" = EXCLUDED."description";

INSERT INTO public.permissions ("name", "module", "description")
VALUES
  ('brands:view', 'brands', 'View brand catalogs'),
  ('brands:apply', 'brands', 'Submit brand application'),
  ('brands:manage', 'brands', 'Manage own brand profile'),
  ('brands:approve', 'brands', 'Approve or reject brand applications'),
  ('applications:review', 'admin', 'Review onboarding applications'),
  ('users:manage', 'admin', 'Manage marketplace user accounts'),
  ('settlements:manage', 'settlements', 'Manage COD settlements')
ON CONFLICT ("name") DO UPDATE SET "description" = EXCLUDED."description";

INSERT INTO public.role_permissions ("roleId", "permissionId")
SELECT r."id", p."id"
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r."name" IN ('ADMIN', 'SUPER_ADMIN')
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

-- ------------------------------------------------------------------------------
-- OPTIONAL ADMIN PROMOTION SNIPPET:
-- After creating your admin user via Supabase Auth (or signing up at /register),
-- run this in the Supabase SQL Editor to grant ADMIN privileges:
--
-- UPDATE public.users
-- SET "role" = 'ADMIN'::"UserRoleType", "emailVerified" = true
-- WHERE "email" = 'admin@makaura.com';
-- ------------------------------------------------------------------------------

