import { z } from 'zod';
import { objectId } from '../../utils/validation.js';
import { STATUS } from './appointments.model.js';

export const appointmentStatusSchema = z.enum(STATUS, {
  errorMap: () => ({ message: `El estado debe ser uno de: ${STATUS.join(', ')}` }),
});

export const createAppointmentSchema = z.object({
  pet: objectId,
  vet: objectId,
  date: z.coerce
    .date({ invalid_type_error: 'Fecha de la cita inválida' })
    .refine((d) => d.getTime() > Date.now(), 'La fecha de la cita no puede estar en el pasado'),
  reason: z
    .string()
    .trim()
    .min(2, 'El motivo debe tener al menos 2 caracteres')
    .max(500, 'El motivo no puede exceder 500 caracteres'),
});

export const updateAppointmentSchema = z
  .object({
    pet: objectId,
    vet: objectId,
    date: z.coerce
      .date({ invalid_type_error: 'Fecha de la cita inválida' })
      .refine((d) => d.getTime() > Date.now(), 'La fecha de la cita no puede estar en el pasado'),
    reason: z
      .string()
      .trim()
      .min(2, 'El motivo debe tener al menos 2 caracteres')
      .max(500, 'El motivo no puede exceder 500 caracteres'),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, 'Debes enviar al menos un campo a modificar');

export const updateStatusSchema = z.object({
  status: z.enum(['scheduled', 'done', 'cancelled'], {
    errorMap: () => ({ message: 'El estado debe ser scheduled, done o cancelled' }),
  }),
});

export const idParamsSchema = z.object({
  id: objectId,
});

export const listAppointmentsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'El formato de fecha debe ser YYYY-MM-DD')
    .optional(),
  vet: objectId.optional(),
  pet: objectId.optional(),
  status: appointmentStatusSchema.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
