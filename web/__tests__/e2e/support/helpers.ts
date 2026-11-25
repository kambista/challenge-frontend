import { expect, type Page } from '@playwright/test';
export const credentials = { email: 'demo@kambista.com', password: 'Demo1234!' };
export async function mockExchange(page: Page) {
  await page.route('**/v1/exchange/kambista/current', (route) =>
    route.fulfill({ json: { bid: 3.428, ask: 3.467 } }),
  );
  await page.route('**/v1/exchange/calculates?**', (route) => {
    const url = new URL(route.request().url());
    const usd = url.searchParams.get('originCurrency') === 'USD';
    const amount = Number(url.searchParams.get('amount'));
    const exchange = usd ? amount * 3.428 : amount / 3.467;
    return route.fulfill({
      json: {
        rate: usd ? 3.428 : 3.467,
        exchange: Number(exchange.toFixed(2)),
        savings: { amount: '5.14', currency: usd ? 'S/' : '$' },
      },
    });
  });
}
export async function login(page: Page) {
  await page.goto('/');
  await expect(page.getByLabel('Correo electrónico', { exact: true })).toBeVisible();
  await page.getByLabel('Correo electrónico', { exact: true }).fill(credentials.email);
  await page.getByLabel('Contraseña', { exact: true }).fill(credentials.password);
  await page.getByRole('button', { name: /INICIA(?:R)? SESIÓN/, exact: true }).click();
  await expect(page).toHaveURL(/\/registro$/);
}
export async function fillProfile(
  page: Page,
  overrides: { document?: string; phone?: string } = {},
) {
  await page.getByLabel('Nombres completos', { exact: true }).fill('María López');
  await page.getByLabel('N° de documento', { exact: true }).fill(overrides.document || '87654321');
  await page.getByLabel('Celular', { exact: true }).fill(overrides.phone || '987654321');
  await page.getByLabel('Fecha de nacimiento', { exact: true }).fill('1990-06-15');
  await page.getByRole('checkbox').first().check();
}
export async function onboard(page: Page) {
  await login(page);
  await fillProfile(page);
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(page).toHaveURL(/\/registro\/exito$/);
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(page).toHaveURL(/\/inicio$/);
  await expect(page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true })).toBeEnabled();
}
export async function select(page: Page, label: string, option: string) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}
export async function details(page: Page) {
  await page.getByLabel('¿Cuánto envías?', { exact: true }).fill('100');
  await expect(page.getByTestId('received')).toHaveText('342.80');
  await page.getByRole('button', { name: 'INICIAR OPERACIÓN', exact: true }).click();
  await expect(page).toHaveURL(/\/operacion$/);
}
export async function addAccount(page: Page, name = 'Mi BCP') {
  await page
    .getByRole('button', { name: '¿En qué cuenta deseas recibir tu dinero?', exact: true })
    .click();
  await page.getByRole('button', { name: 'Agregar cuenta', exact: true }).click();
  await select(page, 'Banco', 'BCP');
  await page.getByLabel('Número de cuenta', { exact: true }).fill('001234567890');
  await page.getByLabel('Ponle nombre a tu cuenta', { exact: true }).fill(name);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'AGREGAR Y USAR', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
}
export async function createOperation(page: Page) {
  await details(page);
  await select(page, '¿Desde qué banco nos envías tu dinero?', 'Interbank');
  await addAccount(page);
  await select(page, 'Origen de fondos', 'Ahorros');
  await page.getByRole('button', { name: 'CONTINUAR', exact: true }).click();
  await expect(page).toHaveURL(/\/operacion\/transferencia$/);
}
