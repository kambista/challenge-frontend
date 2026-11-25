import { test, expect } from '@playwright/test';
import { mockExchange, onboard, createOperation } from '../../../support/helpers';
test.beforeEach(async ({ page }) => {
  await mockExchange(page);
});
test('recorrido completo, constancias y cierre de sesión', async ({ page }, testInfo) => {
  await onboard(page);
  await createOperation(page);
  await expect(page.getByText('Interbank', { exact: true })).toBeVisible();
  await expect(page.getByText('US$ 100.00', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('US$ 100.00', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'YA HICE MI TRANSFERENCIA', exact: true }).click();
  await page.getByRole('button', { name: 'ENVIAR CONSTANCIA', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Selecciona tu constancia');
  const input = page.getByLabel('Constancia de transferencia', { exact: true });
  await input.setInputFiles({
    name: 'bad.exe',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('bad'),
  });
  await expect(page.getByRole('alert')).toContainText('imagen, PDF o Word');
  await input.setInputFiles({
    name: 'large.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
  });
  await expect(page.getByRole('alert')).toContainText('10 MB');
  for (const name of ['constancia.png', 'constancia.doc', 'constancia.docx', 'constancia.pdf']) {
    await input.setInputFiles({
      name,
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('demo'),
    });
    await expect(page.getByRole('alert')).not.toBeVisible();
  }
  await page.getByRole('button', { name: 'ENVIAR CONSTANCIA', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: '¡Constancia enviada!', exact: true }),
  ).toBeVisible();
  await expect(page.getByText('S/ 342.80', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'VOLVER A INICIO', exact: true }).click();
  if (testInfo.project.name === 'desktop')
    await page.getByRole('button', { name: 'MARÍA', exact: true }).click();
  else await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
  await page
    .getByRole(testInfo.project.name === 'desktop' ? 'menuitem' : 'button', {
      name: 'Cerrar sesión',
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/$/);
  expect(await page.evaluate(() => sessionStorage.getItem('kambista.operation.v1'))).toBeNull();
  expect(
    await page.evaluate(() => !!localStorage.getItem('kambista.accounts.v1:demo@kambista.com')),
  ).toBe(true);
});
