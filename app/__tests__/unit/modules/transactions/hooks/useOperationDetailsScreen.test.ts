import { mockRouter } from "../../../../support/router";
import { useField } from "../../../../support/form";
import { act, renderHook } from "@testing-library/react-native";
import { useOperationDetailsScreen } from "@/modules/transactions/hooks/useOperationDetailsScreen";
import { useAccountsStore } from "@/modules/transactions/stores/accounts.store";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import {
  BANK_OPTIONS,
  FUND_OPTIONS,
} from "@/modules/transactions/constants/options.const";

const quote = {
  amount: 100,
  origin: "USD",
  destination: "PEN",
  rate: 3.42,
  exchange: 342,
  savings: 0,
} as const;
beforeEach(() => {
  useAccountsStore.setState(useAccountsStore.getInitialState(), true);
  useOperationStore.setState(useOperationStore.getInitialState(), true);
});
async function setup() {
  return renderHook(() => {
    const form = useOperationDetailsScreen();
    return {
      form,
      errors: form.formState.errors,
      bank: useField(form.control, "bankId"),
      account: useField(form.control, "destinationAccountId"),
      funds: useField(form.control, "sourceFundsId"),
    };
  });
}
test("muestra lista vacía y mantiene cotización mientras se abre el alta", async () => {
  useOperationStore.setState({ pendingQuote: quote });
  const { result } = await setup();
  expect(result.current.form.eligibleAccounts).toEqual([]);
  await act(() => result.current.form.handleAddDestinationAccount());
  expect(mockRouter.push).toHaveBeenCalledWith(
    "/operation/add-account?currency=PEN",
  );
  expect(useOperationStore.getState().pendingQuote).toEqual(quote);
});
test("filtra y selecciona automáticamente la cuenta recién creada", async () => {
  useOperationStore.setState({ pendingQuote: quote });
  const store = useAccountsStore.getState();
  const account = {
    bankId: BANK_OPTIONS[0]!.value,
    currency: "PEN",
    accountType: "AHORRO",
    accountNumber: "00123",
    alias: "",
  } as const;
  store.addAccount({ ...account, currency: "USD" });
  const saved = store.addAccount(account);
  const { result } = await setup();
  expect(result.current.form.eligibleAccounts.map((item) => item.id)).toEqual([
    saved.id,
  ]);
  expect(result.current.account.value).toBe(saved.id);
  await act(() => {
    result.current.bank.onChange(BANK_OPTIONS[0]!.value);
    result.current.funds.onChange(FUND_OPTIONS[0]!.value);
  });
  await act(() => result.current.form.onSubmit());
  expect(mockRouter.push).toHaveBeenCalledWith("/operation/transfer");
});
test("rechaza una cuenta de moneda incorrecta", async () => {
  useOperationStore.setState({ pendingQuote: quote });
  const { result } = await setup();
  await act(() => {
    result.current.bank.onChange(BANK_OPTIONS[0]!.value);
    result.current.funds.onChange(FUND_OPTIONS[0]!.value);
    result.current.account.onChange("cuenta-ajena");
  });
  await act(() => result.current.form.onSubmit());
  expect(result.current.errors.destinationAccountId?.message).toContain(
    "moneda",
  );
  expect(mockRouter.push).not.toHaveBeenCalled();
});
test("redirige a Inicio si falta la cotización", async () => {
  const { result } = await setup();
  await act(() => {
    result.current.bank.onChange(BANK_OPTIONS[0]!.value);
    result.current.funds.onChange(FUND_OPTIONS[0]!.value);
    result.current.account.onChange("cuenta");
  });
  await act(() => result.current.form.onSubmit());
  expect(mockRouter.replace).toHaveBeenCalledWith("/(main)");
});
test("muestra un error si falla la preparación de la operación", async () => {
  useOperationStore.setState({ pendingQuote: quote });
  const saved = useAccountsStore.getState().addAccount({
    bankId: BANK_OPTIONS[0]!.value,
    currency: "PEN",
    accountType: "AHORRO",
    accountNumber: "00123",
    alias: "",
  });
  jest
    .spyOn(useOperationStore.getState(), "configureOperation")
    .mockReturnValueOnce(false);
  const { result } = await setup();
  await act(() => {
    result.current.bank.onChange(BANK_OPTIONS[0]!.value);
    result.current.funds.onChange(FUND_OPTIONS[0]!.value);
    result.current.account.onChange(saved.id);
  });
  await act(() => result.current.form.onSubmit());
  expect(result.current.form.formError).toContain("No pudimos preparar");
  expect(mockRouter.push).not.toHaveBeenCalled();
  expect(useOperationStore.getState().pendingQuote).toEqual(quote);
});
