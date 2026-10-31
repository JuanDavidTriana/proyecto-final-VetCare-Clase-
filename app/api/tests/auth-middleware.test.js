import { jest } from '@jest/globals';
import { authorize } from '../src/middlewares/auth.js';

describe('authorize middleware', () => {
  it('continues when the user has an allowed role', () => {
    const next = jest.fn();

    authorize('owner')({ user: { role: 'owner' } }, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('throws a 403 error when the user lacks permission', () => {
    const next = jest.fn();

    expect(() => authorize('owner')({ user: { role: 'client' } }, {}, next)).toThrow(
      expect.objectContaining({
        message: 'No tienes permisos para realizar esta acción',
        status: 403,
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });
});
