import { useSession } from '~/shared/composables/useSession';
import { useOperationState } from '~/modules/transactions/composables/useOperationState';
import { resolveFlowRedirect } from './flow.rules';

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const { session } = useSession();
  const { state } = useOperationState();

  const redirectPath = resolveFlowRedirect({
    path: to.path,
    authenticated: session.value.authenticated,
    profileCompleted: session.value.profileCompleted,
    hasPendingQuote: Boolean(state.value.pendingQuote),
    hasQuote: Boolean(state.value.quote),
    isTransferred: Boolean(state.value.quote?.transferred),
    isSubmitted: Boolean(state.value.quote?.submitted),
  });

  if (redirectPath) return navigateTo(redirectPath);
});
