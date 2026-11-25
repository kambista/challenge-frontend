import { nextTick } from 'vue';
import { SESSION_KEY, OPERATION_KEY } from '../constants/storage';
import { sessionSchema, DEFAULT_SESSION, type DemoSession } from '../types/session.types';

export type { DemoSession };

export function useSession() {
  const session = useState<DemoSession>('demo-session', () => ({ ...DEFAULT_SESSION }));
  const initialized = useState('session-initialized', () => false);

  if (import.meta.client && !initialized.value) {
    try {
      const parsed = sessionSchema.safeParse(
        JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'),
      );
      if (parsed.success) session.value = parsed.data;
    } catch {
      /* A blocked store does not prevent a demo session. */
    }
    initialized.value = true;
  }

  function startSession(email: string) {
    session.value = {
      ...DEFAULT_SESSION,
      authenticated: true,
      email: email.toLowerCase(),
    };
  }

  function completeProfile(name: string) {
    session.value = {
      ...session.value,
      profileCompleted: true,
      fullName: name,
      displayName: name.trim().split(/\s+/)[0]?.toLocaleUpperCase('es-PE') || 'MARIA',
    };
  }

  async function signOut() {
    session.value = { ...DEFAULT_SESSION };
    await navigateTo('/');
    clearNuxtState(['operation-state', 'quote-draft', 'bank-accounts', 'accounts-owner']);
    await nextTick();
    try {
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(OPERATION_KEY);
    } catch {
      /* Storage may be unavailable. */
    }
  }

  return { session, startSession, completeProfile, signOut };
}
