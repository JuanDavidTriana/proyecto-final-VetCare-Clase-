import { Router } from 'express';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';
import { authLimiter } from '../../middlewares/rateLimit.js';
import { loginSchema, registerSchema } from './auth.schemas.js';
import * as controller from './auth.controller.js';

export const authRouter = Router();

authRouter.post('/register', authLimiter, validate(registerSchema), controller.register);
authRouter.post('/login', authLimiter, validate(loginSchema), controller.login);
authRouter.get('/me', authenticate, controller.me);
