import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) throw new AppError('Token requerido', 401);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    throw new AppError('Token inválido o expirado', 401);
  }
  next();
}

export function authorize(...allowedRoles) {
  return function authorizeRole(req, _res, next) {
    if (!allowedRoles.includes(req.user?.role)) {
      throw new AppError('No tienes permisos para realizar esta acción', 403);
    }

    next();
  };
}
