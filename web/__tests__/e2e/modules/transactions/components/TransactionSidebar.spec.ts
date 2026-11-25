import { expect, test } from '@playwright/test';
import { mockExchange, onboard } from '../../../support/helpers';

test('mantiene el sidebar fijo y revela sus etiquetas sin recortarlas', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  await mockExchange(page);
  await onboard(page);

  const sidebar = page.getByRole('navigation', { name: 'Navegación principal' });
  const label = sidebar.getByText('Historial de operaciones', { exact: true });
  const labelReveal = label.locator('..');

  await page.getByRole('button', { name: 'Contraer menú lateral', exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(
    page.getByRole('button', { name: 'Expandir menú lateral', exact: true }),
  ).toBeInViewport();
  await expect(label).not.toBeVisible();

  await page.getByRole('button', { name: 'Expandir menú lateral', exact: true }).click();
  await page.waitForTimeout(50);
  const opacityDuringExpansion = Number(
    await labelReveal.evaluate((element) => getComputedStyle(element).opacity),
  );
  expect(opacityDuringExpansion).toBeLessThan(1);
  await expect(label).toBeVisible();
  await expect(labelReveal).toHaveCSS('opacity', '1');

  await page.getByRole('button', { name: 'MARÍA', exact: true }).click();
  await expect(page.getByRole('menuitem', { name: 'Cerrar sesión', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
