import { expect, test } from '@playwright/test';
import { details, mockExchange, onboard } from '../../../support/helpers';

test('abre el drawer de cuenta con una transición según el dispositivo', async ({
  page,
}, testInfo) => {
  await mockExchange(page);
  await onboard(page);
  await details(page);
  await page.setViewportSize({
    width: testInfo.project.name === 'desktop' ? 1440 : 390,
    height: 520,
  });
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await page
    .getByRole('button', { name: '¿En qué cuenta deseas recibir tu dinero?', exact: true })
    .click();
  await page.getByRole('button', { name: 'Agregar cuenta', exact: true }).click();

  const drawer = page.getByRole('dialog', { name: 'Agregar cuenta - Soles' });
  await expect(drawer).toBeVisible();
  const animations = await drawer.evaluate((element) =>
    element.getAnimations().map((animation) => (animation as CSSAnimation).animationName),
  );
  expect(animations).toContain(
    testInfo.project.name === 'desktop' ? 'ui-drawer-enter-desktop' : 'ui-drawer-enter-mobile',
  );

  await drawer.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(drawer).toHaveClass(/ui-dialog--closing/);
  const closeAnimations = await drawer.evaluate((element) =>
    element.getAnimations().map((animation) => (animation as CSSAnimation).animationName),
  );
  expect(closeAnimations).toContain(
    testInfo.project.name === 'desktop' ? 'ui-drawer-exit-desktop' : 'ui-drawer-exit-mobile',
  );
  await expect(drawer).toBeVisible();
  await expect(drawer).not.toBeVisible();
  const pageState = await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    return {
      overflow: document.documentElement.style.overflow,
      scrollY: window.scrollY,
    };
  });
  expect(pageState.overflow).not.toBe('hidden');
  expect(pageState.scrollY).toBeGreaterThan(0);
});
