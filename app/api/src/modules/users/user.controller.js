import * as userService from './user.service.js';
import { listStaffQuerySchema } from './user.schemas.js';
import { idParamsSchema } from '../pets/pet.schemas.js';

export async function list(req, res) {
  const query = listStaffQuerySchema.parse(req.query);
  res.json(await userService.listStaff(query));
}

export async function get(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  res.json({ user: await userService.getStaff(id) });
}

export async function create(req, res) {
  res.status(201).json({ user: await userService.createStaff(req.body) });
}

export async function update(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  res.json({ user: await userService.updateStaff(id, req.body, req.user) });
}
