import { shallowRef } from 'vue';
import { voucherSchema } from '../schemas/operation.schema';
import { useOperationState } from './useOperationState';
export function useVoucher() {
  const { state } = useOperationState();
  const file = shallowRef<File>();
  const error = shallowRef('');
  function chooseFile(event: Event) {
    file.value = (event.target as HTMLInputElement).files?.[0];
    error.value = '';
    if (file.value) {
      const parsed = voucherSchema.safeParse({ file: file.value });
      if (!parsed.success) error.value = parsed.error.issues[0]?.message || 'Archivo inválido';
    }
  }
  async function submit() {
    const result = voucherSchema.safeParse({ file: file.value });
    if (!result.success) {
      error.value = result.error.issues[0]?.message || 'Selecciona tu constancia';
      return;
    }
    if (!state.value.quote?.transferred || state.value.quote.submitted) return;
    state.value.quote.submitted = true;
    await navigateTo('/operacion/exito');
  }
  return { file, error, chooseFile, submit };
}
