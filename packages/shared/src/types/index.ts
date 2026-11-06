import {
  UserRole,
  BrandStatus,
  BusinessType,
  OrderStatus,
  SellerOrderStatus,
  CodStatus,
  SettlementStatus,
  DocumentType,
} from '../enums';

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date | string;
}

export interface BrandSummary {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  status: BrandStatus;
  businessType: BusinessType;
  ownerId: string;
  createdAt: Date | string;
}

export interface BrandBankAccountSummary {
  id: string;
  brandId: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  iban?: string | null;
  branchCode?: string | null;
  isVerified: boolean;
}

export interface BrandDocumentSummary {
  id: string;
  brandId: string;
  documentType: DocumentType;
  fileKey: string;
  originalName: string;
  mimeType: string;
  isVerified: boolean;
  uploadedAt: Date | string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error';
      responseTimeMs?: number;
      message?: string;
    };
    redis: {
      status: 'connected' | 'disconnected' | 'error';
      responseTimeMs?: number;
      message?: string;
    };
  };
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  brand?: {
    id: string;
    name: string;
    slug: string;
    status: BrandStatus;
  } | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

export interface BrandApplicationDetail {
  id: string;
  brandId: string;
  submittedBy: string;
  status: BrandStatus;
  adminNotes?: string | null;
  rejectionReason?: string | null;
  additionalInfoRequest?: string | null;
  reviewedById?: string | null;
  reviewedAt?: Date | string | null;
  submittedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  brand: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    status: BrandStatus;
    businessType: BusinessType;
    businessAddress?: string | null;
    city?: string | null;
    country: string;
    websiteUrl?: string | null;
    socialLinks?: any;
    businessRegNumber?: string | null;
    bankAccounts?: Array<{
      id: string;
      bankName: string;
      accountHolderName: string;
      accountNumberMasked?: string | null;
      ibanMasked?: string | null;
      isVerified: boolean;
    }>;
    documents?: Array<{
      id: string;
      documentType: DocumentType;
      fileKey: string;
      originalName: string;
      mimeType: string;
      fileSize: number;
      isVerified: boolean;
    }>;
  };
  applicant: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

