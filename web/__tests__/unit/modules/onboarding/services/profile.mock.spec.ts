import { expect, it } from 'vitest';
import { createProfile } from '~/modules/onboarding/services/profile.mock';
const profile = {
  firstName: 'María López',
  documentType: 'DNI' as const,
  documentNumber: '87654321',
  phone: '987654321',
  birthDate: '1990-06-15',
  acceptTerms: true,
  acceptPrivacy: false,
};
it('devuelve los errores de registro del contrato APIError', async () => {
  expect(await createProfile({ ...profile, documentNumber: '12345678' })).toMatchObject({
    success: false,
    data: { name: 'DUPLICATE_DNI' },
  });
  expect(await createProfile({ ...profile, phone: '999999999' })).toMatchObject({
    success: false,
    data: { name: 'INVALID_PHONE' },
  });
});
