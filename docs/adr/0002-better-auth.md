# ADR-0002 · Autenticación con Better Auth

- **Estado:** Aceptada
- **Fecha:** Sprint 1

## Contexto

La API necesita autenticación de correo y contraseña, sesiones revocables y autorización basada en los roles de VetCare. Las cuentas actuales usan MongoDB y hashes bcrypt administrados por la aplicación.

## Decisión

- Usar **Better Auth** con su adaptador oficial de MongoDB, guardando usuarios, cuentas y sesiones en la misma base de datos.
- El backend entrega sesiones mediante cookies **httpOnly**; Express habilita CORS con credenciales.
- Mantener los perfiles de VetCare en Mongoose y compartir el ObjectId entre el perfil y el usuario de Better Auth.
- Conservar compatibilidad de hashes configurando bcrypt (10 rondas) como algoritmo de contraseña.
- Importar las cuentas existentes con `npm run auth:migrate` antes de desplegar esta versión. La importación es idempotente y conserva IDs y hashes.
- Las sesiones JWT emitidas por la versión anterior no se migran; cada usuario debe iniciar sesión nuevamente.
- La autorización consulta el rol y el estado activo del perfil Mongoose en cada petición protegida.

## Consecuencias

- ✅ Las sesiones se pueden revocar al cerrar sesión y no se exponen a JavaScript como un token almacenado en el navegador.
- ✅ Los roles y usuarios desactivados se verifican contra el perfil actual, no dependen de datos antiguos de una sesión.
- ⚠️ La cookie requiere que el cliente habilite credenciales y que CORS permita el origen explícito.
- ⚠️ La migración debe ejecutarse antes de recibir tráfico con la versión nueva. Los hashes bcrypt existentes se importan sin conocer ni cambiar las contraseñas.
