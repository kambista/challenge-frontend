import { useSession } from '~/shared/composables/useSession';
import { watch } from 'vue';
import { useOperationState } from '~/modules/transactions/composables/useOperationState';
import { SESSION_KEY, OPERATION_KEY } from '~/shared/constants/storage';

function initializeSessionPersistence() {
  const { session } = useSession();
  const { state } = useOperationState();

  function persistSession(value: typeof session.value) {
    try {
      if (value) sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    } catch {
      /* Keep in-memory state. */
    }
  }

  function persistOperation(value: typeof state.value) {
    try {
      if (value) sessionStorage.setItem(OPERATION_KEY, JSON.stringify(value));
    } catch {
      /* Keep in-memory state. */
    }
  }

  watch(session, persistSession, { deep: true, flush: 'sync' });
  watch(state, persistOperation, { deep: true, flush: 'sync' });
}

export default defineNuxtPlugin(initializeSessionPersistence);
