import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { z } from 'zod';
import { errorHandler } from '../src/middlewares/error.js';

function build(thrower) {
  const app = express();
  app.use(express.json());
  app.post('/t', (req) => thrower(req));
  app.use(errorHandler);
  return app;
}

describe('errorHandler', () => {
  it('maps ZodError to 400 with field details', async () => {
    const app = build(() => z.object({ a: z.string() }).parse({}));
    const res = await request(app).post('/t').send({});
    expect(res.status).toBe(400);
    expect(res.body.errores[0].campo).toBe('a');
  });

  it('maps malformed JSON to 400', async () => {
    const app = build(() => {});
    const res = await request(app).post('/t').set('Content-Type', 'application/json').send('{bad');
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toMatch(/JSON/);
  });

  it('maps CastError to 400', async () => {
    const err = Object.assign(new Error('x'), { name: 'CastError', path: '_id' });
    const res = await request(build(() => { throw err; })).post('/t');
    expect(res.status).toBe(400);
    expect(res.body.mensaje).toContain('_id');
  });

  it('maps duplicate key code 11000 to 409', async () => {
    const err = Object.assign(new Error('dup'), { code: 11000, keyPattern: { email: 1 } });
    const res = await request(build(() => { throw err; })).post('/t');
    expect(res.status).toBe(409);
    expect(res.body.mensaje).toContain('email');
  });

  it('maps Mongoose ValidationError to 400', async () => {
    const err = Object.assign(new Error('v'), {
      name: 'ValidationError',
      errors: { name: { path: 'name', message: 'requerido' } },
    });
    const res = await request(build(() => { throw err; })).post('/t');
    expect(res.status).toBe(400);
    expect(res.body.errores[0]).toEqual({ campo: 'name', mensaje: 'requerido' });
  });

  it('maps JWT errors to 401', async () => {
    const err = Object.assign(new Error('jwt'), { name: 'TokenExpiredError' });
    const res = await request(build(() => { throw err; })).post('/t');
    expect(res.status).toBe(401);
  });

  it('hides unknown errors as 500', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = await request(build(() => { throw new Error('boom'); })).post('/t');
    expect(res.status).toBe(500);
    expect(res.body.mensaje).toBe('Error interno del servidor');
    spy.mockRestore();
  });

  it('keeps AppError status and message', async () => {
    const err = Object.assign(new Error('prohibido'), { status: 403 });
    const res = await request(build(() => { throw err; })).post('/t');
    expect(res.status).toBe(403);
    expect(res.body.mensaje).toBe('prohibido');
  });
});
