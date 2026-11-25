import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',
  routeRules: {
    '/registro': { ssr: false },
    '/registro/**': { ssr: false },
    '/inicio': { ssr: false },
    '/operacion': { ssr: false },
    '/operacion/**': { ssr: false },
  },
  alias: {
    '@mocks': fileURLToPath(new URL('../mocks/', import.meta.url)),
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/test-utils/module', '@pinia/nuxt'],
  imports: {
    presets: [
      {
        from: 'vee-validate',
        imports: ['useForm', 'useField', 'useFieldArray', 'useFormContext'],
      },
      {
        from: 'zod',
        imports: ['z'],
      },
    ],
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
