import { describe, expect, it } from 'vitest';
import { signIn } from '~/modules/auth/services/auth.mock';

describe('Servicio de autenticación', () => {
  it('exige las credenciales de demostración', async () => {
    expect((await signIn({ email: 'demo@kambista.com', password: 'Demo1234!' })).success).toBe(
      true,
    );
    expect((await signIn({ email: 'demo@kambista.com', password: 'incorrecta' })).success).toBe(
      false,
    );
  });
});
