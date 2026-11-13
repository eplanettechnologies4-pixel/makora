export interface CodSettings {
  enabled: boolean;
  label: string;
  description: string;
  shippingFee: number;
  freeDeliveryThreshold: number;
  maxOrderAmount: number;
  supportedCities: string[];
}

export interface BankTransferSettings {
  enabled: boolean;
  label: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  branchCode: string;
  branchName: string;
  raastId: string;
  instructions: string;
  requiresSlipUpload: boolean;
}

export interface OnlineGatewaySettings {
  enabled: boolean;
  provider: 'payfast' | 'jazzcash' | 'easypaisa' | 'stripe';
  label: string;
  environment: 'sandbox' | 'live';
  merchantId: string;
  publicKey: string;
  supportedMethods: string[];
}

export interface CommissionSettings {
  defaultCommissionRate: number;
  payoutFrequency: 'WEEKLY' | 'BI_WEEKLY' | 'MONTHLY';
  minPayoutAmount: number;
  holdPeriodDays: number;
}

export interface MarketplacePaymentSettings {
  cod: CodSettings;
  bankTransfer: BankTransferSettings;
  onlineGateway: OnlineGatewaySettings;
  commission: CommissionSettings;
  lastUpdated?: string;
  updatedBy?: string;
}

export const DEFAULT_PAYMENT_SETTINGS: MarketplacePaymentSettings = {
  cod: {
    enabled: true,
    label: 'Cash on Delivery (COD)',
    description: 'Pay with physical cash upon package delivery directly at your doorstep.',
    shippingFee: 250,
    freeDeliveryThreshold: 5000,
    maxOrderAmount: 75000,
    supportedCities: [
      'All Pakistan',
      'Lahore',
      'Karachi',
      'Islamabad',
      'Rawalpindi',
      'Faisalabad',
      'Multan',
      'Peshawar',
      'Quetta',
      'Sialkot',
    ],
  },
  bankTransfer: {
    enabled: true,
    label: 'Direct Bank Transfer / Raast (IBFT)',
    bankName: 'Meezan Bank Limited',
    accountTitle: 'Makaura Luxury Marketplace Pvt Ltd',
    accountNumber: '0102-0105492819',
    iban: 'PK64MEZN0001020105492819',
    branchCode: '0102',
    branchName: 'Gulberg III Main Branch, Lahore',
    raastId: '03001234567',
    instructions:
      'Please transfer the exact order amount using your banking app or Raast. Mention your Order Number in the payment reference. Once completed, your order will be verified within 30 minutes.',
    requiresSlipUpload: true,
  },
  onlineGateway: {
    enabled: true,
    provider: 'payfast',
    label: 'PayFast / Visa, MasterCard, UnionPay & Wallets',
    environment: 'sandbox',
    merchantId: 'MKR-MERCHANT-88219',
    publicKey: 'pk_test_makaura_99214918231',
    supportedMethods: ['Visa', 'MasterCard', 'UnionPay', 'PayPak', 'JazzCash', 'EasyPaisa'],
  },
  commission: {
    defaultCommissionRate: 15,
    payoutFrequency: 'WEEKLY',
    minPayoutAmount: 10000,
    holdPeriodDays: 7,
  },
  lastUpdated: new Date().toISOString(),
  updatedBy: 'admin@makaura.com',
};

