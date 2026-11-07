import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../../src/app.js';
import { provisionAuthAccount } from '../../src/config/auth.js';
import { User } from '../../src/modules/users/user.model.js';

let mongod;

export async function connectTestDB() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

export async function clearTestDB() {
  if (!mongoose.connection.db) return;
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
}

export async function disconnectTestDB() {
  await mongoose.disconnect();
  await mongod?.stop();
}

let counter = 0;

export async function createUserWithToken(role, overrides = {}) {
  counter += 1;
  const user = await User.create({
    name: `Usuario ${role} ${counter}`,
    email: `${role}${counter}@test.dev`,
    password: 'Password123',
    role,
    ...overrides,
  });
  await provisionAuthAccount(user);
  const response = await request(app)
    .post('/api/auth/sign-in/email')
    .send({ email: user.email, password: overrides.password ?? 'Password123' });

  if (response.status !== 200) {
    throw new Error(`No se pudo crear una sesión de prueba: ${response.status}`);
  }

  const cookies = (response.headers['set-cookie'] ?? [])
    .map((cookie) => cookie.split(';')[0])
    .join('; ');
  return { user, auth: { Cookie: cookies } };
}
