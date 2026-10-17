export function notFound(req, res) {
    res.status(404).json({
        mensaje: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    });
}

export function errorHandler(err, _req, res, _next) {
    const statusCode = err.status || 500;

    if (statusCode === 500) console.error(err);

    res.status(statusCode).json({
        mensaje: statusCode === 500 ? 'Error interno del servidor' : err.message,
    });
}