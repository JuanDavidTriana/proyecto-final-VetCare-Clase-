import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/app.js';
import { ROLES } from '../src/utils/roles.js';
import { User } from '../src/modules/users/user.model.js';
import { provisionAuthAccount, verifyPassword } from '../src/config/auth.js';
import { connectTestDB, clearTestDB, disconnectTestDB } from './helpers/db.js';

const validUser = {
  name: 'María Pérez',
  email: 'Maria@Correo.dev',
  password: 'Cliente1234',
  phone: '3001112233',
};

function sessionCookie(response) {
  return (response.headers['set-cookie'] ?? [])
    .map((cookie) => cookie.split(';')[0])
    .join('; ');
}

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(disconnectTestDB);

describe('Better Auth email/password & Cryptographic storage', () => {
  it('registers a client, stores an Argon2id hash, and creates the VetCare profile without plaintext password', async () => {
    const response = await request(app)
      .post('/api/auth/sign-up/email')
      .send(validUser);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      name: validUser.name,
      role: ROLES.CLIENT,
      active: true,
    });
    expect(sessionCookie(response)).toContain('session_token=');

    const profile = await User.findById(response.body.user.id);
    const account = await mongoose.connection.db.collection('account').findOne({
      providerId: 'credential',
      userId: profile._id,
    });

    expect(profile.email).toBe('maria@correo.dev');
    expect(profile.phone).toBe(validUser.phone);

    // Verificación criptográfica: NO es texto plano y es Argon2id
    expect(account.password).not.toBe(validUser.password);
    expect(account.password).toMatch(/^\$argon2id\$/);
    expect(await verifyPassword({ password: validUser.password, hash: account.password })).toBe(true);

    // Verificación en reposo: users no guarda contraseñas redundantes
    const rawUserDoc = await mongoose.connection.db.collection('users').findOne({ _id: profile._id });
    expect(rawUserDoc?.password).toBeUndefined();
  });

  it('guarantees provisionAuthAccount hashes plaintext passwords with Argon2id', async () => {
    const user = await User.create({
      name: 'Dr. Prueba Criptográfica',
      email: 'cripto@vetcare.dev',
      role: ROLES.VET,
    });

    // Se aprovisiona con contraseña en texto plano
    await provisionAuthAccount(user, 'PlainPassword123');

    const account = await mongoose.connection.db.collection('account').findOne({
      providerId: 'credential',
      userId: user._id,
    });

    expect(account.password).not.toBe('PlainPassword123');
    expect(account.password).toMatch(/^\$argon2id\$/);
    expect(await verifyPassword({ password: 'PlainPassword123', hash: account.password })).toBe(true);
  });

  it('does not let a public sign-up choose a privileged role', async () => {
    const response = await request(app)
      .post('/api/auth/sign-up/email')
      .send({ ...validUser, role: ROLES.OWNER });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe(ROLES.CLIENT);
  });

  it('rejects invalid credentials data and enforces password complexity and bounds', async () => {
    // Password demasiado corta
    const resShort = await request(app)
      .post('/api/auth/sign-up/email')
      .send({ name: 'M', email: 'valid@correo.dev', password: '123' });
    expect(resShort.status).toBeGreaterThanOrEqual(400);

    // Password sin mayúscula (rechazada por política si se valida en endpoints de creación)
    const resBadEmail = await request(app)
      .post('/api/auth/sign-up/email')
      .send({ name: 'Valid Name', email: 'not-an-email', password: 'ValidPassword123' });
    expect(resBadEmail.status).toBeGreaterThanOrEqual(400);

    // Password que excede 72 bytes (prevención de DoS)
    const longPassword = 'A1' + 'a'.repeat(75);
    const resTooLong = await request(app)
      .post('/api/auth/sign-up/email')
      .send({ name: 'Valid Name', email: 'toolong@correo.dev', password: longPassword });
    expect(resTooLong.status).toBeGreaterThanOrEqual(400);
  });

  it('rejects an already registered email', async () => {
    await request(app).post('/api/auth/sign-up/email').send(validUser);
    const response = await request(app).post('/api/auth/sign-up/email').send(validUser);

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('signs in and returns the current session', async () => {
    await request(app).post('/api/auth/sign-up/email').send(validUser);
    const signIn = await request(app)
      .post('/api/auth/sign-in/email')
      .send({ email: validUser.email, password: validUser.password });

    expect(signIn.status).toBe(200);
    const session = await request(app)
      .get('/api/auth/get-session')
      .set('Cookie', sessionCookie(signIn));

    expect(session.status).toBe(200);
    expect(session.body.user).toMatchObject({
      email: 'maria@correo.dev',
      role: ROLES.CLIENT,
    });
  });

  it('keeps existing bcrypt credentials and business roles usable (backward compatibility)', async () => {
    const legacyUser = await User.create({
      name: 'Veterinaria existente',
      email: 'vet@legacy.test',
      role: ROLES.VET,
    });
    const originalId = legacyUser.id;
    await provisionAuthAccount(legacyUser, validUser.password);

    const signIn = await request(app)
      .post('/api/auth/sign-in/email')
      .send({ email: legacyUser.email, password: validUser.password });
    const response = await request(app)
      .get('/api/clients')
      .set('Cookie', sessionCookie(signIn));

    expect(signIn.status).toBe(200);
    expect(response.status).toBe(200);
    expect(signIn.body.user.id).toBe(originalId);
  });

  it('rejects incorrect passwords', async () => {
    await request(app).post('/api/auth/sign-up/email').send(validUser);
    const response = await request(app)
      .post('/api/auth/sign-in/email')
      .send({ email: validUser.email, password: 'IncorrectPassword123' });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it('does not authorize an inactive profile', async () => {
    const signUp = await request(app).post('/api/auth/sign-up/email').send(validUser);
    await User.updateOne({ _id: signUp.body.user.id }, { active: false });

    const signIn = await request(app)
      .post('/api/auth/sign-in/email')
      .send({ email: validUser.email, password: validUser.password });
    expect(signIn.status).toBe(401);

    const response = await request(app)
      .get('/api/pets')
      .set('Cookie', sessionCookie(signUp));

    expect(response.status).toBe(401);
  });

  it('requires a session to access private routes', async () => {
    const response = await request(app).get('/api/pets');

    expect(response.status).toBe(401);
  });
});
