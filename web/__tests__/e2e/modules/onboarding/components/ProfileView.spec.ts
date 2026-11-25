import { test, expect } from '@playwright/test';
import { mockExchange, login, fillProfile, select } from '../../../support/helpers';
test.beforeEach(async ({ page }) => {
  await mockExchange(page);
});
test('valida perfil, consentimiento y contenido legal independiente', async ({ page }) => {
  await login(page);
  await page.getByLabel('Nombres completos', { exact: true }).fill('María123');
  await expect(page.getByText('Usa solo letras y espacios')).toBeVisible();
  await page.getByLabel('N° de documento', { exact: true }).fill('123');
  await expect(
    page.getByText('El documento no coincide con el formato seleccionado'),
  ).toBeVisible();
  await select(page, 'Documento', 'CE');
  await page.getByLabel('N° de documento', { exact: true }).fill('123456789');
  await expect(
    page.getByText('El documento no coincide con el formato seleccionado'),
  ).not.toBeVisible();
  await select(page, 'Documento', 'Pasaporte');
  await page.getByLabel('N° de documento', { exact: true }).fill('AB123456');
  await select(page, 'Documento', 'DNI');
  await fillProfile(page);
  await page.getByLabel('Celular', { exact: true }).fill('123');
  await expect(page.getByText('Ingresa un celular de 9 dígitos')).toBeVisible();
  await page.getByLabel('Celular', { exact: true }).fill('987654321');
  await page.getByLabel('Fecha de nacimiento', { exact: true }).fill('2020-01-01');
  await expect(page.getByText('Ingresa una fecha válida; debes ser mayor de edad')).toBeVisible();
  await page.getByLabel('Fecha de nacimiento', { exact: true }).fill('1990-06-15');
  await page.getByRole('checkbox').first().uncheck();
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(page.getByText('Acepta los términos para continuar')).toBeVisible();
  await page.getByRole('link', { name: 'Términos y condiciones', exact: true }).click();
  const legalDialog = page.getByRole('dialog', { name: 'Términos y condiciones', exact: true });
  await expect(legalDialog).toBeVisible();
  const openingAnimations = await legalDialog.evaluate((element) =>
    element.getAnimations().map((animation) => (animation as CSSAnimation).animationName),
  );
  expect(openingAnimations).toContain('ui-modal-enter');
  await page.keyboard.press('Escape');
  await expect(legalDialog).toHaveClass(/ui-dialog--closing/);
  const closingAnimations = await legalDialog.evaluate((element) =>
    element.getAnimations().map((animation) => (animation as CSSAnimation).animationName),
  );
  expect(closingAnimations).toContain('ui-modal-exit');
  await expect(page.getByRole('checkbox').first()).not.toBeChecked();
  await page
    .getByRole('link', {
      name: 'Política de Tratamiento de datos personales de Kambista',
      exact: true,
    })
    .click();
  await expect(
    page.getByText('El consentimiento de esta casilla es opcional', {
      exact: false,
    }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'ENTENDIDO', exact: true }).click();
  await page.getByRole('checkbox').first().check();
  await expect(page.getByRole('checkbox').nth(1)).not.toBeChecked();
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(page.getByRole('heading', { name: /¡Felicitaciones María/ })).toBeVisible();
});
for (const kind of ['DNI', 'PHONE'] as const)
  test('rechazo de registro ' + kind, async ({ page }) => {
    await login(page);
    await fillProfile(page, kind === 'DNI' ? { document: '12345678' } : { phone: '999999999' });
    await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
    await expect(
      page.getByRole('heading', {
        name: kind === 'DNI' ? 'DNI en uso' : 'Celular inválido',
      }),
    ).toBeVisible();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.getByRole('button', { name: 'Cerrar notificación', exact: true }).click();
    await expect(page).toHaveURL(/\/registro$/);
  });
