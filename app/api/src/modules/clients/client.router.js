import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { STAFF } from '../../utils/roles.js';
import { createClientSchema, updateClientSchema } from './client.schemas.js';
import * as controller from './client.controller.js';

export const clientRouter = Router();

// Gestión de clientes (tutores): solo el personal
clientRouter.use(authenticate, authorize(...STAFF));

clientRouter.get('/', controller.list);
clientRouter.post('/', validate(createClientSchema), controller.create);
clientRouter.get('/:id', controller.get);
clientRouter.patch('/:id', validate(updateClientSchema), controller.update);
