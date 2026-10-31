import request from 'supertest';
import { app } from '../src/app.js';
import { ROLES } from '../src/utils/roles.js';
import { Pet } from '../src/modules/pets/pet.model.js';
import { connectTestDB, clearTestDB, disconnectTestDB, createUserWithToken } from './helpers/db.js';

const petData = { name: 'Toby', species: 'dog', sex: 'M', weightKg: 12 };

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(disconnectTestDB);

describe('authentication', () => {
  it('requires a token on every pets route', async () => {
    const res = await request(app).get('/api/pets');

    expect(res.status).toBe(401);
  });
});

describe('POST /api/pets', () => {
  it('lets a client create a pet owned by themselves', async () => {
    const client = await createUserWithToken(ROLES.CLIENT);
    const other = await createUserWithToken(ROLES.CLIENT);
    const res = await request(app)
      .post('/api/pets')
      .set(client.auth)
      .send({ ...petData, owner: other.user.id });

    expect(res.status).toBe(201);
    expect(res.body.pet.owner).toBe(client.user.id);
    expect(res.body.pet.id).toBeDefined();
  });

  it('requires owner when staff creates a pet', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const res = await request(app).post('/api/pets').set(vet.auth).send(petData);

    expect(res.status).toBe(400);
  });

  it('lets staff create a pet for an active client', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const client = await createUserWithToken(ROLES.CLIENT);
    const res = await request(app)
      .post('/api/pets')
      .set(vet.auth)
      .send({ ...petData, owner: client.user.id });

    expect(res.status).toBe(201);
    expect(res.body.pet.owner).toBe(client.user.id);
  });

  it('rejects an owner that is not a client', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const res = await request(app)
      .post('/api/pets')
      .set(vet.auth)
      .send({ ...petData, owner: vet.user.id });

    expect(res.status).toBe(400);
  });

  it('rejects invalid data with 400', async () => {
    const client = await createUserWithToken(ROLES.CLIENT);
    const res = await request(app)
      .post('/api/pets')
      .set(client.auth)
      .send({ name: '', species: 'dragon', sex: 'X', weightKg: -1 });

    expect(res.status).toBe(400);
    expect(res.body.errores.map((e) => e.campo)).toEqual(
      expect.arrayContaining(['name', 'species', 'sex', 'weightKg']),
    );
  });
});

describe('GET /api/pets', () => {
  it('shows a client only their own pets', async () => {
    const a = await createUserWithToken(ROLES.CLIENT);
    const b = await createUserWithToken(ROLES.CLIENT);
    await Pet.create({ ...petData, name: 'Mía', owner: a.user._id });
    await Pet.create({ ...petData, name: 'Ajena', owner: b.user._id });

    const res = await request(app).get('/api/pets').set(a.auth);

    expect(res.status).toBe(200);
    expect(res.body.items.map((p) => p.name)).toEqual(['Mía']);
    expect(res.body.total).toBe(1);
  });

  it('shows staff all pets and supports filters and pagination', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const a = await createUserWithToken(ROLES.CLIENT);
    const b = await createUserWithToken(ROLES.CLIENT);
    await Pet.create({ ...petData, name: 'Toby', owner: a.user._id });
    await Pet.create({ ...petData, name: 'Misha', species: 'cat', owner: a.user._id });
    await Pet.create({ ...petData, name: 'Luna', owner: b.user._id });

    const all = await request(app).get('/api/pets').set(vet.auth);
    expect(all.body.total).toBe(3);

    const cats = await request(app).get('/api/pets?species=cat').set(vet.auth);
    expect(cats.body.items.map((p) => p.name)).toEqual(['Misha']);

    const byOwner = await request(app).get(`/api/pets?owner=${b.user.id}`).set(vet.auth);
    expect(byOwner.body.items.map((p) => p.name)).toEqual(['Luna']);

    const search = await request(app).get('/api/pets?search=tob').set(vet.auth);
    expect(search.body.items.map((p) => p.name)).toEqual(['Toby']);

    const page = await request(app).get('/api/pets?limit=2&page=2').set(vet.auth);
    expect(page.body.items).toHaveLength(1);
    expect(page.body.pages).toBe(2);
  });

  it('treats search as literal text, not a regex', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const a = await createUserWithToken(ROLES.CLIENT);
    await Pet.create({ ...petData, name: 'Toby', owner: a.user._id });

    const res = await request(app).get('/api/pets?search=.*').set(vet.auth);

    expect(res.body.items).toHaveLength(0);
  });
});

describe('GET /api/pets/:id', () => {
  it('returns the pet to its owner', async () => {
    const client = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: client.user._id });
    const res = await request(app).get(`/api/pets/${pet.id}`).set(client.auth);

    expect(res.status).toBe(200);
    expect(res.body.pet.name).toBe('Toby');
  });

  it('returns 404 when a client asks for another client’s pet', async () => {
    const a = await createUserWithToken(ROLES.CLIENT);
    const b = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: b.user._id });
    const res = await request(app).get(`/api/pets/${pet.id}`).set(a.auth);

    expect(res.status).toBe(404);
  });

  it('lets staff read any pet', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const client = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: client.user._id });
    const res = await request(app).get(`/api/pets/${pet.id}`).set(vet.auth);

    expect(res.status).toBe(200);
  });

  it('returns 400 for an invalid id', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const res = await request(app).get('/api/pets/abc').set(vet.auth);

    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existing id', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const res = await request(app).get('/api/pets/64b7f0f0f0f0f0f0f0f0f0f0').set(vet.auth);

    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/pets/:id', () => {
  it('updates only the sent fields', async () => {
    const client = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: client.user._id });
    const res = await request(app)
      .patch(`/api/pets/${pet.id}`)
      .set(client.auth)
      .send({ weightKg: 15 });

    expect(res.status).toBe(200);
    expect(res.body.pet).toMatchObject({ name: 'Toby', weightKg: 15 });
  });

  it('does not allow changing the owner', async () => {
    const a = await createUserWithToken(ROLES.CLIENT);
    const b = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: a.user._id });
    await request(app).patch(`/api/pets/${pet.id}`).set(a.auth).send({ owner: b.user.id, weightKg: 14 });

    const saved = await Pet.findById(pet.id);
    expect(saved.owner.toString()).toBe(a.user.id);
  });

  it('rejects an empty body with 400', async () => {
    const client = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: client.user._id });
    const res = await request(app).patch(`/api/pets/${pet.id}`).set(client.auth).send({});

    expect(res.status).toBe(400);
  });

  it('returns 404 when a client edits another client’s pet', async () => {
    const a = await createUserWithToken(ROLES.CLIENT);
    const b = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: b.user._id });
    const res = await request(app).patch(`/api/pets/${pet.id}`).set(a.auth).send({ name: 'X' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/pets/:id', () => {
  it('forbids clients with 403', async () => {
    const client = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: client.user._id });
    const res = await request(app).delete(`/api/pets/${pet.id}`).set(client.auth);

    expect(res.status).toBe(403);
    expect(await Pet.countDocuments()).toBe(1);
  });

  it('lets staff delete a pet', async () => {
    const vet = await createUserWithToken(ROLES.VET);
    const client = await createUserWithToken(ROLES.CLIENT);
    const pet = await Pet.create({ ...petData, owner: client.user._id });
    const res = await request(app).delete(`/api/pets/${pet.id}`).set(vet.auth);

    expect(res.status).toBe(204);
    expect(await Pet.countDocuments()).toBe(0);
  });
});
