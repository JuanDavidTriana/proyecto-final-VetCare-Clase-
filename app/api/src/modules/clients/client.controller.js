import * as clientService from './client.service.js';
import { listClientsQuerySchema } from './client.schemas.js';
import { idParamsSchema } from '../pets/pet.schemas.js';

export async function list(req, res) {
  const query = listClientsQuerySchema.parse(req.query);
  res.json(await clientService.listClients(query));
}

export async function get(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  res.json({ client: await clientService.getClient(id) });
}

export async function create(req, res) {
  res.status(201).json({ client: await clientService.createClient(req.body) });
}

export async function update(req, res) {
  const { id } = idParamsSchema.parse(req.params);
  res.json({ client: await clientService.updateClient(id, req.body) });
}
