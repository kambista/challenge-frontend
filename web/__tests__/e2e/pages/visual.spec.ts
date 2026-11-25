import { test, expect, type Page, type TestInfo } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';
import { mockExchange, login, fillProfile, select } from '../support/helpers';
async function capture(
  page: Page,
  info: TestInfo,
  name: string,
  reference: string,
  mobile: boolean,
) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  const metadata = await sharp(path.resolve('.design-reference', reference)).metadata();
  if (!mobile) await page.setViewportSize({ width: metadata.width!, height: metadata.height! });
  await expect(page.locator('img').filter({ visible: true })).not.toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator('img:visible')
        .evaluateAll((images) =>
          images
            .filter(
              (img) =>
                !(img as HTMLImageElement).complete || !(img as HTMLImageElement).naturalWidth,
            )
            .map((img) => (img as HTMLImageElement).src),
        ),
    )
    .toEqual([]);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  const root = path.resolve('.cache/visual', info.project.name);
  await fs.mkdir(root, { recursive: true });
  const actual = await page.screenshot({ animations: 'disabled' });
  await fs.writeFile(path.join(root, name + '.png'), actual);
  const actualMeta = await sharp(actual).metadata();
  const referenceImage = sharp(path.resolve('.design-reference', reference));
  const expected = await referenceImage
    .extract({
      left: 0,
      top: mobile ? 44 : 0,
      width: actualMeta.width!,
      height: Math.min(actualMeta.height!, metadata.height! - (mobile ? 64 : 0)),
    })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const compareHeight = Math.min(actualMeta.height!, metadata.height! - (mobile ? 64 : 0));
  const pixels = await sharp(actual)
    .extract({ left: 0, top: 0, width: actualMeta.width!, height: compareHeight })
    .ensureAlpha()
    .raw()
    .toBuffer();
  const diff = Buffer.alloc(pixels.length);
  const count = pixelmatch(expected, pixels, diff, actualMeta.width!, compareHeight, {
    threshold: 0.12,
    includeAA: false,
  });
  await sharp(diff, { raw: { width: actualMeta.width!, height: compareHeight, channels: 4 } })
    .png()
    .toFile(path.join(root, name + '-diff.png'));
  const result = {
    name,
    reference,
    width: actualMeta.width,
    height: compareHeight,
    differentPixels: count,
    differenceRatio: count / (actualMeta.width! * compareHeight),
    note: 'Raw comparison includes requested business copy and changing amounts; original reference unchanged.',
  };
  await fs.writeFile(path.join(root, name + '.json'), JSON.stringify(result, null, 2));
  await info.attach(name, { body: actual, contentType: 'image/png' });
}
test('capturas de todas las pantallas y overlays', async ({ page }, info) => {
  test.setTimeout(120000);
  const mobile = info.project.name === 'mobile';
  await mockExchange(page);
  await page.goto('/');
  await expect(page.getByLabel('Correo electrónico', { exact: true })).toBeVisible();
  await capture(page, info, 'login', mobile ? 'Login-1.png' : 'Login-2.png', mobile);
  await login(page);
  await capture(page, info, 'profile', mobile ? 'Completar datos-4.png' : 'Empecemos.png', mobile);
  await fillProfile(page);
  await page.getByRole('link', { name: 'Términos y condiciones', exact: true }).click();
  await page.screenshot({ path: path.resolve('.cache/visual', info.project.name, 'terms.png') });
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(page.getByRole('heading', { name: /¡Felicitaciones/ })).toBeVisible();
  await capture(
    page,
    info,
    'profile-success',
    mobile ? 'Completa tus datos/página de éxito-1.png' : 'Empecemos-4.png',
    mobile,
  );
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true })).toBeEnabled();
  await capture(
    page,
    info,
    'quote',
    mobile ? 'Inicio/calculadora-1.png' : 'Bancos en Home.png',
    mobile,
  );
  await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('100');
  await expect(page.getByTestId('received')).toHaveText('342.80');
  await page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true }).click();
  await capture(
    page,
    info,
    'details',
    mobile ? 'Transacción/Completa los datos-5.png' : 'Completa datos de op/Desketop.png',
    mobile,
  );
  await page
    .getByRole('button', { name: '¿En qué cuenta deseas recibir tu dinero?', exact: true })
    .click();
  await page.getByRole('button', { name: 'Agregar cuenta', exact: true }).click();
  await capture(
    page,
    info,
    'drawer',
    mobile ? 'Transacción/crear cuenta-1.png' : 'Crear cuenta.png',
    mobile,
  );
  await select(page, 'Banco', 'BCP');
  await page.getByLabel('Número de cuenta', { exact: true }).fill('001234567890');
  await page.getByLabel('Ponle nombre a tu cuenta', { exact: true }).fill('Mi BCP');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'AGREGAR Y USAR', exact: true }).click();
  await page
    .getByRole('button', { name: '¿En qué cuenta deseas recibir tu dinero?', exact: true })
    .click();
  await capture(
    page,
    info,
    'accounts',
    mobile ? 'Transacción/cuenta destino.png' : 'Cuentas destino guardadas/Desketop.png',
    mobile,
  );
  await page.getByRole('button', { name: /Mi BCP - PEN/ }).click();
  await select(page, '¿Desde qué banco nos envías tu dinero?', 'Interbank');
  await select(page, 'Origen de fondos', 'Ahorros');
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await capture(
    page,
    info,
    'transfer',
    mobile ? 'Transfiere/validar datos-1.png' : 'Transfiere/validar datos-2.png',
    mobile,
  );
  await page.getByRole('button', { name: 'YA HICE MI TRANSFERENCIA', exact: true }).click();
  await capture(
    page,
    info,
    'voucher',
    mobile ? 'Subir constancia-1.png' : 'Subir constancia-2.png',
    mobile,
  );
  await page.getByLabel('Constancia de transferencia', { exact: true }).setInputFiles({
    name: 'constancia.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('demo'),
  });
  await page.getByRole('button', { name: 'ENVIAR CONSTANCIA', exact: true }).click();
  await capture(
    page,
    info,
    'success',
    mobile ? 'Constancia enviada-1.png' : 'Constancia enviada-2.png',
    mobile,
  );
});
