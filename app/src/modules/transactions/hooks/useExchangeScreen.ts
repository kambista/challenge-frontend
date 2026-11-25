import { useAuthStore } from "@/modules/auth";
import { useExchangeQuote } from "@/modules/transactions/hooks/useExchangeQuote";
import { type QuoteFormValues } from "@/modules/transactions/schemas/quote.schema";
import { useAccountsStore } from "@/modules/transactions/stores/accounts.store";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useQuoteForm } from "./useQuoteForm";
import { useSessionMenu } from "./useSessionMenu";


export function useExchangeScreen() {
  const router = useRouter();
  const displayName = useAuthStore((state) => state.displayName);
  const startOperation = useOperationStore((state) => state.startOperation);
  const [couponInput, setCouponInput] = useState("");
  const [formError, setFormError] = useState("");
  const { menuOpen, handleOpenMenu, handleCloseMenu, handleSignOut } =
    useSessionMenu();
  const {
    swapAnimatedStyle,
    control,
    handleSubmit,
    formState,
    amount,
    origin,
    destination,
    handleSetPair,
    handleSwap,
  } = useQuoteForm();
  const {
    rates,
    calculation,
    isLoadingRates,
    isCalculating,
    ratesError,
    quoteError,
    retry,
  } = useExchangeQuote(amount, origin, destination);
  function handleBeginOperation(values: QuoteFormValues) {
    setFormError("");
    const started = startOperation({
      amount: Number(values.amount),
      origin: values.origin,
      destination: values.destination,
    });
    if (!started) {
      setFormError(
        "Espera a que terminemos de calcular tu cotización para continuar.",
      );
      return;
    }

    useAccountsStore.getState().clearLastCreatedAccount();
    router.push("/operation/details");
  }
  const onSubmit = handleSubmit(handleBeginOperation);
  const convertedAmount = calculation?.exchange.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const firstName = displayName ? displayName.trim().split(" ")[0] : "Kambista";
  return {
    couponInput,
    setCouponInput,
    formError,
    menuOpen,
    handleOpenMenu,
    handleCloseMenu,
    swapAnimatedStyle,
    control,
    formState,
    origin,
    destination,
    rates,
    calculation,
    isLoadingRates,
    isCalculating,
    ratesError,
    quoteError,
    retry,
    handleSetPair,
    handleSwap,
    handleSignOut,
    onSubmit,
    convertedAmount,
    firstName,
  };
}
