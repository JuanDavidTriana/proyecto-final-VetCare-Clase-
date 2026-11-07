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

La migración copia el hash bcrypt existente y conserva el ObjectId de cada perfil para no romper las referencias de mascotas. Es idempotente y no cambia contraseñas. Las sesiones JWT antiguas dejan de funcionar; los usuarios deberán iniciar sesión de nuevo.

### Personal (`/api/users`)

| Método | Ruta | Roles | Notas |
|---|---|---|---|
| GET | `/` | owner | Lista personal |
| POST | `/` | owner | Crea usuarios con rol `vet` o `assistant` |
| GET | `/:id` | owner | Consulta personal |
| PATCH | `/:id` | owner | Actualiza datos o desactiva personal |

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
| POST | `/` | owner, vet, assistant, client | El personal indica `owner`; un cliente queda como tutor |
| GET | `/:id` | todos | Un cliente solo ve sus mascotas |
| PATCH | `/:id` | todos | Restringido a mascotas accesibles por el usuario |
| DELETE | `/:id` | owner, vet, assistant | Elimina una mascota |

### Historias clínicas y vacunas (planificado)

| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | `/api/pets/:id/records` | todos | Consulta la historia clínica; el cliente solo ve la de sus mascotas |
| POST | `/api/pets/:id/records` | vet | Registra una consulta |
| GET | `/api/pets/:id/vaccinations` | todos | Lista vacunas de una mascota |
| POST | `/api/pets/:id/vaccinations` | vet, assistant | Registra una vacuna |
| GET | `/api/vaccinations/due` | owner, vet, assistant | Busca vacunas próximas a vencer |

### Citas y dashboard (planificado)

| Método | Ruta | Roles | Descripción |
|---|---|---|---|
| GET | `/api/appointments` | todos | Lista citas; el cliente solo ve las suyas |
| POST | `/api/appointments` | owner, vet, assistant | Programa una cita |
| PATCH | `/api/appointments/:id` | owner, vet, assistant | Reprograma una cita |
| PATCH | `/api/appointments/:id/status` | vet, assistant | Actualiza el estado |
| GET | `/api/dashboard` | owner, vet | Devuelve indicadores de la clínica |

## Ejemplo de registro

```http
POST /api/auth/sign-up/email
Content-Type: application/json

{ "name": "María Pérez", "email": "maria@correo.dev", "password": "Cliente1234" }
```

La respuesta establece la cookie de sesión. El cliente debe conservarla y enviarla en las siguientes llamadas; no debe guardar tokens en `localStorage`.

Configura `BETTER_AUTH_SECRET` con un valor aleatorio de al menos 32 caracteres, `BETTER_AUTH_URL` con la URL pública de la API y `CORS_ORIGIN` con los orígenes permitidos separados por comas.
