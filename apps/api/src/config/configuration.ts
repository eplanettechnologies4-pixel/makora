export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  appName: process.env.APP_NAME || 'Makaura Beauty API',
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_jwt_access_secret_change_in_production_9f8e7d6c5b4a',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_change_in_production_1a2b3c4d5e6f',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000').split(','),
  },
  storage: {
    driver: process.env.STORAGE_DRIVER || 'local',
    localRoot: process.env.STORAGE_LOCAL_ROOT || './uploads',
    publicBaseUrl: process.env.STORAGE_PUBLIC_BASE_URL || 'http://localhost:4000/uploads',
  },
  marketplace: {
    defaultCommissionPercent: parseFloat(process.env.DEFAULT_COMMISSION_PERCENT || '10.00'),
    settlementHoldDays: parseInt(process.env.SETTLEMENT_HOLD_DAYS || '3', 10),
  },
  security: {
    bankEncryptionKey:
      process.env.BANK_DATA_ENCRYPTION_KEY ||
      'c3b88b77d6928e493b8e4e9f7a6a4e3c98b67f12e4321908ab9876543210abcd',
  },
  adminSeed: {
    email: process.env.ADMIN_INITIAL_EMAIL || 'admin@makaura.com',
    password: process.env.ADMIN_INITIAL_PASSWORD || 'MakauraAdmin2026!Secure',
    firstName: process.env.ADMIN_INITIAL_FIRST_NAME || 'Makaura',
    lastName: process.env.ADMIN_INITIAL_LAST_NAME || 'SuperAdmin',
  },
});

