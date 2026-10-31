export function notFound(req, res) {
    res.status(404).json({
        mensaje: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    });
}

const handlers = [
    // Zod: validación de body/query/params
    {
        match: (err) => err.name === 'ZodError',
        handle: (err) => ({
            status: 400,
            mensaje: 'Datos inválidos',
            errores: err.issues.map((i) => ({ campo: i.path.join('.'), mensaje: i.message })),
        }),
    },
    // JSON malformado en el body (body-parser / express.json)
    {
        match: (err) => err.type === 'entity.parse.failed',
        handle: () => ({ status: 400, mensaje: 'JSON malformado en el cuerpo de la petición' }),
    },
    // Body demasiado grande
    {
        match: (err) => err.type === 'entity.too.large',
        handle: () => ({ status: 413, mensaje: 'El cuerpo de la petición es demasiado grande' }),
    },
    // Mongoose: ObjectId inválido u otro valor que no se puede castear
    {
        match: (err) => err.name === 'CastError',
        handle: (err) => ({ status: 400, mensaje: `Valor inválido para '${err.path}'` }),
    },
    // Mongoose: validaciones del esquema
    {
        match: (err) => err.name === 'ValidationError' && err.errors,
        handle: (err) => ({
            status: 400,
            mensaje: 'Datos inválidos',
            errores: Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message })),
        }),
    },
    // MongoDB: código 11000 (clave duplicada / índice único)
    {
        match: (err) => err.code === 11000,
        handle: (err) => {
            const campos = Object.keys(err.keyPattern ?? err.keyValue ?? {});
            return {
                status: 409,
                mensaje: campos.length
                    ? `Ya existe un registro con ese valor de: ${campos.join(', ')}`
                    : 'Ya existe un registro con esos datos',
            };
        },
    },
    // JWT
    {
        match: (err) => err.name === 'TokenExpiredError',
        handle: () => ({ status: 401, mensaje: 'Token expirado' }),
    },
    {
        match: (err) => err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError',
        handle: () => ({ status: 401, mensaje: 'Token inválido' }),
    },
    // Errores de conexión / timeout con MongoDB
    {
        match: (err) => err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError',
        handle: () => ({ status: 503, mensaje: 'Base de datos no disponible' }),
    },
];

export function errorHandler(err, _req, res, _next) {
    const found = handlers.find((h) => h.match(err));
    if (found) {
        const { status, ...body } = found.handle(err);
        return res.status(status).json(body);
    }

    const statusCode = err.status || 500;

    if (statusCode === 500) console.error(err);

    res.status(statusCode).json({
        mensaje: statusCode === 500 ? 'Error interno del servidor' : err.message,
    });
}