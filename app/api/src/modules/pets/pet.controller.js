import * as petService from './pet.service.js';
import { idParamsSchema, listQuerySchema } from './pet.schemas.js';

export async function list(req, res) {
  const query = listQuerySchema.parse(req.query);
  res.json(await petService.listPets(req.user, query));
}

export async function get(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  res.json({ pet: await petService.getPet(id, req.user) });
}

export async function create(req, res) {
  const pet = await petService.createPet(req.body, req.user);
  res.status(201).json({ pet });
}

export async function update(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  res.json({ pet: await petService.updatePet(id, req.body, req.user) });
}

export async function remove(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  await petService.deletePet(id, req.user);
  res.status(204).send();
}
