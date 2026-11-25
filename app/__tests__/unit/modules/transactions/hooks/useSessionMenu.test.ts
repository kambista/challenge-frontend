import { mockRouter } from "../../../../support/router";
import { act, renderHook } from "@testing-library/react-native";
import { useSessionMenu } from "@/modules/transactions/hooks/useSessionMenu";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import { useAccountsStore } from "@/modules/transactions/stores/accounts.store";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
test("cerrar sesión limpia usuario, cuentas y operación y redirige al login", async () => {
  useAuthStore.getState().startSession("demo@kambista.com");
  useAccountsStore.getState().addAccount({
    bankId: "1",
    currency: "PEN",
    accountType: "AHORRO",
    accountNumber: "00123",
    alias: "",
  });
  useOperationStore
    .getState()
    .setCalculation({
      amount: 100,
      origin: "USD",
      destination: "PEN",
      exchange: 342,
      rate: 3.42,
      savings: 0,
    });
  useOperationStore
    .getState()
    .startOperation({ amount: 100, origin: "USD", destination: "PEN" });
  const { result } = await renderHook(useSessionMenu);
  await act(() => result.current.handleOpenMenu());
  await act(() => result.current.handleSignOut());
  expect(result.current.menuOpen).toBe(false);
  expect(useAuthStore.getState().isAuthenticated).toBe(false);
  expect(useAccountsStore.getState().accounts).toEqual([]);
  expect(useOperationStore.getState()).toMatchObject({
    calculation: null,
    pendingQuote: null,
    activeOperation: null,
  });
  expect(mockRouter.replace).toHaveBeenCalledWith("/login");
});
