<script setup lang="ts">
import { shallowRef } from 'vue';
import UiField from '~/shared/components/UiField.vue';
import UiButton from '~/shared/components/UiButton.vue';
import UiDialog from '~/shared/components/UiDialog.vue';
import BrandLogo from '~/shared/components/BrandLogo.vue';
import { useLoginForm } from '../composables/useLoginForm';
import { AUTH_FEATURES } from '../constants/features';

const { email, emailAttrs, password, passwordAttrs, errors, isSubmitting, onSubmit, serviceError } =
  useLoginForm();

const help = shallowRef(false);
</script>

<template>
  <main class="bg-gray-20 grid min-h-dvh md:grid-cols-2">
    <section
      class="from-login-bottom to-login-top hidden flex-col justify-center bg-linear-to-tr px-[12.2%] text-white md:flex"
    >
      <BrandLogo light class="mx-auto mb-20 w-77!" />
      <div class="space-y-15">
        <div v-for="feature in AUTH_FEATURES" :key="feature.title" class="flex items-start gap-7">
          <img :src="feature.image" alt="" class="h-16 w-17.5 shrink-0 object-contain" />
          <div>
            <h2 class="mb-2 text-xl font-bold">{{ feature.title }}</h2>
            <p class="text-sm leading-4.75 font-semibold">
              {{ feature.textPrefix }}
              <span class="text-primary">{{ feature.highlight1 }}</span>
              <template v-if="feature.textMiddle">
                {{ feature.textMiddle }}
                <span class="text-primary">{{ feature.highlight2 }}</span>
              </template>
              {{ feature.textSuffix }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="px-6 pt-31.25 pb-12 md:flex md:items-center md:justify-center md:p-12">
      <div class="mx-auto w-full max-w-85.5">
        <BrandLogo class="mx-auto mb-12 w-35! md:hidden" />
        <h1
          class="mb-17.5 text-center text-2xl font-normal md:mb-8 md:text-left md:text-[28px] md:font-bold"
        >
          Inicia sesión
        </h1>
        <form novalidate @submit="onSubmit">
          <div class="space-y-5">
            <UiField
              v-model="email"
              v-bind="emailAttrs"
              label="Correo electrónico"
              type="email"
              autocomplete="username"
              placeholder="Escribe tu correo"
              :error="errors.email"
            />
            <UiField
              v-model="password"
              v-bind="passwordAttrs"
              label="Contraseña"
              type="password"
              autocomplete="current-password"
              placeholder="Escribe tu contraseña"
              :error="errors.password"
            />
          </div>
          <button
            type="button"
            class="text-gray-60 mx-auto mt-5 block text-xs underline"
            @click="help = true"
          >
            ¿Olvidaste tu contraseña?
          </button>
          <p v-if="serviceError" role="alert" class="text-danger mt-3 text-center text-xs">
            {{ serviceError }}
          </p>
          <UiButton type="submit" class="mt-8 w-full" :disabled="isSubmitting">
            INICIAR SESIÓN
          </UiButton>
        </form>
      </div>
    </section>
    <UiDialog v-model="help" title="¿Necesitas ayuda?">
      <p class="text-gray-60 text-sm leading-5">
        Si olvidaste tu contraseña o tienes problemas para ingresar, comunícate con soporte de
        Kambista al correo soporte@kambista.com o vía WhatsApp.
      </p>
    </UiDialog>
  </main>
</template>
