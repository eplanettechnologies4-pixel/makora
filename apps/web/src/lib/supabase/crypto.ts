import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getDerivedKey(keyHexOrSecret?: string): Buffer {
  const secret =
    keyHexOrSecret ||
    process.env.BANK_DATA_ENCRYPTION_KEY ||
    'c3b88b77d6928e493b8e4e9f7a6a4e3c98b67f12e4321908ab9876543210abcd';

  return crypto.createHash('sha256').update(secret).digest();
}

export function encryptData(plaintext: string, secretKey?: string): string {
  if (!plaintext) return '';
  const key = getDerivedKey(secretKey);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function maskAccountNumber(accountNumber?: string | null): string {
  if (!accountNumber) return '';
  const trimmed = accountNumber.trim();
  if (trimmed.length <= 4) return '****';
  const visible = trimmed.slice(-4);
  return `${'*'.repeat(trimmed.length - 4)}${visible}`;
}

export function maskIban(iban?: string | null): string {
  if (!iban) return '';
  const trimmed = iban.trim().replace(/\s+/g, '');
  if (trimmed.length <= 8) return '****';
  const prefix = trimmed.slice(0, 4);
  const suffix = trimmed.slice(-4);
  const middleMask = '*'.repeat(Math.max(4, trimmed.length - 8));
  return `${prefix}${middleMask}${suffix}`;
}

export function sanitizeAuditMetadata(
  data?: Record<string, any>,
): Record<string, any> | undefined {
  if (!data) return undefined;

  const sanitized: Record<string, any> = { ...data };
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
      sanitized[key] = sanitizeAuditMetadata(sanitized[key]);
    }
  }

  return sanitized;
}

