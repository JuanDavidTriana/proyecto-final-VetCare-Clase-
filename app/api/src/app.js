import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { env } from './config/env.js';
import { dbStatus } from './config/db.js';
import { errorHandler, notFound } from './middlewares/error.js';

export const app = express();

// Middlewares
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
if (env.nodeEnv !== 'test') app.use(morgan('dev'));

// Routes
app.get("/health", (req, res) => {
    res.json({ 
        status: "ok",
        service: "VetCare API",
        db: dbStatus(),
        uptime: Math.round(process.uptime()) + "ms",
    });
});


app.use(notFound);
app.use(errorHandler);