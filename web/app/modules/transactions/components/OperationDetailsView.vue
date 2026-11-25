<script setup lang="ts">
import FlowHeader from '~/shared/components/FlowHeader.vue';
import UiButton from '~/shared/components/UiButton.vue';
import UiSelect from '~/shared/components/UiSelect.vue';
import UiNotice from '~/shared/components/UiNotice.vue';
import AccountPicker from './AccountPicker.vue';
import { BANK_OPTIONS, FUND_OPTIONS } from '../constants/options';
import { formatMoney } from '../utils/money';
import { useOperationDetails } from '../composables/useOperationDetails';

const { quote, bankId, bankAttrs, destinationAccountId, sourceFundsId, sourceAttrs, errors, next } =
  useOperationDetails();
</script>

<template>
  <FlowHeader :step="1" back="/inicio" />
  <main v-if="quote" class="mx-auto max-w-146 px-8 pt-7 pb-14 md:px-6 md:pt-8">
    <h1
      class="mb-5 text-center text-xl leading-6 font-bold md:mb-10 md:text-2xl md:whitespace-nowrap"
    >
      Completa los datos de tu operación
    </h1>
    <div class="mx-auto max-w-102.5 space-y-3">
      <section class="rounded-control bg-white px-6 py-4 text-sm">
        <dl class="space-y-2.5">
          <div class="flex justify-between gap-3">
            <dt>Tú envías</dt>
            <dd class="font-bold">{{ formatMoney(quote.amount, quote.origin) }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt>Tú recibes</dt>
            <dd class="font-bold">{{ formatMoney(quote.exchange, quote.destination) }}</dd>
          </div>
          <div class="flex justify-between gap-3">
            <dt>Ahorro estimado</dt>
            <dd class="font-bold">
              {{ quote.savings !== null ? formatMoney(quote.savings, quote.destination) : '—' }}
            </dd>
          </div>
          <div class="border-gray-25 flex justify-between gap-3 border-t pt-3 text-xs">
            <dt class="font-bold">
              Tipo de cambio utilizado ({{ quote.origin === 'USD' ? 'bid' : 'ask' }})
            </dt>
            <dd class="font-bold">{{ quote.rate.toFixed(3) }}</dd>
          </div>
        </dl>
      </section>
      <UiNotice>
        Tiempo estimado de espera
        <strong>BCP, Interbank, BanBif y Pichincha:</strong>
        15 minutos (Aplica para cualquier monto). Otros bancos 1 día útil.
      </UiNotice>
      <form class="space-y-3.5" novalidate @submit="next">
        <UiSelect
          v-model="bankId"
          v-bind="bankAttrs"
          label="¿Desde qué banco nos envías tu dinero?"
          :options="BANK_OPTIONS"
          :error="errors.bankId"
        />
        <AccountPicker
          v-model="destinationAccountId"
          :currency="quote.destination"
          :error="errors.destinationAccountId"
        />
        <UiNotice tone="warning">
          Recuerda que las cuentas deben estar a
          <strong>tu nombre.</strong>
          Kambista
          <strong>no transfiere a cuentas de terceros.</strong>
        </UiNotice>
        <UiSelect
          v-model="sourceFundsId"
          v-bind="sourceAttrs"
          label="Origen de fondos"
          :options="FUND_OPTIONS"
          :error="errors.sourceFundsId"
        />
        <UiButton type="submit" class="mt-4 md:mt-4">CONTINUAR</UiButton>
      </form>
    </div>
  </main>
</template>
