import { shallowRef } from 'vue';
import { useOperationState } from './useOperationState';
export function useTransfer() {
  const { state } = useOperationState();
  const copied = shallowRef('');
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      copied.value = 'Copiado';
    } catch {
      copied.value = 'No se pudo copiar. Selecciona el dato y cópialo manualmente.';
    }
  }
  async function confirmTransfer() {
    if (!state.value.quote) return;
    state.value.quote.transferred = true;
    await navigateTo('/operacion/constancia');
  }
  return { state, copied, copy, confirmTransfer };
}
