import { test, expect } from '@playwright/test';
import { mockExchange, onboard, details, select } from '../../../support/helpers';
test.beforeEach(async ({ page }) => {
  await mockExchange(page);
});
test('cuenta inválida, creación, persistencia y selección', async ({ page }) => {
  await onboard(page);
  await details(page);
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(
    page.getByText('Selecciona la cuenta donde recibirás el dinero', {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole('button', {
      name: '¿En qué cuenta deseas recibir tu dinero?',
      exact: true,
    })
    .click();
  await expect(page.getByText('Aún no tienes cuentas en soles.')).toBeVisible();
  await page.getByRole('button', { name: 'Agregar cuenta', exact: true }).click();
  await page.getByLabel('Número de cuenta', { exact: true }).fill('00-ab');
  await page.getByRole('button', { name: 'AGREGAR Y USAR', exact: true }).click();
  await expect(page.getByText('Ingresa un número de cuenta de solo dígitos')).toBeVisible();
  await expect(page.getByText('Debes declarar que la cuenta está a tu nombre')).toBeVisible();
  await select(page, 'Banco', 'BCP');
  await page.getByLabel('Número de cuenta', { exact: true }).fill('001234567890');
  await page.getByLabel('Ponle nombre a tu cuenta', { exact: true }).fill('Mi BCP');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'AGREGAR Y USAR', exact: true }).click();
  await expect(
    page.getByRole('button', {
      name: '¿En qué cuenta deseas recibir tu dinero?',
      exact: true,
    }),
  ).toContainText('Mi BCP');
  await page.reload();
  await page
    .getByRole('button', {
      name: '¿En qué cuenta deseas recibir tu dinero?',
      exact: true,
    })
    .click();
  await expect(page.getByRole('button', { name: /Mi BCP - PEN/ })).toContainText('001234567890');
  await page.getByRole('button', { name: /Mi BCP - PEN/ }).click();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('kambista.accounts.v1:demo@kambista.com') || '{}'),
  );
  expect(saved.version).toBe(1);
  expect(saved.accounts[0].accountNumber).toBe('001234567890');
});
