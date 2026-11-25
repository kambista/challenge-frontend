import type { ExchangeRates } from "@/modules/transactions/services/exchange.service";
import { create } from "zustand";

type ExchangeRateState = {
  rates: ExchangeRates | null;
  setRates: (rates: ExchangeRates | null) => void;
};

export const useExchangeRateStore = create<ExchangeRateState>()((set) => {
  function setRates(rates: ExchangeRates | null) {
    set({ rates });
  }

  return { rates: null, setRates };
});
