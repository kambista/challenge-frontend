import { expect, it } from 'vitest';
import { profileSchema } from '~/modules/onboarding/schemas/profile.schema';
const profile = {
  firstName: 'María López',
  documentType: 'DNI' as const,
  documentNumber: '87654321',
  phone: '987654321',
  birthDate: '1990-06-15',
  acceptTerms: true,
  acceptPrivacy: false,
};
it('valida el formato del documento según el tipo seleccionado', () => {
  expect(profileSchema.safeParse(profile).success).toBe(true);
  expect(profileSchema.safeParse({ ...profile, documentType: 'CE' }).success).toBe(false);
  expect(
    profileSchema.safeParse({ ...profile, documentType: 'CE', documentNumber: '123456789' })
      .success,
  ).toBe(true);
  expect(
    profileSchema.safeParse({ ...profile, documentType: 'PASAPORTE', documentNumber: 'AB123456' })
      .success,
  ).toBe(true);
  expect(profileSchema.safeParse({ ...profile, firstName: 'María123' }).success).toBe(false);
});
it.each([
  ['DNI', '00001234', 'Íñigo  Pérez'],
  ['CE', '000012345', 'Élodie Ana'],
  ['PASAPORTE', 'A1234567', 'María del Mar'],
  ['PASAPORTE', '0001234567890AZ', 'Juana'],
] as const)(
  'acepta %s %s como alternativa al ejemplo',
  (documentType, documentNumber, firstName) => {
    expect(
      profileSchema.safeParse({
        ...profile,
        documentType,
        documentNumber,
        firstName,
        acceptPrivacy: undefined,
      }).data?.acceptPrivacy,
    ).toBe(false);
  },
);
it.each([
  { firstName: '\u0301' },
  { documentNumber: '0001234X' },
  { documentType: 'CE', documentNumber: '0001234567' },
  { documentType: 'PASAPORTE', documentNumber: 'A123456' },
  { documentType: 'PASAPORTE', documentNumber: 'A123456789012345' },
  { documentType: 'PASAPORTE', documentNumber: 'A-1234567' },
  { phone: '98765432X' },
  { birthDate: '1900-02-29' },
])('rechaza datos fuera del contrato %j', (patch) => {
  expect(profileSchema.safeParse({ ...profile, ...patch }).success).toBe(false);
});
it('permite la política opcional y exige aceptar los términos', () => {
  expect(profileSchema.safeParse(profile).success).toBe(true);
  expect(profileSchema.safeParse({ ...profile, acceptTerms: false }).success).toBe(false);
});
