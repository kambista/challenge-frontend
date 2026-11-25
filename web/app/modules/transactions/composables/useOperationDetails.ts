import { computed } from 'vue';
import { useForm } from 'vee-validate';
import { operationSchema } from '../schemas/operation.schema';
import type { OperationValues } from '../types/operation.types';
import { useOperationState } from './useOperationState';
import { useBankAccounts } from './useBankAccounts';
export function useOperationDetails() {
  const { state } = useOperationState();
  const { accounts } = useBankAccounts();
  const quote = computed(() => state.value.pendingQuote);
  const previous = state.value.quote;
  const form = useForm<OperationValues>({
    validationSchema: operationSchema,
    initialValues: {
      bankId: previous?.bankId || '',
      destinationAccountId: previous?.account.id || '',
      sourceFundsId: previous?.sourceFundsId || '',
    },
  });
  const [bankId, bankAttrs] = form.defineField('bankId');
  const [destinationAccountId] = form.defineField('destinationAccountId');
  const [sourceFundsId, sourceAttrs] = form.defineField('sourceFundsId');

  async function continueToTransfer(values: OperationValues) {
    if (!quote.value) {
      await navigateTo('/inicio');
      return;
    }

    const account = accounts.value.find(
      (item) =>
        item.id === values.destinationAccountId && item.currency === quote.value?.destination,
    );
    if (!account) {
      form.setFieldError(
        'destinationAccountId',
        'Selecciona una cuenta en la moneda que recibirás',
      );
      return;
    }

    state.value.quote = {
      ...quote.value,
      bankId: values.bankId,
      sourceFundsId: values.sourceFundsId,
      account: { ...account },
      code: 'km' + crypto.randomUUID().slice(0, 8),
      transferred: false,
      submitted: false,
    };
    await navigateTo('/operacion/transferencia');
  }

  const next = form.handleSubmit(continueToTransfer);

  return {
    quote,
    bankId,
    bankAttrs,
    destinationAccountId,
    sourceFundsId,
    sourceAttrs,
    errors: form.errors,
    next,
  };
}
