import { test, expect } from '@playwright/test';
import {
  mockExchange,
  login,
  fillProfile,
  onboard,
  details,
  select,
  addAccount,
} from '../support/helpers';
test.beforeEach(async ({ page }) => {
  await mockExchange(page);
});
test('protege rutas y conserva sesión al recargar', async ({ page }) => {
  await page.goto('/operacion/constancia');
  await expect(page).toHaveURL(/\/$/);
  await login(page);
  await page.reload();
  await expect(page).toHaveURL(/\/registro$/);
  await fillProfile(page);
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await page.goto('/operacion/exito');
  await expect(page).toHaveURL(/\/inicio$/);
});
test('bloquea accesos directos sin sesión y con perfil incompleto', async ({ page }) => {
  const protectedPaths = [
    '/registro/exito',
    '/inicio',
    '/operacion',
    '/operacion/transferencia',
    '/operacion/constancia',
    '/operacion/exito',
  ];
  for (const path of protectedPaths) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByLabel('Correo electrónico', { exact: true })).toBeVisible();
  }
  await login(page);
  for (const path of protectedPaths.filter((path) => path !== '/registro/exito')) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/registro$/);
    await expect(
      page.getByRole('heading', { name: 'Completa tus datos', exact: true }),
    ).toBeVisible();
  }
});

test('exige cotización, operación, transferencia y constancia en ese orden', async ({ page }) => {
  await onboard(page);
  await page.goto('/operacion/exito');
  await expect(page).toHaveURL(/\/inicio$/);
  await details(page);
  await page.goto('/operacion/exito');
  await expect(page).toHaveURL(/\/operacion$/);
  await select(page, '¿Desde qué banco nos envías tu dinero?', 'Interbank');
  await addAccount(page);
  await select(page, 'Origen de fondos', 'Ahorros');
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await page.goto('/operacion/exito');
  await expect(page).toHaveURL(/\/operacion\/transferencia$/);
  await expect(
    page.getByRole('heading', { name: '¡Constancia enviada!', exact: true }),
  ).not.toBeVisible();
  await page.getByRole('button', { name: 'YA HICE MI TRANSFERENCIA', exact: true }).click();
  await page.goto('/operacion/exito');
  await expect(page).toHaveURL(/\/operacion\/constancia$/);
  await expect(
    page.getByRole('heading', { name: '¡Constancia enviada!', exact: true }),
  ).not.toBeVisible();
});
