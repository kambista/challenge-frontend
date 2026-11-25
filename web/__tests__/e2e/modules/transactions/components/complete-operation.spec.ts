import { test, expect } from '@playwright/test';
import { mockExchange, onboard, select, addAccount } from '../../../support/helpers';

test.beforeEach(async ({ page }) => {
  await mockExchange(page);
});

for (const [origin, destination, received] of [
  ['USD', 'PEN', '342.80'],
  ['PEN', 'USD', '28.84'],
] as const) {
  test(
    'confirma ' + origin + ' → ' + destination + ' y bloquea la operación finalizada',
    async ({ page }) => {
      await onboard(page);
      if (origin === 'PEN')
        await page.getByRole('button', { name: 'Invertir monedas', exact: true }).click();
      await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('100');
      await expect(page.getByTestId('received')).toHaveText(received);
      await page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true }).click();
      await select(page, '¿Desde qué banco nos envías tu dinero?', 'Interbank');
      await select(page, 'Origen de fondos', 'Ahorros');
      const before = await page.evaluate(() => sessionStorage.getItem('kambista.operation.v1'));
      await addAccount(page, 'Destino ' + destination);
      await expect(
        page.getByRole('button', { name: '¿En qué cuenta deseas recibir tu dinero?', exact: true }),
      ).toContainText('Destino ' + destination);
      const pending = await page.evaluate(() => sessionStorage.getItem('kambista.operation.v1'));
      expect(pending).toBe(before);
      await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
      await expect(page).toHaveURL(/\/operacion\/transferencia$/);
      await page.getByRole('link', { name: 'Volver', exact: true }).click();
      await expect(
        page.getByRole('button', { name: '¿En qué cuenta deseas recibir tu dinero?', exact: true }),
      ).toContainText('Destino ' + destination);
      await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
      await page.getByRole('button', { name: 'YA HICE MI TRANSFERENCIA', exact: true }).click();
      await page.getByLabel('Constancia de transferencia', { exact: true }).setInputFiles({
        name: 'constancia.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.alloc(10 * 1024 * 1024),
      });
      await page.getByRole('button', { name: 'ENVIAR CONSTANCIA', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: '¡Constancia enviada!', exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText((destination === 'PEN' ? 'S/ ' : 'US$ ') + received, { exact: true }),
      ).toBeVisible();
      await page.getByRole('button', { name: 'VOLVER A INICIO', exact: true }).click();
      await page.goto('/operacion/exito');
      await expect(page).toHaveURL(/\/inicio$/);
      await expect(
        page.getByRole('heading', { name: '¡Constancia enviada!', exact: true }),
      ).not.toBeVisible();
    },
  );
}
