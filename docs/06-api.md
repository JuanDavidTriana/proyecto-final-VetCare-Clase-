# 06 · Contrato de la API

- **Base URL local:** `http://localhost:3000`
- **Formato:** JSON
- **Autenticación:** cookie de sesión httpOnly de Better Auth. En llamadas cross-origin, el cliente debe enviar credenciales (`withCredentials` / `credentials: "include"`).

## Convenciones

| Situación | Código | Cuerpo |
|---|---|---|
| OK | `200` | recurso o lista |
| Creado | `201` | recurso creado |
| Sin contenido (DELETE) | `204` | — |
| Datos inválidos o id mal formado | `400` | error de validación |
| Sin sesión o sesión inválida | `401` | error de autenticación |
| Rol sin permiso | `403` | error de autorización |
| No existe | `404` | error de recurso |
| Duplicado | `409` | error de conflicto |
| Error inesperado | `500` | mensaje genérico, sin detalles |

Las listas aceptan `?page=1&limit=20` y responden `{ items, total, page, limit, pages }`.

## Endpoints

### Sistema

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado de la API y de la base de datos |

### Autenticación (`/api/auth`)

Better Auth recibe todas las rutas bajo `/api/auth/*`.

| Método | Ruta | Acceso | Body / Query | Respuesta |
|---|---|---|---|---|
| POST | `/sign-up/email` | Público | `{ name, email, password, phone? }` | Crea cuenta de cliente y sesión en cookie; el rol es siempre `client` |
| POST | `/sign-in/email` | Público | `{ email, password }` | Inicia sesión y entrega una cookie httpOnly |
| POST | `/sign-out` | Sesión | — | Revoca la sesión y elimina la cookie |
| GET | `/get-session` | Sesión | — | Devuelve la sesión y el usuario |

Las cuentas que existían antes de Better Auth se migran una sola vez, antes de desplegar esta versión:

```powershell
Set-Location app\api
npm run auth:migrate
```

La migración copia el hash bcrypt existente y conserva el ObjectId de cada perfil para no romper las referencias de mascotas. Es idempotente y no cambia contraseñas. Después de la migración, cada usuario inicia sesión y recibe una sesión de Better Auth.

### Personal (`/api/users`)

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/` | owner | Lista personal |
| POST | `/` | owner | Crea usuarios con rol `vet` o `assistant` |
| GET | `/:id` | owner | Consulta personal |
| PATCH | `/:id` | owner | Actualiza datos o desactiva personal |
| GET | `/vets` | owner, vet, assistant | Solo id y nombre de veterinarios activos (planificado, tarea 2.4) |

### Tutores (`/api/clients`)

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/` | owner, vet, assistant | Lista y busca tutores |
| POST | `/` | owner, vet, assistant | Crea tutor con cuenta de acceso |
| GET | `/:id` | owner, vet, assistant | Incluye sus mascotas |
| PATCH | `/:id` | owner, vet, assistant | Edita datos del tutor |

### Mascotas (`/api/pets`)

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/` | todos | Un cliente solo ve sus mascotas |
| POST | `/` | owner, vet, assistant | El personal indica `owner` (tutor) |
| GET | `/:id` | todos | Un cliente solo ve sus mascotas |
| PATCH | `/:id` | owner, vet, assistant | Edita los datos de la mascota |
| DELETE | `/:id` | owner | Elimina una mascota |

### Historias clínicas y vacunas (planificado)

| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | `/api/pets/:id/records` | todos | Consulta la historia clínica; el cliente solo ve la de sus mascotas |
| POST | `/api/pets/:id/records` | vet | Registra una consulta |
| GET | `/api/pets/:id/vaccinations` | todos | Lista vacunas de una mascota |
| POST | `/api/pets/:id/vaccinations` | vet, assistant | Registra una vacuna |
| GET | `/api/vaccinations/due` | owner, vet, assistant | Busca vacunas próximas a vencer |

### Citas (`/api/appointments`)

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/` | todos | Filtros `date` (YYYY-MM-DD), `vet`, `pet`, `status`, `page`, `limit`; el cliente solo ve las citas de sus mascotas |
| POST | `/` | owner, vet, assistant | Exige `pet`, `vet`, `date` y `reason`; la fecha no puede estar en el pasado; choque con otra cita del mismo veterinario a menos de 30 min → 409 |
| GET | `/:id` | todos | El cliente solo ve las de sus mascotas (una ajena responde 404) |
| PATCH | `/:id` | owner, vet, assistant | Reprograma (fecha, veterinario, mascota o motivo) |
| PATCH | `/:id/status` | `done`: owner, vet · `cancelled`: owner, vet, assistant | Cambia el estado |
| DELETE | `/:id` | owner | Elimina la cita |

### Dashboard (planificado)

| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | `/api/dashboard` | owner, vet, assistant | Indicadores de la clínica; el veterinario ve su agenda |

> La tabla completa de permisos por rol está en [`permisos.json`](./permisos.json). Hasta la tarea 2.4 el backend todavía permite al cliente crear y editar sus mascotas, agendar y cancelar sus citas, y a todo el personal eliminar mascotas.

## Ejemplo de registro

```http
POST /api/auth/sign-up/email
Content-Type: application/json

{ "name": "María Pérez", "email": "maria@correo.dev", "password": "Cliente1234" }
```

La respuesta establece la cookie de sesión. El cliente debe conservarla y enviarla en las siguientes llamadas; no debe guardar tokens en `localStorage`.

Configura `BETTER_AUTH_SECRET` con un valor aleatorio de al menos 32 caracteres, `BETTER_AUTH_URL` con la URL pública de la API y `CORS_ORIGIN` con los orígenes permitidos separados por comas.
