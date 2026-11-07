import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';
import { env } from './config/env.js';
import { dbStatus } from './config/db.js';
import { errorHandler, notFound } from './middlewares/error.js';
import { authLimiter } from './middlewares/rateLimit.js';
import { getAuth } from './config/auth.js';
import { petRouter } from './modules/pets/pet.router.js';
import { clientRouter } from './modules/clients/client.router.js';
import { userRouter } from './modules/users/user.router.js';

export const app = express();

// 1. Middlewares globales (el orden importa: seguridad -> CORS -> parseo -> logs)
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

// 2. Healthcheck (público, sin autenticación)
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "VetCare API",
        db: dbStatus(),
        uptime: Math.round(process.uptime()) + "ms",
    });
});

// Better Auth debe recibir el stream sin procesar antes de express.json().
if (env.nodeEnv !== 'test') {
  app.use('/api/auth/sign-up/email', authLimiter);
  app.use('/api/auth/sign-in/email', authLimiter);
}
app.all('/api/auth/*splat', async (req, res, next) => {
    try {
      await toNodeHandler(getAuth())(req, res);
    } catch (error) {
      next(error);
    }
});
app.use(express.json());

// 3. Rutas de dominio (cada router define su propia autenticación/autorización)
app.use('/api/users', userRouter);
app.use('/api/clients', clientRouter);
app.use('/api/pets', petRouter);

// 4. 404: debe ir después de todas las rutas
app.use(notFound);

// 5. Manejador de errores: siempre al final para capturar los errores de lo anterior
app.use(errorHandler);
