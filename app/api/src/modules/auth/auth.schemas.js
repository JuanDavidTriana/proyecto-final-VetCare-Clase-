import {z} from 'zod';
import {email, name, password, phone} from '../../utils/validation.js';

export const loginSchema = z.object({
  email: email,
  password: z.string().min(1, 'La contraseña es requerida')
});

export const registerSchema = z.object({
  name: name,
  email: email,
  password: password,
  phone: phone.optional(),
});
