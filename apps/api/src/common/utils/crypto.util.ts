import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

/**
 * Derives a 32-byte Buffer key from the provided secret string or hex
 */
function getDerivedKey(keyHexOrSecret?: string): Buffer {
  const secret =
    keyHexOrSecret ||
    process.env.BANK_DATA_ENCRYPTION_KEY ||
    'c3b88b77d6928e493b8e4e9f7a6a4e3c98b67f12e4321908ab9876543210abcd';

  return crypto.createHash('sha256').update(secret).digest();
}

/**
 * Encrypts a string using AES-256-GCM
 * Output format: ivHex:authTagHex:encryptedHex
 */
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

/**
 * Decrypts an AES-256-GCM encrypted string
 */
export function decryptData(cipherPayload: string, secretKey?: string): string {
  if (!cipherPayload) return '';
  const parts = cipherPayload.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid cipher payload format');
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const key = getDerivedKey(secretKey);
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Masks bank account number, displaying only the last 4 characters
 * e.g., "1234567890" -> "******7890"
 */
export function maskAccountNumber(accountNumber?: string | null): string {
  if (!accountNumber) return '';
  const trimmed = accountNumber.trim();
  if (trimmed.length <= 4) return '****';
  const visible = trimmed.slice(-4);
  return `${'*'.repeat(trimmed.length - 4)}${visible}`;
}

/**
 * Masks an IBAN, displaying the first 4 (country/check) and last 4 digits
 * e.g., "PK36SCBL0000001123456702" -> "PK36**************6702"
 */
export function maskIban(iban?: string | null): string {
  if (!iban) return '';
  const trimmed = iban.trim().replace(/\s+/g, '');
  if (trimmed.length <= 8) return '****';
  const prefix = trimmed.slice(0, 4);
  const suffix = trimmed.slice(-4);
  const middleMask = '*'.repeat(Math.max(4, trimmed.length - 8));
  return `${prefix}${middleMask}${suffix}`;
}

/**
 * Password hashing with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Password comparison with bcrypt
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Hash refresh token using SHA-256 for secure storage and constant-time lookup
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
