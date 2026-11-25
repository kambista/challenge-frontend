import { expect, test } from '@playwright/test';
import { login, mockExchange } from '../../support/helpers';

test('permite escoger una fecha en el calendario y escribirla manualmente', async ({ page }) => {
  await mockExchange(page);
  await login(page);

  const dateInput = page.getByLabel('Fecha de nacimiento', { exact: true });
  await dateInput.click();

  const calendar = page.getByRole('dialog', { name: 'Calendario de fecha de nacimiento' });
  await expect(calendar).toBeVisible();
  await expect(calendar).toBeInViewport();
  await calendar.getByLabel('Año', { exact: true }).selectOption('1990');
  await calendar.getByLabel('Mes', { exact: true }).selectOption('5');
  await calendar.getByRole('button', { name: /15 de junio de 1990/ }).click();
  await expect(dateInput).toHaveValue('15/06/1990');

  await dateInput.fill('1991-04-20');
  await dateInput.blur();
  await expect(dateInput).toHaveValue('20/04/1991');

  await page.setViewportSize({ width: 390, height: 460 });
  await dateInput.scrollIntoViewIfNeeded();
  await dateInput.click();
  await expect(calendar).toBeVisible();
  const [calendarBounds, inputBounds] = await Promise.all([
    calendar.boundingBox(),
    dateInput.boundingBox(),
  ]);
  expect(calendarBounds).not.toBeNull();
  expect(inputBounds).not.toBeNull();
  expect(calendarBounds!.width).toBeLessThanOrEqual(280);
  expect(await calendar.evaluate((element) => getComputedStyle(element).overflowY)).toBe('visible');
  expect(calendarBounds!.y + calendarBounds!.height).toBeLessThan(inputBounds!.y);
});
