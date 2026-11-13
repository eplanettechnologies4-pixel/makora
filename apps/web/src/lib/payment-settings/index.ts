import fs from 'fs';
import path from 'path';
import { MarketplacePaymentSettings, DEFAULT_PAYMENT_SETTINGS } from './types';

export * from './types';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'payment_settings.json');

export function getFilePaymentSettings(): MarketplacePaymentSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading payment_settings.json:', err);
  }
  return DEFAULT_PAYMENT_SETTINGS;
}

export function saveFilePaymentSettings(settings: MarketplacePaymentSettings): void {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing payment_settings.json:', err);
  }
}
