import {
  operationSchema,
  type OperationFormValues,
} from "@/modules/transactions/schemas/operation.schema";
import { useAccountsStore } from "@/modules/transactions/stores/accounts.store";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecentDestinationAccount } from "./useRecentDestinationAccount";

export function useOperationDetailsScreen() {
  const router = useRouter();
  const quote = useOperationStore((state) => state.pendingQuote);
  const activeOperation = useOperationStore((state) => state.activeOperation);
  const configureOperation = useOperationStore(
    (state) => state.configureOperation,
  );
  const accounts = useAccountsStore((state) => state.accounts);
  const [formError, setFormError] = useState("");
  const eligibleAccounts = quote
    ? accounts.filter((account) => account.currency === quote.destination)
    : [];
  const { control, handleSubmit, setValue, setError, formState } =
    useForm<OperationFormValues>({
      resolver: yupResolver(operationSchema),
      mode: "onChange",
      defaultValues: {
        bankId: activeOperation?.bankId ?? "",
        destinationAccountId: activeOperation?.destinationAccount.id ?? "",
        sourceFundsId: activeOperation?.sourceFundsId ?? "",
      },
    });
  useRecentDestinationAccount(setValue);
  function handleAddDestinationAccount() {
    if (!quote) return;
    router.push(`/operation/add-account?currency=${quote.destination}`);
  }
  function handleReturnToQuote() {
    router.dismissTo("/(main)");
  }
  function handleContinueToTransfer(values: OperationFormValues) {
    setFormError("");
    if (!quote) {
      router.replace("/(main)");
      return;
    }

    const destinationAccount = eligibleAccounts.find(
      (account) => account.id === values.destinationAccountId,
    );
    if (!destinationAccount) {
      setError("destinationAccountId", {
        message: "Selecciona una cuenta en la moneda que recibirás",
      });
      return;
    }

    if (!configureOperation(values, destinationAccount)) {
      setFormError(
        "No pudimos preparar tu operación. Regresa al inicio y vuelve a cotizar.",
      );
      return;
    }
    router.push("/operation/transfer");
  }
  const onSubmit = handleSubmit(handleContinueToTransfer);
  return {
    quote,
    formError,
    eligibleAccounts,
    control,
    formState,
    handleAddDestinationAccount,
    handleReturnToQuote,
    onSubmit,
  };
}
