import {z} from 'zod';

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Debe ser un ObjectId válido');
export const email = z.email('Debe ser un correo electrónico válido');
export const password = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres');
export const name = z.string().min(2, 'El nombre debe tener al menos 2 caracteres')
.max(100, 'El nombre no puede tener más de 100 caracteres');
export const phone = z.string().regex(/^\d{10}$/, 'Debe ser un número de teléfono válido de 10 dígitos');

export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


