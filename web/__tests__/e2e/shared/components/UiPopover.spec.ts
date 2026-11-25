import { expect, test } from '@playwright/test';
import { details, mockExchange, onboard } from '../../support/helpers';

test('mantiene limpio el selector de moneda y abre los popovers hacia arriba si hace falta', async ({
  page,
}) => {
  await mockExchange(page);
  await onboard(page);

  const originSelect = page.getByRole('button', { name: 'Moneda que envías', exact: true });
  await originSelect.click();
  const currencyList = page.getByRole('listbox', { name: 'Moneda que envías' });
  const [currencyMenuBounds, currencyBounds] = await Promise.all([
    currencyList.locator('..').boundingBox(),
    originSelect.boundingBox(),
  ]);
  expect(currencyMenuBounds).not.toBeNull();
  expect(currencyBounds).not.toBeNull();
  expect(currencyMenuBounds!.y).toBeGreaterThanOrEqual(currencyBounds!.y + currencyBounds!.height);
  await expect(
    page.getByRole('button', { name: 'Invertir monedas', exact: true }),
  ).not.toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Invertir monedas', exact: true })).toBeVisible();

  await details(page);
  await page.setViewportSize({ width: 390, height: 460 });
  const fundsSelect = page.getByRole('button', { name: 'Origen de fondos', exact: true });
  await fundsSelect.scrollIntoViewIfNeeded();
  await fundsSelect.click();

  const listbox = page.getByRole('listbox', { name: 'Origen de fondos' });
  await expect(listbox).toBeVisible();
  const [popoverBounds, triggerBounds] = await Promise.all([
    listbox.locator('..').boundingBox(),
    fundsSelect.boundingBox(),
  ]);
  expect(popoverBounds).not.toBeNull();
  expect(triggerBounds).not.toBeNull();
  expect(popoverBounds!.y + popoverBounds!.height).toBeLessThan(triggerBounds!.y);
});
