import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [vue({ template: { transformAssetUrls: false } })],
  define: { 'import.meta.client': true },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '@mocks': fileURLToPath(new URL('../mocks', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    maxWorkers: 2,
    include: ['__tests__/unit/**/*.spec.ts'],
    coverage: {
      include: ['app/**/*.{ts,vue}'],
      exclude: ['app/modules/transactions/components/TransactionSidebar.vue'],
    },
  },
});
