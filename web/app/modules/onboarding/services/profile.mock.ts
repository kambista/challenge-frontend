import type { ProfileValues } from '../types/profile.types';
import { apiError } from '~/shared/types/api';
export async function createProfile(values: ProfileValues) {
  if (values.documentType === 'DNI' && values.documentNumber === '12345678') {
    return apiError(
      'DUPLICATE_DNI',
      'DNI en uso',
      'El número de documento registrado ya está en uso.',
    );
  }
  if (values.phone === '999999999') {
    return apiError(
      'INVALID_PHONE',
      'Celular inválido',
      'El número de celular registrado ya está en uso.',
    );
  }
  return { success: true as const };
}
