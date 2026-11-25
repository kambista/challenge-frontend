import { useAuthStore } from "@/modules/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAccountsStore } from "../stores/accounts.store";
import { useOperationStore } from "../stores/operation.store";

export function useSessionMenu() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.clearSession);
  const [menuOpen, setMenuOpen] = useState(false);
  function handleOpenMenu() {
    setMenuOpen(true);
  }
  function handleCloseMenu() {
    setMenuOpen(false);
  }
  function handleSignOut() {
    setMenuOpen(false);
    useAccountsStore.getState().clearAccounts();
    const { resetOperation, setCalculation } = useOperationStore.getState();
    resetOperation();
    setCalculation(null);
    clearSession();
    router.replace("/login");
  }

  return { menuOpen, handleOpenMenu, handleCloseMenu, handleSignOut };
}
