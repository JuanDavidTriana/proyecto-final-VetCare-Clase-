import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { ROLES, STAFF } from '../../utils/roles.js';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateStatusSchema,
} from './appointment.schemas.js';
import * as controller from './appointment.controller.js';

export const appointmentRouter = Router();

// Todas las rutas de agenda requieren autenticación
appointmentRouter.use(authenticate);

appointmentRouter.get('/', controller.list);
appointmentRouter.post('/', validate(createAppointmentSchema), controller.create);
appointmentRouter.get('/:id', controller.get);
appointmentRouter.patch('/:id', authorize(...STAFF), validate(updateAppointmentSchema), controller.update);
appointmentRouter.patch('/:id/status', validate(updateStatusSchema), controller.updateStatus);
appointmentRouter.delete('/:id', authorize(ROLES.OWNER), controller.remove);
