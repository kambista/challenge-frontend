import { calculateExchange } from "@/modules/transactions/services/exchange.service";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import type { Currency } from "@/shared/types/currency.types";
import { useEffect, useState } from "react";
import { useExchangeRates } from "./useExchangeRates";

export function useExchangeQuote(
  amount: string,
  origin: Currency,
  destination: Currency,
) {
  const calculation = useOperationStore((state) => state.calculation);
  const setCalculation = useOperationStore((state) => state.setCalculation);
  const [isCalculating, setIsCalculating] = useState(false);
  const [quoteError, setQuoteError] = useState("");
  const [retryVersion, setRetryVersion] = useState(0);
  const numericAmount = Number(amount);
  const { rates, isLoadingRates, ratesError, retry } =
    useExchangeRates(invalidateQuote);
  function invalidateQuote() {
    setRetryVersion((version) => version + 1);
  }

  useEffect(
    function calculateQuoteWhenInputsChange() {
      const controller = new AbortController();
      const isValidInput =
        Number.isFinite(numericAmount) &&
        numericAmount > 0 &&
        origin !== destination;

      // Reset request status through the scheduled request lifecycle.
      const statusTimer = setTimeout(function resetQuoteStatus() {
        setCalculation(null);
        setQuoteError("");
        setIsCalculating(isValidInput);
      }, 0);

      if (!isValidInput) {
        return function skipInvalidQuote() {
          clearTimeout(statusTimer);
          controller.abort();
        };
      }

      async function requestCalculation() {
        try {
          const result = await calculateExchange(
            numericAmount,
            origin,
            destination,
            controller.signal,
          );
          if (!controller.signal.aborted) {
            setCalculation({
              amount: numericAmount,
              origin,
              destination,
              ...result,
            });
          }
        } catch (error) {
          if (!controller.signal.aborted) {
            setQuoteError(
              error instanceof Error
                ? error.message
                : "No pudimos calcular la operación.",
            );
          }
        } finally {
          if (!controller.signal.aborted) setIsCalculating(false);
        }
      }

      const timeout = setTimeout(function startDebouncedCalculation() {
        void requestCalculation();
      }, 300);

      return function cancelCalculation() {
        clearTimeout(statusTimer);
        clearTimeout(timeout);
        controller.abort();
      };
    },
    [amount, destination, numericAmount, origin, retryVersion, setCalculation],
  );

  const currentCalculation =
    calculation &&
    calculation.amount === numericAmount &&
    calculation.origin === origin &&
    calculation.destination === destination
      ? calculation
      : null;

  return {
    rates,
    calculation: currentCalculation,
    isLoadingRates,
    isCalculating,
    ratesError,
    quoteError,
    retry,
  };
}
