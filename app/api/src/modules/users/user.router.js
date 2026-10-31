import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { ROLES } from '../../utils/roles.js';
import { createStaffSchema, updateStaffSchema } from './user.schemas.js';
import * as controller from './user.controller.js';

export const userRouter = Router();

// Gestión del personal (vets y asistentes): solo el dueño
userRouter.use(authenticate, authorize(ROLES.OWNER));

userRouter.get('/', controller.list);
userRouter.post('/', validate(createStaffSchema), controller.create);
userRouter.get('/:id', controller.get);
userRouter.patch('/:id', validate(updateStaffSchema), controller.update);
