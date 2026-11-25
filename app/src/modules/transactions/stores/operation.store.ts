import type { SavedBankAccount } from "@/modules/transactions/schemas/bank-account.schema";
import type { OperationFormValues } from "@/modules/transactions/schemas/operation.schema";
import type { ExchangeCalculation } from "@/modules/transactions/services/exchange.service";
import type { Currency } from "@/shared/types/currency.types";
import { create } from "zustand";

export type QuoteDraft = {
  amount: number;
  origin: Currency;
  destination: Currency;
};

type VoucherMetadata = { name: string; size: number };

export type OperationQuote = QuoteDraft &
  ExchangeCalculation & {
    bankId: string;
    destinationAccount: SavedBankAccount;
    sourceFundsId: string;
    code: string;
    transferred: boolean;
    submitted: boolean;
    voucher?: VoucherMetadata;
  };

type OperationState = {
  calculation: (QuoteDraft & ExchangeCalculation) | null;
  pendingQuote: (QuoteDraft & ExchangeCalculation) | null;
  activeOperation: OperationQuote | null;
};

type OperationActions = {
  setCalculation: (
    calculation: (QuoteDraft & ExchangeCalculation) | null,
  ) => void;
  startOperation: (quote: QuoteDraft) => boolean;
  configureOperation: (
    values: OperationFormValues,
    destinationAccount: SavedBankAccount,
  ) => boolean;
  confirmTransfer: () => void;
  submitVoucher: (voucher: VoucherMetadata) => boolean;
  resetOperation: () => void;
};

export const useOperationStore = create<OperationState & OperationActions>()((
  set,
  get,
) => {
  function setCalculation(
    calculation: (QuoteDraft & ExchangeCalculation) | null,
  ) {
    set({ calculation });
  }

  function startOperation(quote: QuoteDraft) {
    const calculation = get().calculation;
    if (
      !calculation ||
      calculation.amount !== quote.amount ||
      calculation.origin !== quote.origin ||
      calculation.destination !== quote.destination
    ) {
      return false;
    }

    set({
      pendingQuote: calculation,
      activeOperation: null,
    });
    return true;
  }

  function configureOperation(
    values: OperationFormValues,
    destinationAccount: SavedBankAccount,
  ) {
    const pendingQuote = get().pendingQuote;
    if (
      !pendingQuote ||
      destinationAccount.currency !== pendingQuote.destination
    )
      return false;

    set({
      activeOperation: {
        ...pendingQuote,
        bankId: values.bankId,
        sourceFundsId: values.sourceFundsId,
        destinationAccount,
        code: createOperationCode(),
        transferred: false,
        submitted: false,
      },
    });
    return true;
  }

  function confirmTransfer() {
    set((state) => ({
      activeOperation: state.activeOperation
        ? { ...state.activeOperation, transferred: true }
        : null,
    }));
  }

  function submitVoucher(voucher: VoucherMetadata) {
    const { activeOperation } = get();
    if (!activeOperation?.transferred || activeOperation.submitted)
      return false;
    set({ activeOperation: { ...activeOperation, submitted: true, voucher } });
    return true;
  }

  function resetOperation() {
    set({ pendingQuote: null, activeOperation: null });
  }

  return {
    calculation: null,
    pendingQuote: null,
    activeOperation: null,
    setCalculation,
    startOperation,
    configureOperation,
    confirmTransfer,
    submitVoucher,
    resetOperation,
  };
});

export function createOperationCode() {
  return `km${Date.now().toString(36).slice(-8)}`;
}
