# 08 · Evaluación y rúbrica

## Peso de la nota

| Componente | Peso | Cuándo |
|---|:-:|---|
| Entregables por sprint (S0 a S4) | 40% | En cada sprint review (8% cada uno) |
| Proceso ágil (tablero, PRs, dailies, retros) | 15% | Durante todo el proyecto |
| Producto final (funcionalidad + calidad) | 25% | Clase 6 |
| Defensa técnica individual | 20% | Clase 6 |

## Entregable por sprint (8% cada uno)

| Sprint | Se considera completo si... |
|---|---|
| **S0** | Docs 01 a 07 revisados por el equipo, backlog en GitHub Projects, repo con docker-compose funcionando y CI en verde |
| **S1** | Login con roles, CRUD de personal, tutores y mascotas en la API, con tests de integración de auth |
| **S2** | Login, layout por rol, pantallas de pacientes y agenda funcionando contra la API |
| **S3** | Historia clínica y vacunas, al menos 60% de cobertura en la API, 1 test e2e y checklist OWASP |
| **S4** | URL pública funcionando, CD desde `main`, `/metrics` y portal del cliente |

Escala para cada sprint: **100%** cumple el objetivo del sprint · **70%** cumple la mayoría de las historias comprometidas · **40%** avance parcial demostrable · **0%** nada demostrable.

## Proceso ágil (15%)

| Criterio | Excelente (5) | Aceptable (3) | Insuficiente (1) |
|---|---|---|---|
| Tablero actualizado | Refleja la realidad en todo momento | Se actualiza antes de la review | Desactualizado |
| Pull Requests | Pequeños, descritos, con revisión real | PRs grandes o con aprobación sin comentarios | Push directo a main |
| Commits | Convencionales y vinculados a la HU | Mezclados | "cambios", "fix", "asdf" |
| Dailies y retros | Constantes, con acciones de mejora cumplidas | Irregulares | No existen |

## Producto final (25%)

| Criterio | Puntos |
|---|:-:|
| Funcionalidad: los 4 roles operan según la matriz de permisos | 8 |
| Seguridad: el backend valida roles y propiedad de los datos, sin secretos en el repo | 5 |
| Calidad del código: estructura por módulos, manejo de errores, lint limpio | 4 |
| Tests: integración, unitarios y e2e en el CI | 4 |
| DevOps: Docker, despliegue y monitoreo | 4 |

## Defensa técnica individual (20%)

Cada estudiante, durante unos **5 minutos**:
1. Explica **una historia de usuario que implementó**, de punta a punta (de la UI a la base de datos).
2. Responde **2 preguntas** del docente sobre el código del equipo. Ejemplos:
   - ¿Qué pasa si un cliente cambia el id en la URL de una mascota ajena?
   - ¿Por qué `app.js` y `server.js` están separados?
   - ¿Cómo revocarías un JWT antes de que expire?
   - ¿Qué índice usa la consulta de la agenda del día?
   - ¿Qué hace cada etapa de tu pipeline?

| Criterio | Puntos |
|---|:-:|
| Explica con claridad el flujo completo | 8 |
| Responde correctamente con argumentos técnicos | 8 |
| Usa vocabulario profesional (y entiende los trade-offs) | 4 |
