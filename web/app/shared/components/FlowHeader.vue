<script setup lang="ts">
import BrandLogo from './BrandLogo.vue';
import UiIcon from './UiIcon.vue';
import { useSession } from '~/shared/composables/useSession';
defineProps<{ step?: number; back?: string; logout?: boolean; success?: boolean }>();
const { signOut } = useSession();
const steps = ['Completa', 'Transfiere', 'Envía constancia'];
const titles = [
  'Completa los datos de tu operación',
  'Transfiere a Kambista',
  'Envía tu constancia',
];
</script>

<template>
  <header
    class="bg-white px-5 md:px-10"
    :class="[step ? 'pb-2 md:pb-0' : '', success ? 'hidden md:block' : '']"
  >
    <div
      class="relative flex items-center justify-between gap-4"
      :class="step || success ? 'h-[49px] md:h-[104px]' : 'h-[49px] md:h-[91px]'"
    >
      <BrandLogo class="w-25! md:w-41!" />
      <h1 v-if="step" class="sr-only">{{ titles[step - 1] }}</h1>
      <ol
        v-if="step"
        aria-label="Progreso de la operación"
        class="absolute left-1/2 hidden w-[64%] max-w-215 -translate-x-1/2 justify-between md:flex"
      >
        <li
          v-for="(label, index) in steps"
          :key="label"
          class="relative flex-1 text-center text-xs font-semibold"
          :aria-current="step === index + 1 ? 'step' : undefined"
        >
          <span
            v-if="index < 2"
            class="absolute top-2 left-1/2 h-0.5 w-full"
            :class="step > index + 1 ? 'bg-secondary' : 'bg-gray-25'"
          />
          <span
            class="relative mx-auto mb-3 block size-[18px] rounded-full"
            :class="step >= index + 1 ? 'bg-secondary' : 'bg-gray-25'"
          />
          {{ label }}
        </li>
      </ol>
      <button
        v-if="logout"
        type="button"
        class="ml-auto flex items-center gap-2 text-xs font-semibold md:text-sm"
        @click="signOut"
      >
        Cerrar sesión
        <UiIcon name="logout" :size="20" />
      </button>
      <NuxtLink
        v-else-if="back"
        :to="back"
        class="ml-auto flex items-center gap-2 text-xs font-semibold md:gap-3 md:text-2xl md:font-bold"
      >
        <UiIcon name="chevron-left" :size="20" />
        Volver
      </NuxtLink>
    </div>
    <ol
      v-if="step"
      aria-label="Progreso de la operación"
      class="flex w-full justify-center pt-[13px] pb-1 md:hidden"
    >
      <li
        v-for="(label, index) in steps"
        :key="label"
        class="relative flex-1 text-center text-[10px] leading-3 font-semibold"
        :class="step < index + 1 ? 'text-gray-40' : ''"
        :aria-current="step === index + 1 ? 'step' : undefined"
      >
        <span
          v-if="index < 2"
          class="absolute top-1 left-1/2 h-px w-full"
          :class="step > index + 1 ? 'bg-secondary' : 'bg-gray-40'"
        />
        <span
          class="relative mx-auto mb-1.5 block size-2 rounded-full"
          :class="step >= index + 1 ? 'bg-secondary' : 'bg-gray-40'"
        />
        {{ label }}
      </li>
    </ol>
  </header>
</template>
