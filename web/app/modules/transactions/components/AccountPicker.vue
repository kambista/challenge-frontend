<script setup lang="ts">
import { computed, shallowRef, nextTick, watch } from 'vue';
import UiDialog from '~/shared/components/UiDialog.vue';
import UiIcon from '~/shared/components/UiIcon.vue';
import BankAccountDrawer from './BankAccountDrawer.vue';
import { useBankAccounts } from '../composables/useBankAccounts';
import { bankName } from '../constants/options';
import type { Currency } from '~/shared/constants/currencies';
import type { SavedAccount } from '../types/bankAccount.types';

const props = defineProps<{ currency: Currency; error?: string }>();
const model = defineModel<string>({ required: true });
const { accounts } = useBankAccounts();
const open = shallowRef(false);
const drawerOpen = shallowRef(false);

async function restoreAccountTriggerFocus(value: boolean, previous: boolean) {
  if (value || !previous) return;
  await nextTick();
  document.getElementById('account-trigger')?.focus();
}

watch(drawerOpen, restoreAccountTriggerFocus);

const options = computed(() =>
  accounts.value.filter((account) => account.currency === props.currency),
);

const selected = computed(() => options.value.find((account) => account.id === model.value));

function label(account: SavedAccount) {
  return account.alias || bankName(account.bankId);
}

async function create() {
  open.value = false;
  await nextTick();
  drawerOpen.value = true;
}

function created(account: SavedAccount) {
  model.value = account.id;
}

function selectAccount(account: SavedAccount) {
  model.value = account.id;
  open.value = false;
}
</script>

<template>
  <div>
    <label id="account-label" for="account-trigger" class="text-gray-60 mb-1.5 block text-sm">
      ¿En qué cuenta deseas recibir tu dinero?
    </label>
    <button
      id="account-trigger"
      type="button"
      aria-haspopup="dialog"
      aria-labelledby="account-label"
      :aria-invalid="!!error"
      class="rounded-control flex min-h-11 w-full items-center justify-between border bg-white px-4 py-2.5 text-left text-sm"
      :class="error ? 'border-danger' : 'border-gray-25'"
      @click="open = true"
    >
      <span :class="selected ? '' : 'text-gray-40'">
        {{ selected ? label(selected) : 'Selecciona' }}
      </span>
      <UiIcon name="chevron-down" :size="18" />
    </button>
    <p v-if="error" role="alert" class="text-danger mt-1 text-xs">{{ error }}</p>
    <UiDialog
      v-model="open"
      account-picker
      :title="'Cuentas ' + (currency === 'PEN' ? 'Soles' : 'Dólares')"
      subtitle="Selecciona tu cuenta de destino"
    >
      <div class="max-h-[55dvh] overflow-y-auto">
        <p v-if="!options.length" class="text-gray-60 px-8 py-6 text-sm">
          Aún no tienes cuentas en {{ currency === 'PEN' ? 'soles' : 'dólares' }}.
        </p>
        <button
          v-for="account in options"
          :key="account.id"
          type="button"
          class="border-gray-21 hover:bg-gray-25 block w-full border-b px-8 py-4 text-left"
          :class="account.id === model ? 'bg-gray-25' : ''"
          @click="selectAccount(account)"
        >
          <span class="block text-base font-medium">{{ label(account) }} - {{ currency }}</span>
          <span class="text-gray-60 text-sm">{{ account.accountNumber }}</span>
        </button>
      </div>
      <button
        type="button"
        aria-label="Agregar cuenta"
        class="flex w-full items-center gap-5 px-8 py-5 text-base font-medium"
        @click="create"
      >
        <span
          aria-hidden="true"
          class="border-secondary grid size-9 place-items-center rounded border-2 text-2xl"
        >
          +
        </span>
        Agregar cuenta
      </button>
    </UiDialog>
    <BankAccountDrawer v-model="drawerOpen" :currency="currency" @created="created" />
  </div>
</template>
