/**
 * HU-01 · Crea el usuario dueño inicial (y opcionalmente datos de demostración).
 *
 *   npm run seed          → solo el dueño (idempotente: no lo duplica)
 *   npm run seed:demo     → dueño + personal + tutores + mascotas de ejemplo
 */
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { User } from './modules/users/user.model.js';
import { Pet } from './modules/pets/pet.model.js';
import { ROLES } from './utils/roles.js';
import { provisionAuthAccount } from './config/auth.js';

const withDemo = process.argv.includes('--demo');

/** Crea el usuario solo si su correo no existe. */
async function upsertUser(data) {
  const existing = await User.findOne({ email: data.email }).select('+password');
  if (existing) {
    if (existing.password) await provisionAuthAccount(existing);
    return { user: existing, created: false };
  }

  const user = await User.create(data);
  await provisionAuthAccount(user);
  return { user, created: true };
}

async function seedOwner() {
  const { user, created } = await upsertUser({ ...env.seedOwner, role: ROLES.OWNER });
  console.log(created ? `✔ Dueño creado: ${user.email}` : `• El dueño ya existía: ${user.email}`);
}

async function seedDemo() {
  const staff = [
    { name: 'Dra. Laura Gómez', email: 'laura@vetcare.dev', role: ROLES.VET },
    { name: 'Dr. Andrés Ruiz', email: 'andres@vetcare.dev', role: ROLES.VET },
    { name: 'Camila Torres', email: 'camila@vetcare.dev', role: ROLES.ASSISTANT },
  ];
  for (const s of staff) {
    const { created } = await upsertUser({ ...s, password: 'Demo1234' });
    if (created) console.log(`✔ ${s.role}: ${s.email}`);
  }

  const clients = [
    { name: 'María Pérez', email: 'maria@correo.dev', phone: '3001112233', document: '1010101010',
      pets: [{ name: 'Toby', species: 'dog', breed: 'Criollo', sex: 'M', weightKg: 12 },
             { name: 'Misha', species: 'cat', breed: 'Siamés', sex: 'F', weightKg: 4 }] },
    { name: 'Juan Rodríguez', email: 'juan@correo.dev', phone: '3104445566', document: '2020202020',
      pets: [{ name: 'Luna', species: 'dog', breed: 'Golden Retriever', sex: 'F', weightKg: 28 }] },
    { name: 'Sofía Martínez', email: 'sofia@correo.dev', phone: '3207778899', document: '3030303030',
      pets: [{ name: 'Kiwi', species: 'bird', breed: 'Periquito', sex: 'M' },
             { name: 'Copito', species: 'rabbit', sex: 'M', weightKg: 2 }] },
  ];
  for (const { pets, ...c } of clients) {
    const { user, created } = await upsertUser({ ...c, role: ROLES.CLIENT, password: 'Cliente1234' });
    if (!created) continue;
    await Pet.insertMany(pets.map((p) => ({ ...p, owner: user._id })));
    console.log(`✔ Tutor ${c.name} con ${pets.length} mascota(s)`);
  }

  console.log('\nContraseñas demo → personal: Demo1234 · tutores: Cliente1234');
}

try {
  await connectDB(env.mongoUri);
  await seedOwner();
  if (withDemo) await seedDemo();
} catch (err) {
  console.error('✖ Error en el seed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
