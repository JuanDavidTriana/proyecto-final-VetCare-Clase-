# VetCare

[![CI](https://github.com/JuanDavidTriana/proyecto-final-VetCare-Clase-/actions/workflows/ci.yml/badge.svg)](https://github.com/JuanDavidTriana/proyecto-final-VetCare-Clase-/actions/workflows/ci.yml)

Aplicación web para que una clínica veterinaria pequeña lleve el control de sus pacientes: tutores, mascotas, agenda, historia clínica y vacunas.

## Estructura

| Carpeta | Contenido |
|---|---|
| [`docs/`](./docs/README.md) | Documentación: visión, roles, historias, arquitectura, API, plan de trabajo y ADR |
| [`app/api/`](./app/api) | API REST con Node.js, Express, MongoDB y Better Auth |
| [`app/web/`](./app/web) | Interfaz con Angular, Spartan UI y Tailwind |
| [`app/`](./app) | `docker-compose.yml` y guía de despliegue local |

## Empezar

- Despliegue local con Docker: ver [`app/README-DESPLIEGUE.md`](./app/README-DESPLIEGUE.md).
- Desarrollo de la API: `cd app/api && npm ci && npm run dev`.
- Desarrollo de la web: `cd app/web && npm ci && npm start`.

## Integración continua

El workflow [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) corre en cada pull request y en cada push a `main` y `develop`:

- **API:** lint (`npm run lint`) y tests (`npm test`).
- **Web:** build de producción (falla también con advertencias, regla RD-16) y tests unitarios. El lint de Angular está pendiente (tarea 2.12).

Regla del equipo: un cambio solo se integra a `develop` con el CI en verde. La protección de ramas que lo obliga se configura en T-01.
