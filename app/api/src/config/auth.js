import argon2 from 'argon2';
import bcrypt from 'bcryptjs';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import mongoose from 'mongoose';
import { env } from './env.js';
import { User } from '../modules/users/user.model.js';
import { ROLES } from '../utils/roles.js';

let authInstance;

/**
 * Genera un hash criptográficamente seguro con Argon2id (OWASP A02:2021).
 */
export async function hashPassword(plainPassword) {
  if (!plainPassword || typeof plainPassword !== 'string') {
    throw new Error('La contraseña a hashear debe ser una cadena válida');
  }
  return argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB de memoria (resistente a GPU/ASIC)
    timeCost: 3,       // 3 iteraciones
    parallelism: 4,    // 4 hilos concurrentes
  });
}

/**
 * Verifica una contraseña de forma segura. Compatible con Argon2id y hashes legacy de Bcrypt.
 */
export async function verifyPassword({ password, hash }) {
  if (!hash || typeof hash !== 'string' || !password || typeof password !== 'string') {
    return false;
  }
  if (hash.startsWith('$argon2')) {
    return argon2.verify(hash, password);
  }
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    return bcrypt.compare(password, hash);
  }
  return false;
}

export function getAuth() {
  if (!mongoose.connection.db) {
    throw new Error('La base de datos debe estar conectada antes de inicializar Better Auth');
  }

  if (!authInstance) {
    authInstance = betterAuth({
      appName: 'VetCare',
      baseURL: env.betterAuthUrl,
      basePath: '/api/auth',
      secret: env.betterAuthSecret,
      trustedOrigins: env.corsOrigin,
      database: mongodbAdapter(mongoose.connection.db, { transaction: false }),
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        maxPasswordLength: 72,
        password: {
          hash: hashPassword,
          verify: verifyPassword,
        },
      },
      user: {
        additionalFields: {
          role: {
            type: 'string',
            required: true,
            defaultValue: ROLES.CLIENT,
            input: false,
          },
          active: {
            type: 'boolean',
            required: true,
            defaultValue: true,
            input: false,
          },
          phone: {
            type: 'string',
            required: false,
            input: true,
          },
        },
      },
      advanced: {
        database: { generateId: false },
        defaultCookieAttributes: {
          httpOnly: true,
          sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
          secure: env.nodeEnv === 'production',
        },
      },
      databaseHooks: {
        user: {
          create: {
            after: async (authUser) => {
              await User.create({
                _id: authUser.id,
                name: authUser.name,
                email: authUser.email,
                phone: authUser.phone,
                role: authUser.role,
                active: authUser.active,
              });
            },
          },
        },
        session: {
          create: {
            before: async (session) => {
              const profile = await User.findById(session.userId);
              return !profile || profile.active;
            },
          },
        },
      },
      rateLimit: {
        enabled: env.nodeEnv !== 'test',
        window: 600,
        max: 20,
      },
    });
  }

  return authInstance;
}

/**
 * Aprovisiona la cuenta en Better Auth garantizando que la contraseña NUNCA se guarde en texto plano.
 */
export async function provisionAuthAccount(user, rawOrHashedPassword) {
  if (!mongoose.connection.db) {
    throw new Error('La base de datos debe estar conectada antes de crear una cuenta');
  }

  const candidatePassword = rawOrHashedPassword ?? user.password;
  if (!candidatePassword) {
    throw new Error('El usuario debe tener una contraseña para crear una cuenta Better Auth');
  }

  // Guardia defensiva: ¿ya es un hash seguro o viene en texto plano?
  const isAlreadyHashed =
    typeof candidatePassword === 'string' &&
    (candidatePassword.startsWith('$argon2') ||
      candidatePassword.startsWith('$2a$') ||
      candidatePassword.startsWith('$2b$') ||
      candidatePassword.startsWith('$2y$'));

  const securePasswordHash = isAlreadyHashed
    ? candidatePassword
    : await hashPassword(candidatePassword);

  const database = mongoose.connection.db;
  const userId = user._id;
  const userIdString = userId.toString();
  const now = new Date();

  await database.collection('user').updateOne(
    { _id: userId },
    {
      $setOnInsert: {
        name: user.name,
        email: user.email,
        emailVerified: false,
        createdAt: user.createdAt ?? now,
      },
      $set: {
        updatedAt: user.updatedAt ?? now,
        role: user.role,
        active: user.active,
        ...(user.phone ? { phone: user.phone } : {}),
      },
    },
    { upsert: true },
  );

  await database.collection('account').updateOne(
    { providerId: 'credential', userId },
    {
      $setOnInsert: {
        accountId: userIdString,
        providerId: 'credential',
        userId,
        createdAt: user.createdAt ?? now,
      },
      $set: {
        password: securePasswordHash,
        updatedAt: user.updatedAt ?? now,
      },
    },
    { upsert: true },
  );
}

export async function syncAuthUser(user) {
  if (!mongoose.connection.db) {
    throw new Error('La base de datos debe estar conectada antes de actualizar una cuenta');
  }

  const database = mongoose.connection.db;
  await database.collection('user').updateOne(
    { _id: user._id },
    {
      $set: {
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        phone: user.phone ?? null,
        updatedAt: user.updatedAt ?? new Date(),
      },
    },
  );

  if (!user.active) {
    await database.collection('session').deleteMany({ userId: user._id });
  }
}
