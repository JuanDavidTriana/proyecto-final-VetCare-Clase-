# ADR-0001 · MongoDB como base de datos

- **Estado:** Aceptada
- **Fecha:** Sprint 0

## Contexto

Necesitamos guardar usuarios, mascotas, citas, consultas y vacunas. El programa del curso usa el stack MEAN. Los datos de una consulta veterinaria varían mucho: algunas tienen exámenes y otras no, y los tratamientos tienen formas distintas.

## Decisión

Usamos **MongoDB 7** con **Mongoose** como ODM.

- Colecciones separadas con **referencias** (`ObjectId`) para las entidades que se consultan solas (User, Pet, Appointment).
- Las consultas (`MedicalRecord`) y las vacunas (`Vaccination`) van en **colecciones propias** y no embebidas en Pet, porque crecen sin límite y se consultan por fecha.

## Consecuencias

- ✅ Encaja con el stack del curso y con JSON de punta a punta.
- ✅ El esquema es flexible para los datos clínicos.
- ⚠️ No hay transacciones entre colecciones por defecto. Si lo necesitamos (por ejemplo, crear la consulta y cerrar la cita), usamos `session.withTransaction()` con un replica set o lo aceptamos como riesgo.
- ⚠️ La integridad referencial la valida el código (el servicio comprueba que `owner` exista).

## Alternativas consideradas

- **PostgreSQL**: relaciones fuertes y transacciones, pero se sale del stack MEAN que trabaja el curso.
