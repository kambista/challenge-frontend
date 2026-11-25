import type { SavedBankAccount } from "@/modules/transactions/schemas/bank-account.schema";
import { create } from "zustand";

type AccountsState = {
  accounts: SavedBankAccount[];
  lastCreatedAccountId: string | null;
};

type AccountsActions = {
  addAccount: (account: Omit<SavedBankAccount, "id">) => SavedBankAccount;
  clearLastCreatedAccount: () => void;
  clearAccounts: () => void;
};

export const useAccountsStore = create<AccountsState & AccountsActions>()((
  set,
) => {
  function addAccount(account: Omit<SavedBankAccount, "id">) {
    const savedAccount: SavedBankAccount = {
      ...account,
      id: `account-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    set((state) => ({
      accounts: [...state.accounts, savedAccount],
      lastCreatedAccountId: savedAccount.id,
    }));
    return savedAccount;
  }

  function clearLastCreatedAccount() {
    set({ lastCreatedAccountId: null });
  }

  function clearAccounts() {
    set({ accounts: [], lastCreatedAccountId: null });
  }

  return {
    accounts: [],
    lastCreatedAccountId: null,
    addAccount,
    clearLastCreatedAccount,
    clearAccounts,
  };
});
