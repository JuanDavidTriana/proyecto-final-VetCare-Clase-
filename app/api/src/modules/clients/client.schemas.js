import { z } from 'zod';
import { email, name, password, phone } from '../../utils/validation.js';

const document = z.string().trim().min(5, 'Documento inválido').max(20, 'Documento inválido');

export const createClientSchema = z.object({
  name,
  email,
  password,
  phone: phone.optional(),
  document: document.optional(),
});

export const updateClientSchema = z
  .object({ name, phone, document, active: z.boolean() })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo');

export const listClientsQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  active: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
