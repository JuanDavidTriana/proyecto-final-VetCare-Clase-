import * as authService from './auth.service.js';

export async function register(req, res) {
  const session = await authService.registerClient(req.body);
  res.status(201).json(session);
}

export async function login(req, res) {
  const session = await authService.login(req.body);
  res.json(session);
}

export async function me(req, res) {
  const user = await authService.me(req.user.id);
  res.json({ user });
}
