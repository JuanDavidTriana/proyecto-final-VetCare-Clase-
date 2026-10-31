import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from '../../src/config/env.js';
import { User } from '../../src/modules/users/user.model.js';

let mongod;

export async function connectTestDB() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

export async function clearTestDB() {
  await Promise.all(Object.values(mongoose.connection.collections).map((c) => c.deleteMany({})));
}

export async function disconnectTestDB() {
  await mongoose.disconnect();
  await mongod?.stop();
}

let counter = 0;

// Crea un usuario directo en BD y devuelve su token (evita el rate limit del login)
export async function createUserWithToken(role, overrides = {}) {
  counter += 1;
  const user = await User.create({
    name: `Usuario ${role} ${counter}`,
    email: `${role}${counter}@test.dev`,
    password: 'Password123',
    role,
    ...overrides,
  });
  const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: '1h' });
  return { user, token, auth: { Authorization: `Bearer ${token}` } };
}
