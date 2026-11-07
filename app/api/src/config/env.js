import 'dotenv/config';

const betterAuthSecret = process.env.BETTER_AUTH_SECRET;
const required = ['MONGO_URI', 'BETTER_AUTH_SECRET'];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Falta variables requeridas: ${missing.join(', ')}`);
}
if (betterAuthSecret.length < 32) {
  throw new Error('BETTER_AUTH_SECRET debe tener al menos 32 caracteres');
}

const port = process.env.PORT ?? 3000;
const corsOrigin = (process.env.CORS_ORIGIN ?? 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (corsOrigin.length === 0 || corsOrigin.includes('*')) {
  throw new Error('CORS_ORIGIN debe especificar uno o más orígenes permitidos');
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port,
  mongoUri: process.env.MONGO_URI,
  corsOrigin,
  betterAuthSecret,
  betterAuthUrl: process.env.BETTER_AUTH_URL ?? `http://localhost:${port}`,
  seedOwner:{
    name: process.env.SEED_OWNER_NAME ?? 'admin',
    email: process.env.SEED_OWNER_EMAIL ?? 'owner@vetcare.dev',
    password: process.env.SEED_OWNER_PASSWORD ?? 'admin123'
  }
};