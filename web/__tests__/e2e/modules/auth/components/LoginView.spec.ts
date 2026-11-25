import { test, expect } from '@playwright/test';
import { mockExchange } from '../../../support/helpers';
test.beforeEach(async ({ page }) => {
  await mockExchange(page);
});
test('credenciales y validación de login', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Correo electrónico', { exact: true })).toBeVisible();
  await page.getByLabel('Correo electrónico', { exact: true }).fill('correo-invalido');
  await page.getByLabel('Contraseña', { exact: true }).fill('incorrecta');
  await expect(
    page.getByText('Ingresa un correo electrónico válido', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Correo electrónico', { exact: true }).fill('demo@kambista.com');
  await page.getByRole('button', { name: /INICIA(?:R)? SESIÓN/, exact: true }).click();
  await expect(page.getByText('El correo o la contraseña no son correctos.')).toBeVisible();
  await expect(page.getByLabel('Contraseña', { exact: true })).toHaveValue('incorrecta');
  await page.getByLabel('Contraseña', { exact: true }).fill('');
  await page.getByLabel('Contraseña', { exact: true }).blur();
  await expect(page.getByText('Ingresa tu contraseña', { exact: true })).toBeVisible();
});
