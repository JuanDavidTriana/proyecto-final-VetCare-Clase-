import { z } from 'zod';
import { email, name, password, phone } from '../../utils/validation.js';
import { STAFF, STAFF_CREATABLE } from '../../utils/roles.js';

const document = z.string().trim().min(5, 'Documento inválido').max(20, 'Documento inválido');

export const createStaffSchema = z.object({
  name,
  email,
  password,
  role: z.enum(STAFF_CREATABLE, 'El rol debe ser vet o assistant'),
  phone: phone.optional(),
  document: document.optional(),
});

export const updateStaffSchema = z
  .object({
    name,
    role: z.enum(STAFF_CREATABLE, 'El rol debe ser vet o assistant'),
    phone,
    document,
    active: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo');

export const listStaffQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  role: z.enum(STAFF).optional(),
  active: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
