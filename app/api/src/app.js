import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { env } from './config/env.js';
import { dbStatus } from './config/db.js';
import { errorHandler, notFound } from './middlewares/error.js';
import { authRouter } from './modules/auth/auth.router.js';
import { petRouter } from './modules/pets/pet.router.js';
import { clientRouter } from './modules/clients/client.router.js';
import { userRouter } from './modules/users/user.router.js';

export const app = express();

// 1. Middlewares globales (el orden importa: seguridad -> CORS -> parseo -> logs)
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
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

// 3. Rutas de dominio (cada router define su propia autenticación/autorización)
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/clients', clientRouter);
app.use('/api/pets', petRouter);

// 4. 404: debe ir después de todas las rutas
app.use(notFound);

// 5. Manejador de errores: siempre al final para capturar los errores de lo anterior
app.use(errorHandler);
