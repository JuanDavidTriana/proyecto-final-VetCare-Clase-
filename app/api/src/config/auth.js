import bcrypt from 'bcryptjs';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import mongoose from 'mongoose';
import { env } from './env.js';
import { User } from '../modules/users/user.model.js';
import { ROLES } from '../utils/roles.js';

let authInstance;

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
        password: {
          hash: (password) => bcrypt.hash(password, 10),
          verify: ({ password, hash }) => bcrypt.compare(password, hash),
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

export async function provisionAuthAccount(user) {
  if (!mongoose.connection.db) {
    throw new Error('La base de datos debe estar conectada antes de crear una cuenta');
  }
  if (!user.password) {
    throw new Error('El usuario debe tener una contraseña para crear una cuenta Better Auth');
  }

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
        password: user.password,
        createdAt: user.createdAt ?? now,
      },
      $set: { updatedAt: user.updatedAt ?? now },
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
