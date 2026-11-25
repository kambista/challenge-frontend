import type { LoginValues } from '../types/login.types';
import { DEMO_CREDENTIALS } from '../constants/demo';
import { apiError } from '~/shared/types/api';
export async function signIn(values: LoginValues) {
  if (
    values.email.toLowerCase() !== DEMO_CREDENTIALS.email ||
    values.password !== DEMO_CREDENTIALS.password
  ) {
    return apiError(
      'SERVER_ERROR',
      'No pudimos iniciar sesión',
      'El correo o la contraseña no son correctos.',
    );
  }
  return { success: true as const };
}
