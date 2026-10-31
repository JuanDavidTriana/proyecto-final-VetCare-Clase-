import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      mensaje: 'Demasiados intentos. Intenta de nuevo en 10 minutos'
    });
  }
});
