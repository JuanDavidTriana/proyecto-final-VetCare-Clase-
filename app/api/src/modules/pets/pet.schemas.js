import { z } from 'zod';
import { objectId } from '../../utils/validation.js';
import { SPECIES } from './pet.model.js';

const petFields = {
  name: z.string().trim().min(1, 'El nombre es requerido').max(100),
  species: z.enum(SPECIES, 'Especie inválida'),
  breed: z.string().trim().max(100).optional(),
  sex: z.enum(['M', 'F'], 'El sexo debe ser M o F'),
  birthDate: z.coerce
    .date('Fecha de nacimiento inválida')
    .refine((d) => d <= new Date(), 'La fecha no puede ser futura')
    .optional(),
  weightKg: z.number().min(0, 'El peso no puede ser negativo').optional(),
  notes: z.string().trim().max(1000).optional(),
};

// `owner` solo lo usa el personal; para un cliente se ignora y se usa su propio id
export const createPetSchema = z.object({ ...petFields, owner: objectId.optional() });

export const updatePetSchema = z
  .object(petFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo');

export const idParamsSchema = z.object({ id: objectId });

export const listQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  species: z.enum(SPECIES).optional(),
  owner: objectId.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
