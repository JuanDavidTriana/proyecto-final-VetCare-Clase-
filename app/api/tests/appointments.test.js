import request from 'supertest';
import { app } from '../src/app.js';
import { ROLES } from '../src/utils/roles.js';
import { Pet } from '../src/modules/pets/pet.model.js';
import { Appointment } from '../src/modules/appointments/appointments.model.js';
import { connectTestDB, clearTestDB, disconnectTestDB, createUserWithToken } from './helpers/db.js';

beforeAll(connectTestDB);
afterEach(clearTestDB);
afterAll(disconnectTestDB);

async function setupTestEntities() {
  const owner = await createUserWithToken(ROLES.OWNER);
  const vet = await createUserWithToken(ROLES.VET);
  const assistant = await createUserWithToken(ROLES.ASSISTANT);
  const client = await createUserWithToken(ROLES.CLIENT);
  const clientOther = await createUserWithToken(ROLES.CLIENT);

  const pet = await Pet.create({
    name: 'Toby',
    species: 'dog',
    sex: 'M',
    owner: client.user.id,
  });

  const petOther = await Pet.create({
    name: 'Misha',
    species: 'cat',
    sex: 'F',
    owner: clientOther.user.id,
  });

  return { owner, vet, assistant, client, clientOther, pet, petOther };
}

describe('Appointments Module (Agenda / HU-13 & HU-14)', () => {
  it('requires authentication on all appointment routes', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(401);
  });

  describe('POST /api/appointments (HU-13 · Agendar Cita)', () => {
    it('creates an appointment with scheduled status and required fields', async () => {
      const { assistant, vet, pet } = await setupTestEntities();
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const res = await request(app)
        .post('/api/appointments')
        .set(assistant.auth)
        .send({
          pet: pet.id,
          vet: vet.user.id,
          date: futureDate,
          reason: 'Control de vacunas y chequeo',
        });

      expect(res.status).toBe(201);
      expect(res.body.appointment).toBeDefined();
      expect(res.body.appointment.status).toBe('scheduled');
      expect(res.body.appointment.reason).toBe('Control de vacunas y chequeo');
      expect(res.body.appointment.pet.name).toBe('Toby');
      expect(res.body.appointment.vet.name).toBe(vet.user.name);
      expect(res.body.appointment.createdBy.name).toBe(assistant.user.name);
    });

    it('rejects an appointment date in the past with 400', async () => {
      const { assistant, vet, pet } = await setupTestEntities();
      const pastDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const res = await request(app)
        .post('/api/appointments')
        .set(assistant.auth)
        .send({
          pet: pet.id,
          vet: vet.user.id,
          date: pastDate,
          reason: 'Cita en el pasado',
        });

      expect(res.status).toBe(400);
      expect(res.body.errores[0].mensaje).toContain('no puede estar en el pasado');
    });

    it('rejects scheduling conflict if vet has another appointment within 30 minutes (409)', async () => {
      const { assistant, vet, pet, petOther } = await setupTestEntities();
      const baseDate = new Date(Date.now() + 48 * 60 * 60 * 1000);

      // Cita 1: a las 10:00
      await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: baseDate,
        reason: 'Primera cita',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      // Cita 2: a las 10:20 (20 minutos después, conflicto con ventana de 30 min)
      const conflictDate = new Date(baseDate.getTime() + 20 * 60 * 1000).toISOString();

      const res = await request(app)
        .post('/api/appointments')
        .set(assistant.auth)
        .send({
          pet: petOther.id,
          vet: vet.user.id,
          date: conflictDate,
          reason: 'Cita con choque de horario',
        });

      expect(res.status).toBe(409);
      expect(res.body.mensaje).toContain('30 minutos');
    });

    it('allows scheduling an appointment for the same vet after 30 minutes', async () => {
      const { assistant, vet, pet, petOther } = await setupTestEntities();
      const baseDate = new Date(Date.now() + 48 * 60 * 60 * 1000);

      // Cita 1: a las 10:00
      await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: baseDate,
        reason: 'Primera cita',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      // Cita 2: a las 10:35 (35 minutos después -> sin conflicto)
      const validDate = new Date(baseDate.getTime() + 35 * 60 * 1000).toISOString();

      const res = await request(app)
        .post('/api/appointments')
        .set(assistant.auth)
        .send({
          pet: petOther.id,
          vet: vet.user.id,
          date: validDate,
          reason: 'Cita posterior sin choque',
        });

      expect(res.status).toBe(201);
    });

    it('forbids a client from booking an appointment for someone else’s pet (403)', async () => {
      const { client, vet, petOther } = await setupTestEntities();
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const res = await request(app)
        .post('/api/appointments')
        .set(client.auth)
        .send({
          pet: petOther.id, // Mascota de otro cliente
          vet: vet.user.id,
          date: futureDate,
          reason: 'Intento no autorizado',
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/appointments (HU-14 · Listar y filtrar agenda)', () => {
    it('filters appointments by date and vet', async () => {
      const { vet, pet, assistant } = await setupTestEntities();
      const targetDay = '2026-11-20';
      const targetDate = new Date(`${targetDay}T14:00:00.000Z`);

      await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: targetDate,
        reason: 'Cita del día objetivo',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      // Cita de otro día
      await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: new Date('2026-11-25T14:00:00.000Z'),
        reason: 'Cita de otro día',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      const res = await request(app)
        .get(`/api/appointments?date=${targetDay}&vet=${vet.user.id}`)
        .set(vet.auth);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].reason).toBe('Cita del día objetivo');
    });

    it('limits client visibility strictly to their own pets', async () => {
      const { client, assistant, vet, pet, petOther } = await setupTestEntities();
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Cita de la mascota del cliente
      await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: futureDate,
        reason: 'Cita de Toby',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      // Cita de la mascota de otro cliente
      await Appointment.create({
        pet: petOther.id,
        vet: vet.user.id,
        date: new Date(futureDate.getTime() + 60 * 60 * 1000),
        reason: 'Cita de Misha',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      const res = await request(app).get('/api/appointments').set(client.auth);

      expect(res.status).toBe(200);
      expect(res.body.items).toHaveLength(1);
      expect(res.body.items[0].reason).toBe('Cita de Toby');
    });
  });

  describe('PATCH /api/appointments/:id/status (HU-14 · Cambio de estado)', () => {
    it('lets a vet mark an appointment as done', async () => {
      const { vet, pet, assistant } = await setupTestEntities();
      const appt = await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reason: 'Chequeo',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      const res = await request(app)
        .patch(`/api/appointments/${appt.id}/status`)
        .set(vet.auth)
        .send({ status: 'done' });

      expect(res.status).toBe(200);
      expect(res.body.appointment.status).toBe('done');
    });

    it('forbids an assistant from marking an appointment as done (403)', async () => {
      const { assistant, vet, pet } = await setupTestEntities();
      const appt = await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reason: 'Chequeo',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      const res = await request(app)
        .patch(`/api/appointments/${appt.id}/status`)
        .set(assistant.auth)
        .send({ status: 'done' });

      expect(res.status).toBe(403);
      expect(res.body.mensaje).toContain('veterinario');
    });

    it('lets an assistant mark an appointment as cancelled', async () => {
      const { assistant, vet, pet } = await setupTestEntities();
      const appt = await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reason: 'Chequeo',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      const res = await request(app)
        .patch(`/api/appointments/${appt.id}/status`)
        .set(assistant.auth)
        .send({ status: 'cancelled' });

      expect(res.status).toBe(200);
      expect(res.body.appointment.status).toBe('cancelled');
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('lets owner delete an appointment', async () => {
      const { owner, vet, pet, assistant } = await setupTestEntities();
      const appt = await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reason: 'Cita a borrar',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      const res = await request(app)
        .delete(`/api/appointments/${appt.id}`)
        .set(owner.auth);

      expect(res.status).toBe(204);
      expect(await Appointment.findById(appt.id)).toBeNull();
    });

    it('forbids non-owner staff from deleting appointments (403)', async () => {
      const { assistant, vet, pet } = await setupTestEntities();
      const appt = await Appointment.create({
        pet: pet.id,
        vet: vet.user.id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reason: 'Cita a borrar',
        status: 'scheduled',
        createdBy: assistant.user.id,
      });

      const res = await request(app)
        .delete(`/api/appointments/${appt.id}`)
        .set(assistant.auth);

      expect(res.status).toBe(403);
    });
  });
});
