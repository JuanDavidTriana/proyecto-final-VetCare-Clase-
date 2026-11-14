import { AppError } from '../../utils/AppError.js';
import { ROLES, STAFF } from '../../utils/roles.js';
import { Appointment, SLOT_DURATION } from './appointments.model.js';
import { Pet } from '../pets/pet.model.js';
import { User } from '../users/user.model.js';

const isStaff = (user) => STAFF.includes(user.role);

async function findAppointmentOr404(id) {
  const appointment = await Appointment.findById(id)
    .populate('pet', 'name species breed owner')
    .populate('vet', 'name email phone')
    .populate('createdBy', 'name role');

  if (!appointment) throw new AppError('Cita no encontrada', 404);
  return appointment;
}

async function assertValidVet(vetId) {
  const vet = await User.findById(vetId);
  if (!vet || !vet.active || (vet.role !== ROLES.VET && vet.role !== ROLES.OWNER)) {
    throw new AppError('El veterinario indicado no existe, no está activo o no tiene rol veterinario', 400);
  }
  return vet;
}

async function assertAccessiblePet(petId, user) {
  const pet = await Pet.findById(petId);
  if (!pet) throw new AppError('Mascota no encontrada', 404);

  if (!isStaff(user) && pet.owner.toString() !== user.id) {
    throw new AppError('No tienes permisos para agendar citas de esta mascota', 403);
  }
  return pet;
}

/**
 * Valida que no existan choques de horario con menos de 30 minutos de diferencia (HU-13).
 */
async function assertNoConflict(vetId, date, excludeId = null) {
  const targetTime = new Date(date).getTime();
  const slotMs = SLOT_DURATION * 60 * 1000;

  // Rango de conflicto: dentro de [targetTime - 29m59s, targetTime + 29m59s]
  const windowStart = new Date(targetTime - slotMs + 1);
  const windowEnd = new Date(targetTime + slotMs - 1);

  const query = {
    vet: vetId,
    status: 'scheduled',
    date: { $gte: windowStart, $lte: windowEnd },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflicting = await Appointment.findOne(query);
  if (conflicting) {
    throw new AppError(
      'El veterinario ya tiene una cita programada en ese horario (margen de 30 minutos)',
      409
    );
  }
}

export async function listAppointments(user, { date, vet, pet, status, page, limit }) {
  const filter = {};

  if (!isStaff(user)) {
    // El cliente solo puede ver citas de sus propias mascotas
    const userPets = await Pet.find({ owner: user.id }).select('_id');
    filter.pet = { $in: userPets.map((p) => p._id) };
  } else {
    if (vet) filter.vet = vet;
    if (pet) filter.pet = pet;
  }

  if (status) filter.status = status;

  // Filtro por día específico (HU-14: ?date=YYYY-MM-DD)
  if (date) {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    filter.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const [items, total] = await Promise.all([
    Appointment.find(filter)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('pet', 'name species breed owner')
      .populate('vet', 'name email phone')
      .populate('createdBy', 'name role'),
    Appointment.countDocuments(filter),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getAppointment(id, user) {
  const appointment = await findAppointmentOr404(id);

  if (!isStaff(user)) {
    const petOwnerId = appointment.pet?.owner?._id?.toString() ?? appointment.pet?.owner?.toString();
    if (petOwnerId !== user.id) {
      throw new AppError('Cita no encontrada', 404);
    }
  }

  return appointment;
}

export async function createAppointment(data, user) {
  await assertValidVet(data.vet);
  await assertAccessiblePet(data.pet, user);
  await assertNoConflict(data.vet, data.date);

  const appointment = await Appointment.create({
    ...data,
    status: 'scheduled',
    createdBy: user.id,
  });

  return appointment.populate([
    { path: 'pet', select: 'name species breed owner' },
    { path: 'vet', select: 'name email phone' },
    { path: 'createdBy', select: 'name role' },
  ]);
}

export async function updateAppointment(id, data, user) {
  const appointment = await findAppointmentOr404(id);

  const targetVet = data.vet ?? appointment.vet?._id ?? appointment.vet;
  const targetDate = data.date ?? appointment.date;

  if (data.vet) {
    await assertValidVet(data.vet);
  }

  if (data.pet) {
    await assertAccessiblePet(data.pet, user);
  }

  if (data.vet || data.date) {
    await assertNoConflict(targetVet, targetDate, id);
  }

  appointment.set(data);
  await appointment.save();

  return appointment.populate([
    { path: 'pet', select: 'name species breed owner' },
    { path: 'vet', select: 'name email phone' },
    { path: 'createdBy', select: 'name role' },
  ]);
}

/**
 * Actualiza el estado de una cita cumpliendo con las reglas de negocio (HU-14):
 * - Acepta 'done' o 'cancelled'.
 * - Solo el veterinario (o dueño) puede marcar 'done'.
 */
export async function updateStatus(id, newStatus, user) {
  const appointment = await findAppointmentOr404(id);

  if (newStatus === 'done') {
    if (user.role !== ROLES.VET && user.role !== ROLES.OWNER) {
      throw new AppError('Solo el veterinario puede marcar una cita como atendida (done)', 403);
    }
  }

  if (newStatus === 'cancelled' && !isStaff(user)) {
    const petOwnerId = appointment.pet?.owner?._id?.toString() ?? appointment.pet?.owner?.toString();
    if (petOwnerId !== user.id) {
      throw new AppError('No tienes permisos para cancelar esta cita', 403);
    }
  }

  appointment.status = newStatus;
  await appointment.save();

  return appointment.populate([
    { path: 'pet', select: 'name species breed owner' },
    { path: 'vet', select: 'name email phone' },
    { path: 'createdBy', select: 'name role' },
  ]);
}

export async function deleteAppointment(id, user) {
  const appointment = await findAppointmentOr404(id);
  await appointment.deleteOne();
}
