import { useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";
import type { OperationFormValues } from "../schemas/operation.schema";
import { useAccountsStore } from "../stores/accounts.store";
import { useOperationStore } from "../stores/operation.store";

export function useRecentDestinationAccount(
  setValue: UseFormSetValue<OperationFormValues>,
) {
  const quote = useOperationStore((state) => state.pendingQuote);
  const accounts = useAccountsStore((state) => state.accounts);

  const lastCreatedAccountId = useAccountsStore(
    (state) => state.lastCreatedAccountId,
  );

  const clearLastCreatedAccount = useAccountsStore(
    (state) => state.clearLastCreatedAccount,
  );

  const recentlyCreatedAccount = accounts.find(
    (account) => account.id === lastCreatedAccountId,
  );
  
  useEffect(
    function selectRecentlyAddedAccount() {
      if (
        !quote ||
        !recentlyCreatedAccount ||
        recentlyCreatedAccount.currency !== quote.destination
      ) {
        return;
      }

      setValue("destinationAccountId", recentlyCreatedAccount.id, {
        shouldValidate: true,
      });
      clearLastCreatedAccount();
    },
    [clearLastCreatedAccount, quote, recentlyCreatedAccount, setValue],
  );
}
