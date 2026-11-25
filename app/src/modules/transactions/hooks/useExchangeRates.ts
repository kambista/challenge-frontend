import { getExchangeRates } from "@/modules/transactions/services/exchange.service";
import { useExchangeRateStore } from "@/modules/transactions/stores/exchange-rate.store";
import { useCallback, useEffect, useRef, useState } from "react";

export function useExchangeRates(onRetry: () => void) {
  const rates = useExchangeRateStore((state) => state.rates);
  const setRates = useExchangeRateStore((state) => state.setRates);
  const ratesController = useRef<AbortController | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [ratesError, setRatesError] = useState("");
  const loadRates = useCallback(
    async function loadCurrentRates() {
      ratesController.current?.abort();
      const controller = new AbortController();
      ratesController.current = controller;
      setRates(null);
      setIsLoadingRates(true);
      setRatesError("");

      try {
        const currentRates = await getExchangeRates(controller.signal);
        if (!controller.signal.aborted) setRates(currentRates);
      } catch (error) {
        if (!controller.signal.aborted) {
          setRatesError(
            error instanceof Error
              ? error.message
              : "No pudimos consultar el tipo de cambio.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingRates(false);
      }
    },
    [setRates],
  );

  const retry = useCallback(
    function retryQuote() {
      void loadRates();
      onRetry();
    },
    [loadRates, onRetry],
  );

  useEffect(
    function loadRatesOnMount() {
      const timer = setTimeout(function loadInitialRates() {
        void loadRates();
      }, 0);

      return function abortRatesOnUnmount() {
        clearTimeout(timer);
        ratesController.current?.abort();
      };
    },
    [loadRates],
  );

  return { rates, isLoadingRates, ratesError, retry };
}
