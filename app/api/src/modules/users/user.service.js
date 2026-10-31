import { AppError } from '../../utils/AppError.js';
import { ROLES, STAFF } from '../../utils/roles.js';
import { escapeRegex } from '../../utils/validation.js';
import { User } from './user.model.js';

async function findStaff(id) {
  const user = await User.findOne({ _id: id, role: { $in: STAFF } });
  if (!user) throw new AppError('Usuario no encontrado', 404);
  return user;
}

// El dueño es único y no se modifica desde la API
function assertNotOwner(user) {
  if (user.role === ROLES.OWNER) throw new AppError('No se puede modificar al dueño', 403);
}

export async function listStaff({ search, role, active, page, limit }) {
  const filter = { role: role ?? { $in: STAFF } };
  if (active !== undefined) filter.active = active;
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const [items, total] = await Promise.all([
    User.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

export const getStaff = findStaff;

export async function createStaff(data) {
  return User.create(data);
}

export async function updateStaff(id, data, actor) {
  const user = await findStaff(id);
  assertNotOwner(user);
  if (data.active === false && user.id === actor.id) {
    throw new AppError('No puedes desactivarte a ti mismo', 400);
  }
  user.set(data);
  await user.save();
  return user;
}
