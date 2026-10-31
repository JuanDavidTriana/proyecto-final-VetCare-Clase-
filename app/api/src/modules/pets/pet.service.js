import { AppError } from '../../utils/AppError.js';
import { ROLES, STAFF } from '../../utils/roles.js';
import { escapeRegex } from '../../utils/validation.js';
import { User } from '../users/user.model.js';
import { Pet } from './pet.model.js';

const isStaff = (user) => STAFF.includes(user.role);

async function findAccessible(id, user) {
  const filter = isStaff(user) ? { _id: id } : { _id: id, owner: user.id };
  const pet = await Pet.findOne(filter);
  if (!pet) throw new AppError('Mascota no encontrada', 404);
  return pet;
}

async function assertValidOwner(ownerId) {
  const owner = await User.findById(ownerId);
  if (!owner || !owner.active || owner.role !== ROLES.CLIENT) {
    throw new AppError('El tutor indicado no existe o no es un cliente activo', 400);
  }
}

export async function listPets(user, { search, species, owner, page, limit }) {
  const filter = {};
  if (isStaff(user)) {
    if (owner) filter.owner = owner;
  } else {
    filter.owner = user.id;
  }
  if (species) filter.species = species;
  if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };

  const [items, total] = await Promise.all([
    Pet.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Pet.countDocuments(filter),
  ]);

  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

export async function getPet(id, user) {
  return findAccessible(id, user);
}

export async function createPet(data, user) {
  let ownerId = user.id;
  if (isStaff(user)) {
    if (!data.owner) throw new AppError('El tutor (owner) es requerido', 400);
    ownerId = data.owner;
    await assertValidOwner(ownerId);
  }
  return Pet.create({ ...data, owner: ownerId });
}

export async function updatePet(id, data, user) {
  const pet = await findAccessible(id, user);
  pet.set(data);
  await pet.save();
  return pet;
}

export async function deletePet(id, user) {
  const pet = await findAccessible(id, user);
  await pet.deleteOne();
}
