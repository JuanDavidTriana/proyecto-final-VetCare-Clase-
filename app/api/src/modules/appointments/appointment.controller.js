import * as appointmentService from './appointment.service.js';
import {
  idParamsSchema,
  listAppointmentsQuerySchema,
  updateStatusSchema,
} from './appointment.schemas.js';

export async function list(req, res) {
  const query = listAppointmentsQuerySchema.parse(req.query);
  res.json(await appointmentService.listAppointments(req.user, query));
}

export async function get(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  res.json({ appointment: await appointmentService.getAppointment(id, req.user) });
}

export async function create(req, res) {
  res.status(201).json({
    appointment: await appointmentService.createAppointment(req.body, req.user),
  });
}

export async function update(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  res.json({
    appointment: await appointmentService.updateAppointment(id, req.body, req.user),
  });
}

export async function updateStatus(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  const { status } = updateStatusSchema.parse(req.body);
  res.json({
    appointment: await appointmentService.updateStatus(id, status, req.user),
  });
}

export async function remove(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  await appointmentService.deleteAppointment(id, req.user);
  res.status(204).send();
}
