# 03 · Historias de usuario y backlog

> Este archivo se genera a partir de [`backlog.json`](./backlog.json). Para cargarlo en GitHub como issues usa `scripts/crear-backlog.mjs` (ver el README).

## Formato

Cada historia sigue el formato **Como** *rol* **quiero** *acción* **para** *beneficio*, con **criterios de aceptación** verificables y una estimación en **story points** (escala Fibonacci: 1, 2, 3, 5, 8). Las tareas técnicas (`T-xx`) y algunas historias de calidad no siguen el formato de usuario, pero sí tienen criterios.

## Épicas

| Épica | Nombre | Historias | SP |
|---|---|---|---|
| E0 | Sprint 0 · Setup | T-01, T-02, T-03, T-04, T-05 | 7 |
| E1 | Autenticación | HU-01, HU-02, HU-03, HU-04, HU-11 | 12 |
| E2 | Personal | HU-05, HU-06 | 6 |
| E3 | Pacientes | HU-07, HU-08, HU-09, HU-10, HU-12 | 16 |
| E4 | Agenda | HU-13, HU-14, HU-15 | 13 |
| E5 | Historia clínica | HU-16, HU-17 | 8 |
| E6 | Vacunas | HU-18, HU-19 | 6 |
| E7 | Portal cliente | HU-23 | 3 |
| E8 | Calidad y DevOps | HU-20, HU-21, HU-22, HU-24, HU-25, HU-26, HU-27 | 27 |

## Backlog por sprint

### Sprint 0 · Descubrimiento y setup (clase 1) · 7 SP

**Objetivo del sprint:** El equipo entiende el producto, tiene el backlog estimado y un repo que corre localmente con Mongo y CI en verde.

#### T-01 · Crear repositorio, ramas y protección de main  `Sprint 0 · Setup` `1 SP`

> Como equipo quiero un repositorio con main y develop protegidas para trabajar con Pull Requests.

**Criterios de aceptación**
- [ ] Existe el repo en GitHub con main y develop
- [ ] main exige PR con 1 aprobación y CI en verde
- [ ] Todos los integrantes tienen acceso

#### T-02 · Levantar MongoDB con docker-compose  `Sprint 0 · Setup` `1 SP`

> Como desarrollador quiero levantar la base de datos con un solo comando para no instalar Mongo en mi máquina.

**Criterios de aceptación**
- [ ] docker compose up -d levanta mongo y mongo-express
- [ ] mongo-express responde en http://localhost:8081
- [ ] Los datos persisten en un volumen

#### T-03 · Esqueleto de la API con /health  `Sprint 0 · Setup` `2 SP`

> Como desarrollador quiero una API base conectada a Mongo para empezar a construir módulos.

**Criterios de aceptación**
- [ ] npm run dev levanta la API en el puerto 3000
- [ ] GET /health responde { status: 'ok', db: 'connected' }
- [ ] Las variables de entorno se validan al arrancar
- [ ] .env no se sube al repo; existe .env.example

#### T-04 · Pipeline de CI con lint y tests  `Sprint 0 · Setup` `2 SP`

> Como equipo quiero que cada PR ejecute lint y tests para no romper main.

**Criterios de aceptación**
- [ ] GitHub Actions corre en push y pull_request
- [ ] El job ejecuta npm ci, npm run lint y npm test
- [ ] El badge de CI aparece en el README

#### T-05 · Tablero Scrum y backlog cargado  `Sprint 0 · Setup` `1 SP`

> Como Scrum Master quiero el backlog en GitHub Projects para que el equipo vea el avance.

**Criterios de aceptación**
- [ ] Existe un Project con las columnas Backlog, Ready, In progress, Review y Done
- [ ] Las historias están cargadas con épica, sprint y story points
- [ ] Están creados los milestones de los sprints

### Sprint 1 · Backend core (clase 2) · 24 SP

**Objetivo del sprint:** La API permite autenticarse con roles y gestionar personal, tutores y mascotas, con tests de integración.

#### HU-01 · Crear el usuario dueño con un seed  `Autenticación` `1 SP`

> Como dueño de la clínica quiero que exista mi usuario inicial para poder entrar y crear a mi equipo.

**Criterios de aceptación**
- [ ] npm run seed crea un usuario con rol owner si no existe
- [ ] Las credenciales salen de variables de entorno
- [ ] Ejecutarlo dos veces no duplica el usuario

#### HU-02 · Iniciar sesión  `Autenticación` `3 SP`

> Como usuario de VetCare quiero iniciar sesión con correo y contraseña para acceder según mi rol.

**Criterios de aceptación**
- [ ] POST /api/auth/sign-in/email crea una sesión httpOnly y devuelve el usuario
- [ ] Las credenciales inválidas devuelven 401 con un mensaje genérico
- [ ] Un usuario desactivado no puede entrar
- [ ] La contraseña nunca se devuelve en la respuesta

#### HU-03 · Registro público de cliente  `Autenticación` `2 SP`

> Como tutor de una mascota quiero registrarme para consultar la información de mis mascotas.

**Criterios de aceptación**
- [ ] POST /api/auth/sign-up/email crea un usuario siempre con rol client
- [ ] Un correo duplicado devuelve 409
- [ ] La contraseña tiene mínimo 8 caracteres y se guarda con hash

#### HU-04 · Consultar mi sesión  `Autenticación` `1 SP`

> Como usuario autenticado quiero obtener mis datos para que el frontend sepa quién soy.

**Criterios de aceptación**
- [ ] GET /api/auth/get-session con una cookie válida devuelve la sesión del usuario
- [ ] Sin sesión válida, las rutas protegidas devuelven 401

#### HU-05 · Crear personal de la clínica  `Personal` `3 SP`

> Como dueño quiero crear veterinarios y auxiliares para que puedan usar el sistema.

**Criterios de aceptación**
- [ ] POST /api/users solo lo puede usar owner (los demás reciben 403)
- [ ] Solo permite los roles vet y assistant
- [ ] Valida nombre, correo y contraseña

#### HU-06 · Listar, editar y desactivar personal  `Personal` `3 SP`

> Como dueño quiero gestionar mi equipo para mantener actualizado quién trabaja en la clínica.

**Criterios de aceptación**
- [ ] GET /api/users?role=vet filtra por rol
- [ ] PATCH /api/users/:id edita los datos
- [ ] PATCH /api/users/:id/deactivate pone active en false (no se borra)

#### HU-07 · Registrar tutor  `Pacientes` `2 SP`

> Como auxiliar quiero registrar al tutor que llega a la clínica para asociarle sus mascotas.

**Criterios de aceptación**
- [ ] POST /api/clients crea un usuario client con nombre, correo, teléfono y documento
- [ ] Se genera una contraseña temporal
- [ ] Lo pueden usar owner, vet y assistant

#### HU-08 · Registrar mascota  `Pacientes` `3 SP`

> Como auxiliar quiero registrar una mascota asociada a su tutor para abrir su historia clínica.

**Criterios de aceptación**
- [ ] POST /api/pets exige name, species y owner
- [ ] owner debe ser un usuario con rol client que exista
- [ ] species es uno de: dog, cat, bird, rabbit, other

#### HU-09 · Listar y buscar mascotas  `Pacientes` `3 SP`

> Como personal de la clínica quiero buscar mascotas por nombre o tutor para encontrarlas rápido.

**Criterios de aceptación**
- [ ] GET /api/pets?q=toby busca sin distinguir mayúsculas
- [ ] Para el rol client solo devuelve sus mascotas
- [ ] La respuesta incluye el nombre y el teléfono del tutor

#### HU-10 · Ver, editar y eliminar mascota  `Pacientes` `3 SP`

> Como personal de la clínica quiero ver y actualizar la ficha de una mascota para mantener sus datos al día.

**Criterios de aceptación**
- [ ] GET /api/pets/:id devuelve 403 si un client pide una mascota ajena
- [ ] PATCH /api/pets/:id valida los datos
- [ ] DELETE /api/pets/:id solo lo puede usar owner
- [ ] Un id inválido devuelve 400 y uno inexistente 404

### Sprint 2 · Frontend y agenda (clase 3) · 23 SP

**Objetivo del sprint:** Un auxiliar puede iniciar sesión, registrar una mascota y agendarle una cita desde la interfaz.

#### HU-11 · Pantalla de login y layout por rol  `Autenticación` `5 SP`

> Como usuario quiero una pantalla de inicio de sesión y un menú acorde a mi rol para usar la app.

**Criterios de aceptación**
- [ ] Formulario reactivo con validaciones
- [ ] El token se guarda y un interceptor lo envía en cada petición
- [ ] Un 401 redirige al login
- [ ] El menú lateral muestra solo las opciones del rol
- [ ] authGuard y roleGuard protegen las rutas

#### HU-12 · Pantallas de tutores y mascotas  `Pacientes` `5 SP`

> Como auxiliar quiero registrar y buscar tutores y mascotas desde la interfaz.

**Criterios de aceptación**
- [ ] Tabla de mascotas con búsqueda
- [ ] Formulario de alta y edición con validaciones
- [ ] Ficha de la mascota con sus datos y su tutor
- [ ] Se muestran mensajes de éxito y error (snackbar)

#### HU-13 · Agendar cita (API)  `Agenda` `5 SP`

> Como auxiliar quiero agendar una cita para una mascota con un veterinario para organizar la agenda.

**Criterios de aceptación**
- [ ] POST /api/appointments exige pet, vet, date y reason
- [ ] La fecha no puede estar en el pasado
- [ ] No se permiten dos citas del mismo veterinario con menos de 30 minutos de diferencia (409)
- [ ] El estado inicial es scheduled

#### HU-14 · Agenda del día y cambio de estado (API)  `Agenda` `3 SP`

> Como veterinario quiero ver mis citas del día y marcarlas como atendidas.

**Criterios de aceptación**
- [ ] GET /api/appointments?date=2026-10-20&vet=:id filtra por día y veterinario
- [ ] PATCH /api/appointments/:id/status acepta done o cancelled
- [ ] Solo el vet puede marcar done

#### HU-15 · Pantalla de agenda  `Agenda` `5 SP`

> Como personal de la clínica quiero ver y gestionar la agenda desde la interfaz.

**Criterios de aceptación**
- [ ] Vista del día con selector de fecha y de veterinario
- [ ] Formulario para agendar con selector de mascota
- [ ] Los errores de choque de horario se muestran al usuario
- [ ] Botones para atender o cancelar según el rol

### Sprint 3 · Historia clínica y calidad (clase 4) · 27 SP

**Objetivo del sprint:** El veterinario registra consultas y vacunas, y el pipeline corre tests unitarios, de integración y e2e.

#### HU-16 · Registrar consulta  `Historia clínica` `5 SP`

> Como veterinario quiero registrar la consulta de una mascota para construir su historia clínica.

**Criterios de aceptación**
- [ ] POST /api/pets/:id/records con peso, temperatura, diagnóstico, tratamiento y notas
- [ ] El vet se toma del token y no del cuerpo de la petición
- [ ] Si viene de una cita, la cita pasa a done
- [ ] Pantalla con formulario de consulta

#### HU-17 · Ver historia clínica  `Historia clínica` `3 SP`

> Como veterinario quiero ver la historia clínica en orden cronológico para tomar mejores decisiones.

**Criterios de aceptación**
- [ ] GET /api/pets/:id/records devuelve las consultas ordenadas de la más reciente a la más antigua
- [ ] Incluye el nombre del veterinario
- [ ] Línea de tiempo en la ficha de la mascota

#### HU-18 · Registrar vacuna  `Vacunas` `3 SP`

> Como veterinario o auxiliar quiero registrar una vacuna aplicada con su próxima dosis.

**Criterios de aceptación**
- [ ] POST /api/pets/:id/vaccinations con vaccine, appliedAt y nextDueDate
- [ ] nextDueDate debe ser posterior a appliedAt
- [ ] Las vacunas se ven en la ficha de la mascota

#### HU-19 · Vacunas por vencer  `Vacunas` `3 SP`

> Como auxiliar quiero ver qué vacunas vencen pronto para llamar a los tutores.

**Criterios de aceptación**
- [ ] GET /api/vaccinations/due?days=30
- [ ] Incluye la mascota y el teléfono del tutor
- [ ] Usa un índice en nextDueDate
- [ ] Tabla en el dashboard

#### HU-20 · Tests de integración y unitarios con cobertura  `Calidad y DevOps` `5 SP`

> Como equipo quiero tests automáticos para refactorizar sin miedo.

**Criterios de aceptación**
- [ ] Tests con supertest y mongodb-memory-server para auth, pets y appointments
- [ ] Tests unitarios de al menos 2 servicios o componentes de Angular
- [ ] Cobertura mínima del 60% en la API
- [ ] El CI falla si fallan los tests

#### HU-21 · Test e2e del flujo principal  `Calidad y DevOps` `5 SP`

> Como equipo quiero un test end-to-end del flujo login → registrar mascota → agendar cita.

**Criterios de aceptación**
- [ ] Test con Playwright o Cypress
- [ ] Corre contra la app levantada localmente
- [ ] Está documentado en el README cómo ejecutarlo

#### HU-22 · Revisión de seguridad (OWASP básico)  `Calidad y DevOps` `3 SP`

> Como dueño de la clínica quiero que los datos de mis pacientes estén protegidos.

**Criterios de aceptación**
- [ ] helmet, CORS restringido y rate limit en /auth
- [ ] No hay secretos en el repo
- [ ] Validación de entrada con zod en todos los endpoints
- [ ] npm audit sin vulnerabilidades altas

### Sprint 4 · Producción (clase 5) · 17 SP

**Objetivo del sprint:** VetCare está desplegado con URL pública, el cliente ve su portal y hay métricas y logs.

#### HU-23 · Portal del cliente  `Portal cliente` `3 SP`

> Como tutor quiero ver mis mascotas, sus próximas citas y vacunas para estar al día.

**Criterios de aceptación**
- [ ] Vista 'Mis mascotas' solo con las suyas
- [ ] Próximas citas y vacunas por vencer
- [ ] Historia clínica en modo solo lectura

#### HU-24 · Dashboard por rol  `Calidad y DevOps` `3 SP`

> Como dueño quiero un resumen de la clínica para saber cómo vamos.

**Criterios de aceptación**
- [ ] Muestra citas de hoy, pacientes nuevos del mes y vacunas por vencer
- [ ] El veterinario ve su agenda del día
- [ ] Usa un aggregation pipeline de Mongo

#### HU-25 · Dockerizar API y frontend  `Calidad y DevOps` `3 SP`

> Como equipo quiero imágenes Docker para desplegar igual en cualquier entorno.

**Criterios de aceptación**
- [ ] Dockerfile multi-stage para web (servido con nginx)
- [ ] Dockerfile para la API con usuario no root
- [ ] docker compose up levanta todo el stack

#### HU-26 · Despliegue en producción con CD  `Calidad y DevOps` `5 SP`

> Como dueño de la clínica quiero usar VetCare desde internet.

**Criterios de aceptación**
- [ ] Base de datos en MongoDB Atlas
- [ ] API y web desplegadas en Railway (o Render)
- [ ] Los secretos se configuran en la plataforma y no en el repo
- [ ] Se despliega automáticamente al hacer merge a main

#### HU-27 · Métricas, logs y health checks  `Calidad y DevOps` `3 SP`

> Como equipo quiero monitorear la API en producción para detectar problemas.

**Criterios de aceptación**
- [ ] GET /metrics con prom-client (petición y duración por ruta)
- [ ] Logs estructurados en JSON (pino)
- [ ] /health verifica la conexión a la base de datos

---
**Total del backlog:** 32 ítems · 98 story points.
