# ADR-0003 · Monorepo

- **Estado:** Aceptada
- **Fecha:** Sprint 0

## Contexto

El equipo es pequeño (3 o 4 personas), el proyecto dura 6 semanas y necesitamos que la documentación, la API y el frontend evolucionen juntos.

## Decisión

Un único repositorio separado en dos niveles: `docs/` (documentación) y `app/` (código), con `app/api/` y `app/web/` dentro. El `docker-compose.yml` vive en `app/` porque es parte de la aplicación. `app/api` y `app/web` tienen cada una su propio `package.json` (no usamos workspaces para mantenerlo simple).

## Consecuencias

- ✅ Un solo tablero, un solo flujo de PR y una historia de usuario puede tocar la API y la web en el mismo PR.
- ✅ El CI ejecuta jobs separados por carpeta.
- ⚠️ El CI corre los jobs de API y web en cada push. Se puede optimizar con filtros `paths:` si llega a ser lento.
