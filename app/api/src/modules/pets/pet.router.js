import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { STAFF } from '../../utils/roles.js';
import { createPetSchema, updatePetSchema } from './pet.schemas.js';
import * as controller from './pet.controller.js';

export const petRouter = Router();

petRouter.use(authenticate);

petRouter.get('/', controller.list);
petRouter.post('/', validate(createPetSchema), controller.create);
petRouter.get('/:id', controller.get);
petRouter.patch('/:id', validate(updatePetSchema), controller.update);
petRouter.delete('/:id', authorize(...STAFF), controller.remove);
