import { AppError } from '../../utils/AppError.js';
import { ROLES } from '../../utils/roles.js';
import { escapeRegex } from '../../utils/validation.js';
import { provisionAuthAccount, syncAuthUser } from '../../config/auth.js';
import { User } from '../users/user.model.js';
import { Pet } from '../pets/pet.model.js';

async function findClient(id) {
  const client = await User.findOne({ _id: id, role: ROLES.CLIENT });
  if (!client) throw new AppError('Cliente no encontrado', 404);
  return client;
}

export async function listClients({ search, active, page, limit }) {
  const filter = { role: ROLES.CLIENT };
  if (active !== undefined) filter.active = active;
  if (search) {
    const regex = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ name: regex }, { email: regex }, { document: regex }, { phone: regex }];
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

export async function getClient(id) {
  const client = await findClient(id);
  const pets = await Pet.find({ owner: client._id }).sort({ name: 1 });
  return { ...client.toJSON(), pets };
}

export async function createClient(data) {
  const client = await User.create({ ...data, role: ROLES.CLIENT });
  try {
    await provisionAuthAccount(client);
    return client;
  } catch (error) {
    await client.deleteOne();
    throw error;
  }
}

export async function updateClient(id, data) {
  const client = await findClient(id);
  client.set(data);
  await client.save();
  await syncAuthUser(client);
  return client;
}
