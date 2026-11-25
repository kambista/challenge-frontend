<script setup lang="ts">
import { watch } from 'vue';
import { useForm } from 'vee-validate';
import UiDialog from '~/shared/components/UiDialog.vue';
import UiField from '~/shared/components/UiField.vue';
import UiSelect from '~/shared/components/UiSelect.vue';
import UiCheckbox from '~/shared/components/UiCheckbox.vue';
import UiNotice from '~/shared/components/UiNotice.vue';
import UiButton from '~/shared/components/UiButton.vue';
import { bankAccountFormSchema } from '../schemas/bankAccount.schema';
import { useBankAccounts } from '../composables/useBankAccounts';
import { BANK_OPTIONS, ACCOUNT_TYPES } from '../constants/options';
import type { Currency } from '~/shared/constants/currencies';
import type { BankAccountFormValues, SavedAccount } from '../types/bankAccount.types';

const props = defineProps<{ currency: Currency }>();
const emit = defineEmits<{ created: [account: SavedAccount] }>();
const open = defineModel<boolean>({ required: true });
const { addAccount, storageError } = useBankAccounts();

const form = useForm<BankAccountFormValues>({
  validationSchema: bankAccountFormSchema,
  initialValues: {
    accountType: 'AHORRO',
    bankId: '',
    currency: props.currency,
    accountNumber: '',
    alias: '',
    owned: false,
  },
});

const [accountType, typeAttrs] = form.defineField('accountType');
const [bankId, bankAttrs] = form.defineField('bankId');
const [accountNumber, numberAttrs] = form.defineField('accountNumber');
const [alias, aliasAttrs] = form.defineField('alias');
const [owned] = form.defineField('owned');

function resetFormWhenOpened(value: boolean) {
  if (!value) return;
  form.resetForm({
    values: {
      accountType: 'AHORRO',
      bankId: '',
      currency: props.currency,
      accountNumber: '',
      alias: '',
      owned: false,
    },
  });
}

watch(open, resetFormWhenOpened);

function saveAccount(values: BankAccountFormValues) {
  const account = addAccount(values);
  if (!account) return;
  emit('created', account);
  open.value = false;
}

const save = form.handleSubmit(saveAccount);
</script>

<template>
  <UiDialog
    v-model="open"
    drawer
    :title="'Agregar cuenta - ' + (currency === 'PEN' ? 'Soles' : 'Dólares')"
  >
    <form
      class="grid gap-x-[14%] gap-y-5 px-5.5 pt-4 pb-8 md:grid-cols-2 md:px-12 md:pt-7"
      novalidate
      @submit="save"
    >
      <p class="text-base leading-5.5 md:col-span-2 md:max-w-105">
        La cuenta que registres
        <strong>debe estar a tu nombre</strong>
        (titular de este perfil en Kambista)
      </p>
      <div class="space-y-4 md:space-y-7">
        <UiSelect
          v-model="accountType"
          v-bind="typeAttrs"
          label="Tipo de cuenta"
          :options="ACCOUNT_TYPES"
          :error="form.errors.value.accountType"
        />
        <UiSelect
          v-model="bankId"
          v-bind="bankAttrs"
          label="Banco"
          :options="BANK_OPTIONS"
          :error="form.errors.value.bankId"
        />
        <UiNotice>
          Operamos en Lima con todos los bancos. Y en provincia con el BCP y cuentas digitales
          Interbank.
        </UiNotice>
        <div>
          <p class="text-gray-60 mb-2 text-sm">Moneda</p>
          <div class="grid grid-cols-2 gap-8">
            <button
              v-for="item in ['PEN', 'USD']"
              :key="item"
              type="button"
              :disabled="item !== currency"
              :aria-pressed="item === currency"
              class="rounded-control h-10 border text-xs"
              :class="
                item === currency
                  ? 'border-secondary bg-secondary text-white'
                  : 'border-gray-25 text-gray-25'
              "
            >
              {{ item === 'PEN' ? 'SOLES' : 'DÓLARES' }}
            </button>
          </div>
        </div>
      </div>
      <div class="space-y-4 md:space-y-7">
        <UiField
          v-model="accountNumber"
          v-bind="numberAttrs"
          label="Número de cuenta"
          placeholder="Escribe tu cuenta de destino"
          inputmode="numeric"
          :error="form.errors.value.accountNumber"
        />
        <UiField
          v-model="alias"
          v-bind="aliasAttrs"
          label="Ponle nombre a tu cuenta"
          placeholder="Escribe un alias"
          :error="form.errors.value.alias"
        />
        <div class="pt-2">
          <UiCheckbox v-model="owned" :error="form.errors.value.owned">
            Declaro que esta cuenta es mía y NO de un tercero
          </UiCheckbox>
          <p class="mt-1 ml-6 hidden text-xs md:block">
            *Es obligatorio que la cuenta esté a tu nombre para que el cambio sea exitoso
          </p>
        </div>
        <p v-if="storageError" role="alert" class="text-danger text-sm">{{ storageError }}</p>
        <UiButton
          type="submit"
          class="mt-4 md:mt-8"
          :disabled="!bankId && !accountNumber && !owned"
        >
          AGREGAR Y USAR
        </UiButton>
      </div>
    </form>
  </UiDialog>
</template>
