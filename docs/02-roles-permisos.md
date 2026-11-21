# 02 · Roles y permisos

VetCare usa **control de acceso basado en roles (RBAC)**. Cada usuario tiene **un solo rol**, almacenado en el perfil y validado en el backend con el middleware `authorize(...roles)`.

| Rol | Código en el sistema | Cómo se crea |
|---|---|---|
| Dueño | `owner` | Con el script de *seed* (el primer usuario de la clínica) |
| Veterinario | `vet` | Lo crea el dueño |
| Auxiliar | `assistant` | Lo crea el dueño |
| Cliente (tutor) | `client` | Lo crea el personal al registrar al tutor, o el propio tutor desde el registro público |

## Matriz de permisos

Leyenda: ✅ permitido · 👁️ solo lectura · 🔒 solo sus propios datos · ❌ no permitido

| Recurso / acción | Dueño | Veterinario | Auxiliar | Cliente |
|---|:-:|:-:|:-:|:-:|
| **Personal**: crear, editar o desactivar | ✅ | ❌ | ❌ | ❌ |
| **Personal**: listar | ✅ | 👁️¹ | 👁️¹ | ❌ |
| **Tutores**: crear o editar | ✅ | ✅ | ✅ | ❌ |
| **Mascotas**: crear o editar | ✅ | ✅ | ✅ | ❌ |
| **Mascotas**: ver | ✅ | ✅ | ✅ | 🔒 |
| **Mascotas**: eliminar | ✅ | ❌ | ❌ | ❌ |
| **Citas**: crear, reprogramar o cancelar | ✅ | ✅ | ✅ | ❌ |
| **Citas**: ver | ✅ | ✅ | ✅ | 🔒 |
| **Citas**: marcar como atendida | ✅ | ✅ | ❌ | ❌ |
| **Consultas** (historia clínica): crear | ❌ | ✅ | ❌ | ❌ |
| **Consultas**: ver | ✅ | ✅ | 👁️ | 🔒 |
| **Vacunas**: registrar | ❌ | ✅ | ✅ | ❌ |
| **Vacunas**: ver | ✅ | ✅ | ✅ | 🔒 |
| **Dashboard** con indicadores de la clínica | ✅ | 👁️ (su agenda) | 👁️ (agenda del día) | ❌ |

¹ Solo veterinarios activos, con id y nombre (`GET /api/users/vets`, tarea 2.4, decisión D-05).

> La matriz se mantiene sincronizada con [`permisos.json`](./permisos.json), que leen los tests de permisos y el menú del portal. Las decisiones D-01 a D-06 se aprobaron el 20 de noviembre de 2026 ([ver sección 5 del plan de trabajo](./10-plan-trabajo.md#5-decisiones-previas-aprobadas)). Si se cambia una, se cambian los dos archivos.

## Reglas de negocio clave

1. **Un cliente nunca ve datos de otro cliente.** El backend filtra por `owner = req.user.id`; no basta con ocultarlo en el frontend.
2. **Solo el veterinario firma consultas.** El campo `vet` de la consulta se toma de la sesión de Better Auth (`req.user.id`) y no del cuerpo de la petición.
3. **El registro público siempre crea usuarios `client`.** Aunque alguien envíe `role: "owner"` en el cuerpo, se ignora.
4. **No se borra personal: se desactiva** (`active: false`), para conservar la autoría de las historias clínicas.
5. Un usuario desactivado no puede iniciar sesión.
