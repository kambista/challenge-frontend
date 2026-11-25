import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import { useRouter } from "expo-router";

export function useOperationSuccessScreen() {
  const router = useRouter();
  const operation = useOperationStore((state) => state.activeOperation);
  const resetOperation = useOperationStore((state) => state.resetOperation);
  function handleReturnHome() {
    router.dismissTo("/(main)");
    resetOperation();
  }
  return { operation, handleReturnHome };
}
