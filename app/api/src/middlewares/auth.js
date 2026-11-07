import { fromNodeHeaders } from 'better-auth/node';
import { getAuth } from '../config/auth.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../modules/users/user.model.js';

export async function authenticate(req, _res, next) {
  const session = await getAuth().api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) throw new AppError('Sesión requerida', 401);

  const user = await User.findById(session.user.id);
  if (!user || !user.active) throw new AppError('Sesión inválida o usuario inactivo', 401);

  req.user = { id: user.id, role: user.role };
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
