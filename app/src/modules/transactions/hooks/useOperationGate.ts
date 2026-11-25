import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import { OperationStep } from "@/modules/transactions/types/operation-gate.types";
import { useIsFocused, type Href } from "expo-router";

export function useOperationGate(step: OperationStep) {
  const isFocused = useIsFocused();
  const pending = useOperationStore((state) => state.pendingQuote);
  const operation = useOperationStore((state) => state.activeOperation);
  let redirect: Href | null = null;

  if (!pending) redirect = "/(main)";
  else if (step !== "details" && !operation) redirect = "/operation/details";
  else if (
    (step === "voucher" || step === "success") &&
    !operation?.transferred
  ) {
    redirect = "/operation/transfer";
  } else if (step === "success" && !operation?.submitted) {
    redirect = "/operation/voucher";
  }

  return { redirect, isFocused };
}
