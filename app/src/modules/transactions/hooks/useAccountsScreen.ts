import { useAccountsStore } from "@/modules/transactions/stores/accounts.store";
import { useRouter } from "expo-router";

export function useAccountsScreen() {
  const router = useRouter();
  const accounts = useAccountsStore((state) => state.accounts);
  function handleAddAccount() {
    router.push("/operation/add-account");
  }
  return { accounts, handleAddAccount };
}
