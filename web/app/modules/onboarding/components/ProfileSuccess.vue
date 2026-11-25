<script setup lang="ts">
import UiButton from '~/shared/components/UiButton.vue';
import { useSession } from '~/shared/composables/useSession';
const { session } = useSession();
</script>

<template>
  <main
    class="mx-auto flex min-h-dvh w-full max-w-115 flex-col items-center justify-center px-6 py-8 text-center md:px-0 md:py-10"
  >
    <p class="mb-3 text-sm font-semibold md:hidden">Perfil creado con éxito</p>
    <img
      src="/images/figma/Completa-tus-datos-página-de-éxito-0.png"
      alt=""
      class="mx-auto mb-7 h-46 w-38 object-contain md:mb-8 md:h-51 md:w-35"
    />
    <h1 class="text-xl leading-6 font-bold md:text-2xl md:leading-7">
      ¡Felicitaciones {{ session.fullName.split(' ')[0] }}, tu perfil ha sido creado!
    </h1>
    <p class="text-gray-60 mx-auto mt-5 max-w-100 text-sm leading-5 md:mt-6 md:text-base">
      Ya puedes empezar a
      <em>Kambiar</em>
      con la mejor tasa del mercado
    </p>
    <UiButton class="mx-auto mt-10 w-full md:mt-12 md:max-w-85.5" @click="navigateTo('/inicio')">
      CONTINUAR
    </UiButton>
  </main>
</template>
