import { test, expect } from '@playwright/test';
import { mockExchange, onboard, details, addAccount, select } from '../../../support/helpers';
test.beforeEach(async ({ page }) => {
  await mockExchange(page);
});

test('una respuesta anterior no reemplaza la última cotización', async ({ page }) => {
  await onboard(page);
  let finishStale: () => void = () => {};
  const staleComplete = new Promise<void>((resolve) => {
    finishStale = resolve;
  });
  await page.route('**/v1/exchange/calculates?**', async (route) => {
    const amount = Number(new URL(route.request().url()).searchParams.get('amount'));
    if (amount === 100) await new Promise((resolve) => setTimeout(resolve, 700));
    try {
      await route.fulfill({
        json: { rate: 3.428, exchange: amount * 3.428, savings: { amount: '5.14' } },
      });
    } catch {
      /* The old request is expected to be aborted. */
    } finally {
      if (amount === 100) finishStale();
    }
  });
  await Promise.all([
    page.waitForRequest(
      (request) =>
        request.url().includes('/v1/exchange/calculates?') &&
        new URL(request.url()).searchParams.get('amount') === '100',
    ),
    page.getByLabel('¿Cuánto envías?', { exact: true }).fill('100'),
  ]);
  await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('200');
  await expect(page.getByTestId('received')).toHaveText('685.60');
  await staleComplete;
  await expect(page.getByTestId('received')).toHaveText('685.60');
});
test('solo permite elegir cuentas de la moneda receptora', async ({ page }) => {
  await onboard(page);
  await details(page);
  await addAccount(page, 'Mi cuenta soles');
  await page.getByRole('link', { name: 'Volver', exact: true }).click();
  await page.getByRole('button', { name: 'Invertir monedas', exact: true }).click();
  await expect(page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true }).click();
  await page
    .getByRole('button', { name: '¿En qué cuenta deseas recibir tu dinero?', exact: true })
    .click();
  await expect(page.getByText('Aún no tienes cuentas en dólares.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Mi cuenta soles - PEN/ })).not.toBeVisible();
  await page.getByRole('button', { name: 'Agregar cuenta', exact: true }).click();
  await select(page, 'Tipo de cuenta', 'Corriente');
  await select(page, 'Banco', 'Interbank');
  await page.getByLabel('Número de cuenta', { exact: true }).fill('002222222222');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'AGREGAR Y USAR', exact: true }).click();
  const store = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('kambista.accounts.v1:demo@kambista.com') || '{}'),
  );
  expect(store.accounts.map((account: { currency: string }) => account.currency)).toEqual([
    'PEN',
    'USD',
  ]);
  expect(store.accounts[1].accountType).toBe('CORRIENTE');
});
