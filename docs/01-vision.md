# 01 · Visión del producto

## El problema

Las veterinarias pequeñas (1 a 5 profesionales) suelen llevar la información de sus pacientes en papel, en hojas de Excel o en un cuaderno de agenda. Eso trae problemas muy concretos:

- **Historias clínicas incompletas o perdidas.** Cuando la mascota vuelve, nadie recuerda qué se le recetó la última vez.
- **Vacunas olvidadas.** No hay forma fácil de saber qué pacientes tienen una dosis por vencer.
- **Agenda desordenada.** Hay citas duplicadas o choques de horario entre veterinarios.
- **El tutor no tiene visibilidad.** Tiene que llamar para preguntar cuándo es la próxima vacuna de su mascota.

## La solución: VetCare

VetCare es una aplicación web para que una clínica veterinaria pequeña **lleve el control de sus pacientes**: quién es la mascota, quién es su tutor, cuándo viene, qué se le hizo y qué le toca.

> **Declaración de visión**
> Para **clínicas veterinarias pequeñas** que necesitan **llevar el control de sus pacientes sin papeles**, VetCare es una **aplicación web** que **centraliza la historia clínica, la agenda y las vacunas**. A diferencia de las hojas de cálculo o de los sistemas grandes de gestión veterinaria, **es simple, se aprende en minutos y le da al tutor acceso a la información de su mascota**.

## Usuarios

| Usuario | Quién es | Qué necesita |
|---|---|---|
| **Dueño de la clínica** | Administra el negocio, a veces también atiende | Gestionar su equipo y ver cómo va la clínica |
| **Veterinario** | Atiende consultas | Su agenda del día y la historia clínica completa del paciente |
| **Auxiliar** | Recepción y apoyo | Registrar tutores y mascotas, agendar citas y aplicar vacunas |
| **Cliente (tutor)** | Dueño de la mascota | Ver sus mascotas, próximas citas y vacunas |

## Alcance del MVP (6 sprints)

**Dentro del alcance**
- Autenticación con roles (dueño, veterinario, auxiliar y cliente)
- Gestión del personal de la clínica
- Registro de tutores y mascotas (pacientes)
- Agenda de citas por veterinario
- Historia clínica: consultas con diagnóstico y tratamiento
- Control de vacunas con fecha de próxima dosis
- Portal del cliente (solo lectura de sus mascotas)
- Despliegue en producción con CI/CD y monitoreo

**Fuera del alcance (por ahora)**
- ❌ Venta de productos, inventario o tienda
- ❌ Facturación y pagos
- ❌ Varias sedes o varias clínicas en la misma instancia
- ❌ Notificaciones por correo o WhatsApp (candidato para una versión 2)
- ❌ App móvil nativa

## Métricas de éxito del MVP

- Un auxiliar registra tutor, mascota y cita en **menos de 2 minutos**.
- Un veterinario ve la historia clínica completa de un paciente en **1 clic** desde su agenda.
- La clínica puede listar las **vacunas que vencen en los próximos 30 días**.
- La aplicación está **desplegada con URL pública** y el pipeline de CI está en verde.
