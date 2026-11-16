-- ==============================================================================
-- MAKAURA BEAUTY BRAND MULTI-VENDOR MARKETPLACE
-- Migration: Product Catalog, Categories, Multi-Vendor Orders & Customers
-- ==============================================================================

-- 1. Store & Marketplace Categories
CREATE TABLE IF NOT EXISTS public.categories (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "brandId" UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  "name" VARCHAR(150) NOT NULL,
  "slug" VARCHAR(180) NOT NULL,
  "description" TEXT,
  "iconUrl" VARCHAR(1000),
  "displayOrder" INT DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_brandId ON public.categories("brandId");
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories("slug");

-- 2. Products
CREATE TABLE IF NOT EXISTS public.products (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "brandId" UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  "categoryId" UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(280) NOT NULL,
  "sku" VARCHAR(100),
  "description" TEXT,
  "shortDescription" VARCHAR(500),
  "basePrice" DECIMAL(12, 2) NOT NULL,
  "compareAtPrice" DECIMAL(12, 2),
  "costPrice" DECIMAL(12, 2),
  "stockQuantity" INT NOT NULL DEFAULT 0,
  "lowStockThreshold" INT DEFAULT 5,
  "status" VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'DRAFT', 'OUT_OF_STOCK', 'ARCHIVED'
  "images" JSONB DEFAULT '[]'::jsonb,
  "specs" JSONB DEFAULT '[]'::jsonb,
  "attributes" JSONB DEFAULT '{}'::jsonb,
  "rating" DECIMAL(3, 2) DEFAULT 5.0,
  "reviewCount" INT DEFAULT 0,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_brandId ON public.products("brandId");
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products("slug");
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products("status");

-- 3. Seller Sub-Orders & Fulfillment
CREATE TABLE IF NOT EXISTS public.seller_orders (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "orderNumber" VARCHAR(50) NOT NULL UNIQUE,
  "brandId" UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  "customerName" VARCHAR(150) NOT NULL,
  "customerEmail" VARCHAR(255),
  "customerPhone" VARCHAR(50),
  "shippingAddress" TEXT NOT NULL,
  "shippingCity" VARCHAR(100) NOT NULL,
  "items" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "subtotal" DECIMAL(12, 2) NOT NULL,
  "shippingFee" DECIMAL(12, 2) DEFAULT 0,
  "totalAmount" DECIMAL(12, 2) NOT NULL,
  "commissionPercent" DECIMAL(5, 2) DEFAULT 10.00,
  "commissionAmount" DECIMAL(12, 2) DEFAULT 0,
  "netPayable" DECIMAL(12, 2) DEFAULT 0,
  "paymentMethod" VARCHAR(50) DEFAULT 'COD',
  "codStatus" VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'COLLECTED', 'REMITTED'
  "fulfillmentStatus" VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'
  "courierName" VARCHAR(100),
  "trackingNumber" VARCHAR(100),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seller_orders_brandId ON public.seller_orders("brandId");
CREATE INDEX IF NOT EXISTS idx_seller_orders_status ON public.seller_orders("fulfillmentStatus");
