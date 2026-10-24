import 'dotenv/config';

const required = ['MONGO_URI', 'JWT_SECRET'];

const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Falta variables requeridas: ${missing.join(', ')}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? 3000,
  mongoUri: process.env.MONGO_URI,
  corsOrigin: process.env.CORS_ORIGIN?.split(',') ?? '*',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  seedOwner:{
    name: process.env.SEED_OWNER_NAME ?? 'admin',
    email: process.env.SEED_OWNER_EMAIL ?? 'owner@vetcare.dev',
    password: process.env.SEED_OWNER_PASSWORD ?? 'admin123'
  }
};