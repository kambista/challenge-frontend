import { mockRouter } from "../../../../support/router";
import { useField } from "../../../../support/form";
import { act, renderHook } from "@testing-library/react-native";
import { useVoucherScreen } from "@/modules/transactions/hooks/useVoucherScreen";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
beforeEach(() =>
  useOperationStore.setState(useOperationStore.getInitialState(), true),
);

test("bloquea un archivo ausente o envío anterior a la transferencia", async () => {
  const { result } = await renderHook(() => {
    const form = useVoucherScreen();
    return {
      form,
      file: useField(form.control, "fileName"),
      errors: form.formState.errors,
    };
  });
  await act(() => result.current.form.onSubmit());
  expect(result.current.errors.fileName).toBeDefined();
  await act(() => {
    result.current.file.onChange("demo.pdf");
    result.current.form.handleFileSizeChange(100);
  });
  await act(() => result.current.form.onSubmit());
  expect(mockRouter.replace).not.toHaveBeenCalled();
});
test("envía una sola constancia y abre el resumen", async () => {
  const store = useOperationStore.getState();
  store.setCalculation({
    amount: 100,
    origin: "USD",
    destination: "PEN",
    exchange: 342,
    rate: 3.42,
    savings: 0,
  });
  store.startOperation({ amount: 100, origin: "USD", destination: "PEN" });
  store.configureOperation(
    { bankId: "1", destinationAccountId: "a", sourceFundsId: "1" },
    {
      id: "a",
      bankId: "1",
      accountType: "AHORRO",
      currency: "PEN",
      accountNumber: "00123",
      alias: "",
    },
  );
  store.confirmTransfer();
  const { result } = await renderHook(() => {
    const form = useVoucherScreen();
    return { form, file: useField(form.control, "fileName") };
  });
  await act(() => {
    result.current.file.onChange("demo.pdf");
    result.current.form.handleFileSizeChange(100);
  });
  await act(async () => {
    await Promise.all([
      result.current.form.onSubmit(),
      result.current.form.onSubmit(),
    ]);
  });
  expect(mockRouter.replace).toHaveBeenCalledTimes(1);
  expect(mockRouter.replace).toHaveBeenCalledWith("/operation/success");
});
