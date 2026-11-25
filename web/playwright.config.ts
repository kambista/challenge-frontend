import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './__tests__/e2e',
  timeout: 45000,
  expect: { timeout: 12000 },
  fullyParallel: true,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3100',
    channel: 'chrome',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'es-PE',
    timezoneId: 'America/Lima',
    reducedMotion: 'no-preference',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1012 } } },
    {
      name: 'mobile',
      use: {
        viewport: { width: 390, height: 780 },
        isMobile: true,
        hasTouch: true,
        deviceScaleFactor: 1,
      },
    },
  ],
  webServer: {
    command: 'node node_modules/nuxt/bin/nuxt.mjs dev --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: { NUXT_BUILD_DIR: '.cache/nuxt-e2e', NODE_ENV: 'development' },
  },
});
