import { expect, it } from 'vitest';
import { isAdult } from '~/modules/onboarding/utils/isAdult';
it('acepta desde el cumpleaños 18 y rechaza fechas inexistentes', () => {
  const today = new Date(2026, 10, 22);
  expect(isAdult('2008-11-22', today)).toBe(true);
  expect(isAdult('2008-11-23', today)).toBe(false);
  expect(isAdult('2000-02-30', today)).toBe(false);
  expect(isAdult('0004-02-29', today)).toBe(true);
  expect(isAdult('0000-02-29', today)).toBe(false);
  expect(isAdult('2027-01-01', today)).toBe(false);
});
