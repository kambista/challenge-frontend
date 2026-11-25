import { test, expect } from '@playwright/test';
import { onboard } from '../../../support/helpers';
test('cotiza con las APIs reales directamente', async ({ page, request }, info) => {
  test.skip(
    process.env.RUN_LIVE_API !== '1' || info.project.name !== 'desktop',
    'Activar RUN_LIVE_API=1 para consultar el servicio externo.',
  );
  const current = await request.get('https://api.kambista.com/v1/exchange/kambista/current');
  expect(current.ok()).toBe(true);
  const rates = await current.json();
  expect(Number(rates.bid)).toBeGreaterThan(0);
  expect(Number(rates.ask)).toBeGreaterThan(0);
  for (const [origin, destination] of [
    ['USD', 'PEN'],
    ['PEN', 'USD'],
  ]) {
    const response = await request.get('https://api.kambista.com/v1/exchange/calculates', {
      params: {
        originCurrency: origin!,
        destinationCurrency: destination!,
        amount: 100,
        active: 'S',
      },
    });
    expect(response.ok()).toBe(true);
    const result = await response.json();
    expect(Number(result.exchange)).toBeGreaterThan(0);
    expect(Number.isFinite(Number(result.savings.amount))).toBe(true);
    await info.attach(origin + '-' + destination, {
      body: JSON.stringify(result, null, 2),
      contentType: 'application/json',
    });
  }
  await onboard(page);
  await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('100');
  await expect(page.getByTestId('received')).not.toHaveText('…');
  await expect(page.getByTestId('savings')).not.toHaveText('—');
  await expect(page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true })).toBeEnabled();
});
