import { test, expect } from '@playwright/test';
import { mockExchange, onboard, select } from '../../../support/helpers';
test.beforeEach(async ({ page }) => {
  await mockExchange(page);
});
test('selectores, inversión, tabs, ahorro cero y cancelaciones', async ({ page }) => {
  await onboard(page);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('100');
  await expect(page.getByTestId('received')).toHaveText('342.80');
  await expect(page.getByTestId('savings')).toContainText('5.14');
  await select(page, 'Moneda que envías', 'Soles');
  await expect(page.getByTestId('received')).toHaveText('28.84');
  await expect(page.getByRole('button', { name: 'Moneda que recibes', exact: true })).toContainText(
    'Dólares',
  );
  await select(page, 'Moneda que recibes', 'Soles');
  await expect(page.getByTestId('received')).toHaveText('342.80');
  await page.getByRole('button', { name: 'Invertir monedas', exact: true }).click();
  await expect(page.getByTestId('received')).toHaveText('28.84');
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: /^Compra:/ }).click();
    await page.getByRole('button', { name: /^Venta:/ }).click();
  }
  await expect(page.getByTestId('received')).toHaveText('28.84');
  await page.route('**/v1/exchange/calculates?**', (route) =>
    route.fulfill({
      json: { rate: 3.467, exchange: 0, savings: { amount: '0' } },
    }),
  );
  await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('101');
  await expect(page.getByTestId('received')).toHaveText('0.00');
  await expect(page.getByTestId('savings')).toContainText('0.00');
  expect(errors).toEqual([]);
});
test('error de cálculo, reintento y monto inválido', async ({ page }) => {
  await onboard(page);
  await page.route('**/v1/exchange/calculates?**', (route) =>
    route.fulfill({
      status: 502,
      json: { message: 'Servicio temporalmente no disponible' },
    }),
  );
  await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('99');
  await expect(page.getByRole('alert')).toContainText('Servicio temporalmente no disponible');
  await expect(page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true })).toBeDisabled();
  await page.unroute('**/v1/exchange/calculates?**');
  await mockExchange(page);
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await expect(page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true })).toBeEnabled();
  await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('0');
  await expect(page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true })).toBeDisabled();
});
