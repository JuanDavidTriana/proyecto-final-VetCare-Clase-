import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/AppError.js';
import { ROLES}  from '../../utils/roles.js';
import { User } from '../users/user.model.js';

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

function toSession(user) {
  return {
    token: signToken(user),
    user: { id: user._id.toString(), name: user.name, role: user.role }
  };
}

export async function registerClient(data) {
  const user = await User.create({ ...data, role: ROLES.CLIENT });
  return toSession(user);
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Credenciales inválidas', 401);
  }
  if (!user.active) throw new AppError('Usuario inactivo', 403);

  return toSession(user);
}

export async function me(userId) {
  const user = await User.findById(userId);
  if (!user || !user.active) throw new AppError('Usuario no encontrado', 404);
  return user.toJSON();
}
