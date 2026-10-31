import request from 'supertest';
import { app } from '../src/app.js';
import { ROLES } from '../src/utils/roles.js';
import { User } from '../src/modules/users/user.model.js';
import { connectTestDB, clearTestDB, disconnectTestDB, createUserWithToken } from './helpers/db.js';

const validUser = {
  name: 'María Pérez',
  email: 'Maria@Correo.dev',
  password: 'Cliente1234',
  phone: '3001112233',
};

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(disconnectTestDB);

describe('POST /api/auth/register', () => {
  it('registers a client and returns a session', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({ name: validUser.name, role: ROLES.CLIENT });
    const saved = await User.findOne({ email: 'maria@correo.dev' }).select('+password');
    expect(saved.password).not.toBe(validUser.password);
  });

  it('ignores a role sent by the client', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, role: ROLES.OWNER });

    expect(res.status).toBe(201);
    expect(res.body.user.role).toBe(ROLES.CLIENT);
  });

  it('rejects invalid data with 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'M', email: 'no-es-correo', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.errores.map((e) => e.campo)).toEqual(
      expect.arrayContaining(['name', 'email', 'password']),
    );
  });

  it('rejects a duplicate email with 409', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(409);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await User.create({ ...validUser, role: ROLES.CLIENT });
  });

  it('logs in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@correo.dev', password: validUser.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it('rejects a wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@correo.dev', password: 'incorrecta123' });

    expect(res.status).toBe(401);
  });

  it('rejects an unknown email with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nadie@correo.dev', password: 'Cliente1234' });

    expect(res.status).toBe(401);
  });

  it('rejects an inactive user with 403', async () => {
    await User.updateOne({ email: 'maria@correo.dev' }, { active: false });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'maria@correo.dev', password: validUser.password });

    expect(res.status).toBe(403);
  });

  it('rejects an empty body with 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});

    expect(res.status).toBe(400);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the authenticated user without password', async () => {
    const { auth, user } = await createUserWithToken(ROLES.VET);
    const res = await request(app).get('/api/auth/me').set(auth);

    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ id: user.id, role: ROLES.VET });
    expect(res.body.user.password).toBeUndefined();
  });

  it('requires a token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  it('rejects an invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer basura');

    expect(res.status).toBe(401);
  });

  it('returns 404 for a deactivated user', async () => {
    const { auth, user } = await createUserWithToken(ROLES.CLIENT);
    await User.updateOne({ _id: user._id }, { active: false });
    const res = await request(app).get('/api/auth/me').set(auth);

    expect(res.status).toBe(404);
  });
});
