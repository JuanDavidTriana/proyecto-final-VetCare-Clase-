# 06 · Contrato de la API

- **Base URL local:** `http://localhost:3000`
- **Formato:** JSON
- **Autenticación:** cabecera `Authorization: Bearer <token>` en todas las rutas, salvo las marcadas como 🌐 públicas.

## Convenciones

| Situación | Código | Cuerpo |
|---|---|---|
| OK | `200` | recurso o lista |
| Creado | `201` | recurso creado |
| Sin contenido (DELETE) | `204` | — |
| Datos inválidos (zod) o id mal formado | `400` | `{ message, errors?: [{ field, message }] }` |
| Sin token o token inválido | `401` | `{ message }` |
| Rol sin permiso | `403` | `{ message }` |
| No existe | `404` | `{ message }` |
| Duplicado o choque de agenda | `409` | `{ message }` |
| Error inesperado | `500` | `{ message: 'Error interno' }` (sin detalles) |

Las listas aceptan `?page=1&limit=20` y responden `{ data: [...], total, page, limit }` (a partir del Sprint 2).

## Endpoints

### Sistema

| Método | Ruta | Roles | Sprint | Descripción |
|---|---|---|:-:|---|
| GET | `/health` | 🌐 | 0 | Estado de la API y de la base de datos |
| GET | `/metrics` | 🌐 (interno) | 4 | Métricas en formato Prometheus |

### Auth (`/api/auth`)

| Método | Ruta | Roles | Sprint | Body / Query | Respuesta |
|---|---|---|:-:|---|---|
| POST | `/login` | 🌐 | 1 | `{ email, password }` | `{ token, user: { id, name, role } }` · 401 credenciales inválidas · 403 usuario desactivado |
| POST | `/register` | 🌐 | 1 | `{ name, email, password, phone? }` | `201 { token, user }` (role siempre `client`) |
| GET | `/me` | todos | 1 | — | `{ id, name, email, role }` |

### Personal (`/api/users`)

| Método | Ruta | Roles | Sprint | Notas |
|---|---|---|:-:|---|
| GET | `/` | owner, vet, assistant | 1 | `?role=vet` |
| POST | `/` | owner | 1 | `role` ∈ `vet`, `assistant` |
| PATCH | `/:id` | owner | 1 | No permite cambiar la contraseña |
| PATCH | `/:id/deactivate` | owner | 1 | `active = false` |

### Tutores (`/api/clients`)

| Método | Ruta | Roles | Sprint | Notas |
|---|---|---|:-:|---|
| GET | `/` | owner, vet, assistant | 1 | `?q=` busca por nombre, correo o documento |
| POST | `/` | owner, vet, assistant | 1 | `{ name, email, phone, document }` → `201 { client, temporaryPassword }` (la contraseña temporal se muestra una sola vez) |
| GET | `/:id` | owner, vet, assistant | 1 | Incluye sus mascotas (`pets[]`) |
| PATCH | `/:id` | owner, vet, assistant | 1 | Editar datos del tutor |

### Mascotas (`/api/pets`)

| Método | Ruta | Roles | Sprint | Notas |
|---|---|---|:-:|---|
| GET | `/` | todos | 1 | `?q=` busca por nombre de la mascota o del tutor; el client solo ve las suyas |
| POST | `/` | owner, vet, assistant | 1 | `{ name, species, owner, breed?, sex?, birthDate?, weightKg? }` |
| GET | `/:id` | todos | 1 | El client recibe 403 si la mascota no es suya |
| PATCH | `/:id` | owner, vet, assistant | 1 | |
| DELETE | `/:id` | owner | 1 | |
| GET | `/:id/records` | todos | 3 | Historia clínica (el client solo la de sus mascotas) |
| POST | `/:id/records` | vet | 3 | `{ weightKg?, temperatureC?, diagnosis, treatment?, notes?, appointment? }` |
| GET | `/:id/vaccinations` | todos | 3 | |
| POST | `/:id/vaccinations` | vet, assistant | 3 | `{ vaccine, appliedAt?, nextDueDate }` |

### Citas (`/api/appointments`)

| Método | Ruta | Roles | Sprint | Notas |
|---|---|---|:-:|---|
| GET | `/` | todos | 2 | `?date=YYYY-MM-DD&vet=:id`; el client solo ve las suyas |
| POST | `/` | owner, vet, assistant | 2 | `{ pet, vet, date, reason }`; 409 si hay un choque de ±30 min |
| PATCH | `/:id` | owner, vet, assistant | 2 | Reprogramar |
| PATCH | `/:id/status` | vet (`done`), staff (`cancelled`) | 2 | `{ status }` |

### Vacunas y dashboard

| Método | Ruta | Roles | Sprint | Notas |
|---|---|---|:-:|---|
| GET | `/api/vaccinations/due` | owner, vet, assistant | 3 | `?days=30` |
| GET | `/api/dashboard` | owner, vet | 4 | Indicadores calculados con aggregation |

## Ejemplo

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "owner@vetcare.dev", "password": "Owner1234" }
```

```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "671f...", "name": "Dueña Demo", "role": "owner" }
}
```

> Archivo para probar en VS Code (extensión REST Client): `app/api/requests.http`.
