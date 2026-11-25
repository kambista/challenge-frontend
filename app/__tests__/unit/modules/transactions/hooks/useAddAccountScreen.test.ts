import { mockRouter, mockParams } from "../../../../support/router";
import { useField } from "../../../../support/form";
import { act, renderHook } from "@testing-library/react-native";
import { useAddAccountScreen } from "@/modules/transactions/hooks/useAddAccountScreen";
import { useAccountsStore } from "@/modules/transactions/stores/accounts.store";
import { BANK_OPTIONS } from "@/modules/transactions/constants/options.const";

beforeEach(() =>
  useAccountsStore.setState(useAccountsStore.getInitialState(), true),
);

test.each(["PEN", "USD"] as const)(
  "guarda cuenta %s preservando ceros y vuelve al paso anterior",
  async (currency) => {
    mockParams.currency = currency;
    const { result } = await renderHook(() => {
      const form = useAddAccountScreen();
      return {
        form,
        bank: useField(form.control, "bankId"),
        number: useField(form.control, "accountNumber"),
        owned: useField(form.control, "owned"),
      };
    });
    await act(() => result.current.form.onSubmit());
    expect(useAccountsStore.getState().accounts).toEqual([]);
    expect(mockRouter.back).not.toHaveBeenCalled();
    await act(() => {
      result.current.bank.onChange(BANK_OPTIONS[0]!.value);
      result.current.number.onChange("00123456");
      result.current.owned.onChange(true);
    });
    await act(() => result.current.form.onSubmit());
    expect(useAccountsStore.getState().accounts[0]).toMatchObject({
      currency,
      accountNumber: "00123456",
      alias: "",
    });
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  },
);
test("vuelve a Cuentas cuando se abrió sin historial", async () => {
  mockRouter.canGoBack.mockReturnValue(false);
  const { result } = await renderHook(useAddAccountScreen);
  await act(() => result.current.handleBack());
  expect(mockRouter.replace).toHaveBeenCalledWith("/(main)/accounts");
});
