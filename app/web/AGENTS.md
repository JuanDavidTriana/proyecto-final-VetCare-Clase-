# Reglas de diseño · VetCare Web (Angular + Spartan UI + Tailwind v4)

Estas reglas aplican a todo lo que esté dentro de `app/web/`. Salen de lo que ya está construido: la landing (`features/home`), el navbar, el footer y los componentes `hlm*` de `shared/ui`. Cualquier pantalla nueva, incluido el portal clínico, debe verse como si viniera de la misma mano.

---

## 1. Identidad de marca

- **Personalidad:** clínica, cercana, confiable y sin papeles. Limpia y con mucho blanco; el verde es el acento, no el fondo.
- **Colores de marca:** verde + blanco. El verde de la marca es la escala `emerald` de Tailwind.
- **Idioma:** todo el texto visible va en **español** (neutro, con tildes correctas). Los valores técnicos (`scheduled`, `dog`, `owner`) **nunca** se muestran crudos: siempre se traducen (ver §9).
- **Ilustraciones:** **unDraw** (SVG en `public/illustrations/undraw-*.svg`), recoloreadas al verde de marca `#16a34a`. No usar StorySet ni fotos de stock.
- **Iconos:** solo `@ng-icons/lucide` (`<ng-icon name="lucideX" />`), registrados con `provideIcons({...})` en el componente. No mezclar con otras librerías ni usar emojis como iconos de interfaz. Se permiten emojis solo de forma decorativa dentro de `<option>` de especie.

---

## 2. Paleta de color

Usar **siempre clases de Tailwind**. No escribir hex en las plantillas; el hex solo se permite dentro de SVG de ilustraciones.

| Uso | Clase |
|---|---|
| Acción primaria (botón, enlace activo) | `bg-emerald-600` · hover `bg-emerald-700` |
| Texto de acento / iconos destacados | `text-emerald-600` / `text-emerald-700` |
| Fondo suave de sección o tarjeta destacada | `bg-emerald-50/40` a `bg-emerald-50/70` |
| Contenedor de icono | `bg-emerald-100 text-emerald-700` |
| Bordes de marca | `border-emerald-100` (reposo) · `border-emerald-200` (inputs, destacados) · `border-emerald-500` (hover fuerte) |
| Superficie oscura (barra superior, footer) | `bg-emerald-950 text-emerald-100` |
| Texto principal | `text-slate-900` |
| Texto secundario | `text-slate-600` · descripciones `text-slate-500` |
| Bordes neutros / tablas | `border-slate-200` |
| Foco | `ring-2 ring-emerald-500 ring-offset-2` |

**Colores semánticos** (solo para estados, nunca decorativos):

| Estado | Fondo / texto / borde |
|---|---|
| Éxito / atendida | `bg-emerald-50 text-emerald-700 border-emerald-200` |
| Información / programada | `bg-sky-50 text-sky-700 border-sky-200` |
| Advertencia / comprobando | `bg-amber-50 text-amber-700 border-amber-300` |
| Error / destructivo | `bg-red-50 text-red-700 border-red-200` · botón `bg-red-600` |
| Neutro / cancelada / inactivo | `bg-slate-100 text-slate-600 border-slate-200` |

> Las variables CSS de `src/styles.css` (`--primary`, `--muted`, …) están definidas pero los componentes usan clases `emerald-*`. **La fuente de verdad son las clases `emerald-*`.** No mezclar `green-*` con `emerald-*`.

---

## 3. Tipografía

- Fuente: la pila de sistema definida en `styles.css` (`system-ui, -apple-system, Segoe UI, Roboto…`). No agregar fuentes web.
- Texto base con `antialiased` (ya está en el contenedor raíz).

| Elemento | Clases |
|---|---|
| H1 de landing (hero) | `text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-900` |
| H2 de sección | `text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-slate-900` |
| Título de página del portal | `text-2xl font-bold tracking-tight text-slate-900` |
| Título de tarjeta | `hlmCardTitle` → `text-xl font-bold tracking-tight` |
| Cuerpo destacado | `text-base sm:text-lg text-slate-600 leading-relaxed` |
| Cuerpo normal | `text-sm text-slate-600` |
| Etiqueta de formulario | `text-xs font-semibold text-slate-700` |
| Cifras / KPIs | `text-2xl sm:text-3xl font-black text-emerald-700` |
| Ayuda / metadato | `text-xs text-slate-500` |
| "Eyebrow" sobre títulos | badge `subtle` en MAYÚSCULAS con `font-bold` |

Palabra destacada dentro de un título: `text-emerald-600` (en la landing además se usa `underline decoration-emerald-300 decoration-wavy decoration-2`, solo en el hero).

---

## 4. Espaciado, radios y sombras

- **Contenedor:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Secciones de landing:** `py-16` a `py-20`. Se alternan `bg-white` y `bg-emerald-50/40 border-y border-emerald-100/60`.
- **Páginas del portal:** `p-4 sm:p-6 lg:p-8`, con `space-y-6` entre bloques.
- **Grids:** `gap-4` (formularios), `gap-6`/`gap-8` (tarjetas), `gap-12` (columnas de landing). Layout a 12 columnas `lg:grid-cols-12` (texto 7 / ilustración 5).
- **Radios:** botones e inputs `rounded-xl`, tarjetas `rounded-2xl`, botón grande `rounded-2xl`, badges `rounded-full`, contenedor de icono `rounded-xl` (48 px: `w-12 h-12`).
- **Sombras:** suaves. `shadow-sm` en reposo y `hover:shadow-md`. Solo el CTA principal lleva sombra de color (`shadow-lg shadow-emerald-600/30`). Nada de `shadow-2xl` en el portal.

---

## 5. Componentes (`shared/ui`, patrón Spartan "helm")

### Reglas generales
1. **Antes de escribir clases sueltas, reutilizar una directiva `hlm*`.** Si un patrón se repite 2 o más veces, convertirlo en directiva o componente en `shared/ui/<nombre>/`.
2. Las directivas nuevas siguen exactamente el patrón existente:
   - `standalone: true`, selector de atributo `[hlmX]`.
   - `host: { '[class]': '_computedClass()' }`.
   - Variantes con `cva(...)` y el tipo `VariantProps`.
   - El `@Input() class` del usuario se mezcla con `hlm(...)` (`clsx` + `tailwind-merge`), así el consumidor puede sobrescribir clases.
   - Estado interno con `signal` / `computed`.
3. Para comportamiento accesible (dialog, popover, select con teclado, tooltip) usar las primitivas de **`@spartan-ng/brain`** y estilizarlas con un `hlm*`. No reinventar el foco ni el manejo de Escape.

### Catálogo actual (usar tal cual)
| Directiva | Variantes | Uso |
|---|---|---|
| `hlmBtn` | `default` · `secondary` · `outline` · `ghost` · `link` · `destructive`; tamaños `sm` · `default` · `lg` · `icon` | Toda acción clickeable |
| `hlmCard` + `Header` / `Title` / `Description` / `Content` / `Footer` | — | Contenedores de información |
| `hlmBadge` | `default` · `secondary` · `outline` · `subtle` | Estados, roles, eyebrows |

### Jerarquía de botones
- **Una sola** acción `default` (verde sólido) por vista o diálogo: la acción principal.
- Secundarias: `outline` o `secondary`. Acciones en filas de tabla: `ghost` + `size="sm"` o `size="icon"`.
- Destructivas (eliminar, desactivar): `destructive`, **siempre con diálogo de confirmación**.
- Botón con icono: icono a la izquierda, `gap-2`, icono `text-lg` (o `text-base` en `sm`).
- Un botón que solo tiene icono **debe** llevar `aria-label`.

### Formularios
- Inputs, selects y textareas: `w-full px-3 py-2 text-sm rounded-xl border border-emerald-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500`. Al crear el kit esto pasa a `hlmInput`.
- Label arriba (`block text-xs font-semibold text-slate-700 mb-1`), siempre asociado con `for`/`id`.
- Error debajo del campo: `text-xs text-red-600 mt-1`, y el borde cambia a `border-red-300 focus:ring-red-500`.
- Usar **Reactive Forms** en el portal (la landing usa `ngModel` solo para la demo).
- El botón de envío se deshabilita mientras se envía y muestra "Guardando…".
- Los errores del backend (`{ message, details }`) se muestran en el campo correspondiente cuando hay `details` y si no, en un toast.

### Iconos en contenedor (patrón de tarjeta)
```html
<div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
  <ng-icon name="lucideCalendar" class="text-2xl" />
</div>
```

### Lista con check (patrón de beneficios)
```html
<div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
  <ng-icon name="lucideCheck" class="text-xs" />
</div>
```

---

## 6. Layouts

- **Público** (landing, login, registro): barra superior `bg-emerald-950` + navbar blanco + footer. El hero usa `bg-gradient-to-b from-emerald-50/60 via-white to-white` con blobs decorativos `bg-emerald-200/30 blur-3xl` (`pointer-events-none`, `-z-10`).
- **Portal**: sidebar blanco con `border-r border-slate-200`. Ítem activo `bg-emerald-50 text-emerald-700 font-semibold`; inactivo `text-slate-600 hover:bg-emerald-50/60`. Fondo de contenido `bg-slate-50/50`. Topbar blanco con el nombre del usuario y `hlmBadge variant="subtle"` con su rol.
- El menú se genera desde una configuración por rol. **Nunca** mostrar una opción a la que el rol no tiene acceso (el backend igual la bloquea).
- En el portal no van blobs, gradientes fuertes ni animaciones de hover que muevan tarjetas (`-translate-y-1` es solo para la landing).

---

## 7. Estados de interfaz (obligatorios en cada vista con datos)

| Estado | Cómo se ve |
|---|---|
| Cargando | Skeleton (`animate-pulse bg-slate-100 rounded-xl`) con la forma del contenido. No usar spinners de página completa. |
| Vacío | Ilustración unDraw pequeña (`max-h-40`), título corto, una frase y la acción principal ("Registrar mascota"). |
| Error | Tarjeta `bg-red-50 border-red-200` con mensaje en español y botón "Reintentar". |
| Éxito tras una acción | Toast verde corto ("Cita agendada") que se cierra solo a los 4 s. |
| Sin permiso / 403 | Mensaje "No tienes permisos para esta acción". No mostrar el error técnico. |

---

## 8. Ilustraciones unDraw

- Archivo: `public/illustrations/undraw-<tema>.svg`, en minúsculas y con guiones.
- Recolorear el acento a `#16a34a` antes de guardarlo.
- Uso: `<img src="illustrations/undraw-x.svg" alt="Descripción en español" class="w-full h-auto object-contain select-none drop-shadow-sm" />` con `max-h-[340px]` (secciones), `max-h-[420px]` (hero) o `max-h-40` (estados vacíos).
- El `alt` siempre describe la escena en español. Si es solo decorativa: `alt=""` + `aria-hidden="true"`.
- Máximo **una** ilustración por vista del portal (login, estados vacíos, bienvenida).

---

## 9. Textos y traducción de valores del dominio

| Valor API | Se muestra | Badge |
|---|---|---|
| `scheduled` | Programada | info (sky) |
| `done` | Atendida | éxito (emerald) |
| `cancelled` | Cancelada | neutro (slate) |
| `owner` / `vet` / `assistant` / `client` | Dueño / Veterinario / Auxiliar / Tutor | `subtle` |
| `dog` / `cat` / `bird` / `rabbit` / `other` | Perro / Gato / Ave / Conejo / Otro | — |
| `M` / `F` | Macho / Hembra | — |
| `active: false` | Inactivo | neutro |

- Centralizar estas traducciones en un solo archivo (`core/i18n/labels.ts`) y no repetir mapas en los componentes.
- Fechas con `DatePipe` en locale `es-CO`: `EEEE d 'de' MMMM` para títulos de agenda, `d MMM y, h:mm a` en tablas.
- Las acciones van en infinitivo o imperativo corto: "Agendar cita", "Guardar", "Cancelar cita". Confirmaciones en forma de pregunta: "¿Cancelar la cita de Toby?".

---

## 10. Responsive y accesibilidad

- Diseñar **mobile-first**. Breakpoints de Tailwind (`sm`, `md`, `lg`). El portal debe funcionar a 375 px: el sidebar se vuelve un drawer y las tablas pasan a tarjetas o a scroll horizontal (`overflow-x-auto`).
- Contraste AA: el texto sobre `emerald-600` siempre es blanco y el texto sobre fondos claros nunca es más claro que `slate-500`.
- Todo elemento interactivo es alcanzable con teclado y tiene foco visible (`focus-visible:ring-2 ring-emerald-500`).
- Usar HTML semántico: `<button>` para acciones, `<a routerLink>` para navegación, `<table>` con `<th scope="col">` para datos tabulares, y `<main>`, `<nav>`, `<header>`.
- `select-none` solo en elementos decorativos o de marca, nunca en datos que el usuario pueda querer copiar (correos, teléfonos, ids).

---

## 11. Convenciones de código Angular

- Componentes **standalone**, `ChangeDetectionStrategy.OnPush` y `inject()` en lugar de constructor.
- Estado con **signals** (`signal`, `computed`, `input()`, `output()`); control flow nuevo (`@if`, `@for` con `track`, `@switch`).
- Estructura: `core/` (servicios, guards, interceptores, modelos), `shared/ui/` (directivas hlm), `shared/components/` (piezas compuestas), `features/<dominio>/` (pantallas), `layouts/`.
- Nombres: `kebab-case.component.ts`, directivas `Hlm<Nombre>Directive`, selectores de componente con prefijo `app-`.
- Plantillas largas (más de ~80 líneas) van en un `.html` aparte.
- No usar estilos por componente salvo casos excepcionales (el presupuesto es de 4 kB por componente). Todo se resuelve con Tailwind.
- Llamadas HTTP solo desde servicios en `core/api/`, nunca desde componentes directamente.

---

## 12. Lista de verificación antes de dar una pantalla por terminada

- [ ] Usa `hlmBtn`, `hlmCard` y `hlmBadge` (o nuevas directivas `hlm*`), sin duplicar clases largas.
- [ ] Solo hay un botón primario verde.
- [ ] Tiene los estados de carga, vacío y error.
- [ ] Los textos están en español y los valores del dominio traducidos.
- [ ] Se ve bien a 375 px y a 1280 px.
- [ ] Se puede usar con teclado y los botones de solo icono tienen `aria-label`.
- [ ] Las acciones destructivas piden confirmación.
- [ ] Muestra solo lo que el rol puede hacer (matriz en `docs/02-roles-permisos.md`).
- [ ] `npx ng build` compila sin errores ni advertencias de presupuesto.
