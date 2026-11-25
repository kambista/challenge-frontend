<script setup lang="ts">
import FlowHeader from '~/shared/components/FlowHeader.vue';
import UiButton from '~/shared/components/UiButton.vue';
import { useOperationState } from '../composables/useOperationState';
import { formatMoney } from '../utils/money';

const { state, finishOperationAndGoHome } = useOperationState();
</script>

<template>
  <FlowHeader success />
  <main v-if="state.quote" class="mx-auto max-w-132 px-[38px] pt-12 pb-12 md:px-6 md:pt-9">
    <section
      class="rounded-control border-gray-21 border bg-white px-5 pt-6 pb-6 md:px-8 md:pt-8 md:pb-9"
    >
      <img
        src="/images/figma/Constancia-enviada-2-1.png"
        alt=""
        class="mx-auto mb-7 size-28 object-contain md:size-24"
      />
      <h1 class="mb-4 text-center text-xl font-bold md:mb-8">¡Constancia enviada!</h1>
      <dl class="space-y-2 text-sm md:space-y-4">
        <div class="flex flex-col justify-between gap-1 md:flex-row">
          <dt class="text-gray-60 font-bold">Código Kambista</dt>
          <dd class="font-bold">{{ state.quote.code }}</dd>
        </div>
        <div>
          <p class="text-gray-60 text-xs">*Usa tu código para dar seguimiento a tu operación.</p>
        </div>
        <div class="flex flex-col justify-between gap-1 md:flex-row">
          <dt class="text-gray-60 font-bold">Monto a recibir</dt>
          <dd class="font-bold">
            {{ formatMoney(state.quote.exchange, state.quote.destination) }}
          </dd>
        </div>
        <div class="flex flex-col justify-between gap-1 md:flex-row">
          <dt class="text-gray-60 font-bold">Tiempo estimado de espera</dt>
          <dd class="font-bold">20h 15min</dd>
        </div>
      </dl>
    </section>
    <div
      class="rounded-control relative mt-3 flex h-21 items-center justify-center overflow-hidden bg-linear-to-r from-[#c891d7] via-[#e9a1b5] to-[#ffc07f] px-14 text-center text-xs leading-5 font-bold md:mt-7 md:text-sm"
    >
      <img
        src="/images/figma/Constancia-enviada-2-3.png"
        alt=""
        class="absolute -bottom-3 -left-2 size-[78px] object-contain"
      />
      <p>
        Disfruta de
        <span class="rounded-full bg-[#f2c641] px-2 py-1">descuentos</span>
        <br />
        en los mejores comercios
      </p>
      <img
        src="/images/figma/Constancia-enviada-2-2.png"
        alt=""
        class="absolute -right-2 -bottom-2 size-[72px] object-contain"
      />
    </div>
    <p class="mt-5 mb-8 text-center text-sm leading-5 md:mt-8">
      Verificaremos tu operación. Puedes ver su estado en “Mis operaciones”.
    </p>
    <UiButton @click="finishOperationAndGoHome">VOLVER A INICIO</UiButton>
  </main>
</template>
