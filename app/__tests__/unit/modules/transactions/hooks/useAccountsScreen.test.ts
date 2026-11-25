import { mockRouter } from "../../../../support/router";
import { act, renderHook } from "@testing-library/react-native";
import { useAccountsScreen } from "@/modules/transactions/hooks/useAccountsScreen";
import { useAccountsStore } from "@/modules/transactions/stores/accounts.store";
test("abre el alta desde Cuentas y maneja la lista vacía", async () => {
  useAccountsStore.setState(useAccountsStore.getInitialState(), true);
  const { result } = await renderHook(useAccountsScreen);
  expect(result.current.accounts).toEqual([]);
  await act(() => result.current.handleAddAccount());
  expect(mockRouter.push).toHaveBeenCalledWith("/operation/add-account");
});
