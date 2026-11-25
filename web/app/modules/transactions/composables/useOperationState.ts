import { OPERATION_KEY } from '~/shared/constants/storage';
import { operationStateSchema } from '../schemas/operation.schema';
import type { OperationState } from '../types/operation.types';

export function useOperationState() {
  const state = useState<OperationState>('operation-state', () => ({
    quote: null,
    pendingQuote: null,
  }));
  const initialized = useState('operation-initialized', () => false);

  if (import.meta.client && !initialized.value) {
    try {
      const parsed = operationStateSchema.safeParse(
        JSON.parse(sessionStorage.getItem(OPERATION_KEY) || 'null'),
      );
      if (parsed.success) state.value = parsed.data;
    } catch {
      /* Ignore invalid demo state. */
    }
    initialized.value = true;
  }

  function resetOperation() {
    state.value = { quote: null, pendingQuote: null };
  }

  async function finishOperationAndGoHome() {
    resetOperation();
    await navigateTo('/inicio');
  }

  return { state, resetOperation, finishOperationAndGoHome };
}
