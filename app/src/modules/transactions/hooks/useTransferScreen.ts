import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";

export function useTransferScreen() {
  const router = useRouter();
  const operation = useOperationStore((state) => state.activeOperation);
  const confirmTransfer = useOperationStore((state) => state.confirmTransfer);
  const [copiedField, setCopiedField] = useState("");
  const [copyError, setCopyError] = useState("");

  function handleConfirmTransfer() {
    confirmTransfer();
    router.push("/operation/voucher");
  }

  async function handleCopy(label: string, value: string) {
    setCopyError("");
    setCopiedField("");
    try {
      const copied = await Clipboard.setStringAsync(value);
      if (!copied) throw new Error("No pudimos copiar el dato seleccionado.");
      setCopiedField(label);
    } catch (error) {
      setCopyError(
        error instanceof Error
          ? error.message
          : "No pudimos copiar el dato seleccionado.",
      );
    }
  }

  function handleReturnToHome() {
    router.replace("/(main)");
  }

  function handleReturnToDetails() {
    router.dismissTo("/operation/details");
  }
  
  return {
    operation,
    copiedField,
    copyError,
    handleConfirmTransfer,
    handleCopy,
    handleReturnToHome,
    handleReturnToDetails,
  };
}
