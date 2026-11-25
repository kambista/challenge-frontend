<script setup lang="ts">
import { shallowRef } from 'vue';
import BrandLogo from '~/shared/components/BrandLogo.vue';
import UiButton from '~/shared/components/UiButton.vue';
import UiSelect from '~/shared/components/UiSelect.vue';
import UiDialog from '~/shared/components/UiDialog.vue';
import UiPopover from '~/shared/components/UiPopover.vue';
import UiIcon from '~/shared/components/UiIcon.vue';
import WhatsappBadge from '~/shared/components/WhatsappBadge.vue';
import TransactionSidebar from './TransactionSidebar.vue';
import { useSession } from '~/shared/composables/useSession';
import { CURRENCY_OPTIONS, type Currency } from '~/shared/constants/currencies';
import { TRANSACTION_NAVIGATION } from '../constants/navigation';
import { formatMoney } from '../utils/money';
import { useOperation } from '../composables/useOperation';
const { session, signOut } = useSession();
const swapRotation = shallowRef(0);
const {
  draft,
  rates,
  received,
  destination,
  savings,
  isCalculating,
  isLoadingRates,
  quoteError,
  ratesError,
  retry,
  setOriginCurrency,
  setDestinationCurrency,
  setCurrencyPair,
  swapCurrencies,
  startOperation,
  canContinue,
} = useOperation();
function handleSwap() {
  swapRotation.value += 180;
  swapCurrencies();
}
const collapsed = shallowRef(false);
const mobileMenu = shallowRef(false);
const coupon = shallowRef('');
const originCurrencyOpen = shallowRef(false);
const destinationCurrencyOpen = shallowRef(false);
</script>

<template>
  <div class="bg-gray-10 min-h-dvh lg:pl-80" :class="collapsed ? 'lg:!pl-[106px]' : ''">
    <TransactionSidebar v-model:collapsed="collapsed" />
    <header
      class="lg:border-gray-25 lg:bg-gray-10 relative z-40 flex h-14 items-center justify-between gap-5 bg-white px-6 lg:mx-7 lg:h-[66px] lg:border-b lg:px-0">
      <BrandLogo class="lg:hidden" />
      <h1 class="hidden text-2xl font-bold lg:block">Inicio</h1>
      <p class="hidden text-sm leading-5 lg:block">
        Horario: Lunes a viernes 9:00 am a 7:00 pm
        <br />
        Sábados de 09:00 am a 2:00 pm
      </p>
      <div class="text-gray-60 hidden items-center gap-1 text-sm font-semibold lg:flex">
        Tienes
        <strong class="text-secondary">2500</strong>
        Koinks
        <img src="/images/figma/icons/koins-coin.png" alt="" class="size-5" />
      </div>
      <UiPopover align="right" class="hidden lg:block">
        <template #trigger="{ open, toggle }">
          <button
type="button" class="text-gray-60 flex items-center gap-2 text-sm font-medium" aria-haspopup="menu"
            :aria-expanded="open" @click="toggle">
            <img src="/images/figma/icons/profile.png" alt="" class="size-8" />
            {{ session.displayName }}
            <UiIcon name="chevron-down" :size="17" />
          </button>
        </template>
        <div role="menu" class="min-w-40">
          <button
type="button" role="menuitem" class="hover:bg-gray-20 w-full rounded px-3 py-3 text-left text-sm"
            @click="signOut">
            Cerrar sesión
          </button>
        </div>
      </UiPopover>
      <button type="button" aria-label="Abrir menú" class="lg:hidden" @click="mobileMenu = true">
        <UiIcon name="menu" :size="26" />
      </button>
    </header>
    <main class="mx-auto max-w-142 px-[25px] pt-[42px] pb-10 md:px-6 lg:pt-24">
      <section class="rounded-control bg-white">
        <div class="border-gray-21 grid h-[42px] grid-cols-2 border-b text-sm font-bold md:h-13 md:text-base">
          <button
type="button" class="rounded-tl-control"
            :class="draft.origin === 'USD' ? 'bg-secondary text-white' : 'text-gray-40'"
            @click="setCurrencyPair('USD', 'PEN')">
            Compra: {{ rates?.bid.toFixed(3) ?? '—' }}
          </button>
          <button
type="button" class="rounded-tr-control"
            :class="draft.origin === 'PEN' ? 'bg-secondary text-white' : 'text-gray-40'"
            @click="setCurrencyPair('PEN', 'USD')">
            Venta: {{ rates?.ask.toFixed(3) ?? '—' }}
          </button>
        </div>
        <div class="mx-auto max-w-[418px] p-3.5 pt-[30px] md:px-0 md:py-8">
          <div class="relative space-y-2.5 md:space-y-3.5">
            <div class="rounded-control bg-gray-25 flex">
              <label class="min-w-0 flex-1 p-3.5 text-sm leading-5 font-medium md:px-6 md:py-4">
                ¿Cuánto envías?
                <input
v-model.number="draft.amount" type="number" min="0.01" step="0.01"
                  class="block w-full bg-transparent text-xl leading-6 font-bold outline-none" />
              </label>
              <UiSelect
v-model:open="originCurrencyOpen" :model-value="draft.origin" :options="CURRENCY_OPTIONS"
                compact aria-label="Moneda que envías" class="w-28 shrink-0 md:w-40"
                @update:model-value="setOriginCurrency($event as Currency)" />
            </div>
            <button
v-if="!originCurrencyOpen && !destinationCurrencyOpen" type="button" aria-label="Invertir monedas"
              class="absolute top-[57px] right-[90px] z-10 grid size-9 place-items-center rounded-full bg-white md:top-[75px] md:right-[142px]"
              @click="handleSwap">
              <img
src="/images/figma/icons/currency-refresh.svg" alt=""
                class="size-6 object-contain transition-transform duration-500 motion-reduce:transition-none"
                style="transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)"
                :style="{ transform: `rotate(${swapRotation}deg)` }" />
            </button>
            <div class="rounded-control bg-gray-25 flex">
              <div class="min-w-0 flex-1 p-3.5 text-sm leading-5 font-medium md:px-6 md:py-4">
                Entonces recibes
                <strong data-testid="received" class="block truncate text-xl leading-6 font-bold">
                  {{ received !== null ? received.toFixed(2) : isCalculating ? '…' : '—' }}
                </strong>
              </div>
              <UiSelect
v-model:open="destinationCurrencyOpen" :model-value="destination" :options="CURRENCY_OPTIONS"
                compact aria-label="Moneda que recibes" class="w-28 shrink-0 md:w-40"
                @update:model-value="setDestinationCurrency($event as Currency)" />
            </div>
          </div>
          <div class="mt-2.5 flex justify-between text-sm leading-[17px] md:mt-4">
            <div>
              Ahorro estimado:
              <strong data-testid="savings" class="block">
                {{ savings !== null ? formatMoney(savings, destination) : '—' }}
              </strong>
            </div>
            <div class="text-right">
              Koinks
              <strong class="flex items-center gap-1">
                <UiIcon name="info" :size="16" />
                10,000
                <img src="/images/figma/icons/koins-coin.png" alt="" class="hidden size-5 md:block" />
              </strong>
            </div>
          </div>
          <div
            class="border-gray-25 mt-5 flex h-[46px] rounded-[12px] border shadow-[0_3px_4px_rgba(0,0,0,.3)] md:mt-7">
            <img
src="/images/figma/icons/coupon-tag.png" alt=""
              class="my-auto ml-2 hidden size-8 object-contain md:block" />
            <input
v-model="coupon" aria-label="Ingresa el cupón" placeholder="Ingresa el cupón"
              class="placeholder:text-gray-40 min-w-0 flex-1 px-2 text-center text-sm outline-none" />
            <button type="button" class="bg-secondary rounded-r-[12px] px-4 text-xs text-white">
              APLICAR
            </button>
          </div>
          <div
            class="flex items-center justify-center gap-3 pt-7 pb-1 text-xs leading-4 md:pt-10 md:pb-0 md:text-sm md:leading-5">
            <img src="/images/figma/icons/preferential-star.png" alt="" class="size-7 shrink-0 object-contain" />
            <p>
              ¿Monto mayor a $5.000 o S/18.000?
              <br />
              <strong>
                ¡Obtén un
                <u>Tipo de Cambio Preferencial!</u>
              </strong>
            </p>
          </div>
          <p v-if="quoteError || ratesError" role="alert" class="text-danger mt-3 text-center text-xs">
            {{ quoteError || ratesError }}
            <button type="button" class="font-semibold underline" @click="retry">Reintentar</button>
          </p>
          <p v-else-if="isLoadingRates" role="status" class="text-gray-60 mt-3 text-center text-xs">
            Consultando tipo de cambio…
          </p>
        </div>
      </section>
      <UiButton class="mt-4 md:mt-10" :disabled="!canContinue" @click="startOperation">
        INICIAR OPERACIÓN
      </UiButton>
    </main>
    <WhatsappBadge />
    <UiDialog v-model="mobileMenu" title="Menú">
      <nav class="space-y-3">
        <div v-for="item in TRANSACTION_NAVIGATION" :key="item.label" class="flex items-center gap-3 text-sm">
          <img :src="item.icon" alt="" class="size-8 object-contain" />
          {{ item.label }}
        </div>
        <button type="button" class="border-gray-25 w-full border-t py-3 text-left font-semibold" @click="signOut">
          Cerrar sesión
        </button>
      </nav>
    </UiDialog>
  </div>
</template>
