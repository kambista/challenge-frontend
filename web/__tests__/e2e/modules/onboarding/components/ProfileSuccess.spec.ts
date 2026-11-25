import { expect, test } from '@playwright/test';
import { fillProfile, login, mockExchange } from '../../../support/helpers';

test('centra la confirmación del perfil sin scroll en escritorio', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  await page.setViewportSize({ width: 1680, height: 760 });
  await mockExchange(page);
  await login(page);
  await fillProfile(page);
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(page).toHaveURL(/\/registro\/exito$/);

  const layout = await page.evaluate(() => ({
    pageHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    scrollY: window.scrollY,
    contentTop: document.querySelector('main img')?.getBoundingClientRect().top,
    actionBottom: document.querySelector('main button')?.getBoundingClientRect().bottom,
  }));
  expect(layout.pageHeight).toBeLessThanOrEqual(layout.viewportHeight + 1);
  expect(layout.scrollY).toBe(0);
  expect(layout.contentTop).toBeGreaterThan(0);
  expect(layout.actionBottom).toBeLessThan(layout.viewportHeight);
});
