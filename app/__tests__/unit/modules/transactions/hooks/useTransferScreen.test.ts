import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import { mockRouter } from "../../../../support/router";
import { act, renderHook } from "@testing-library/react-native";
import * as Clipboard from "expo-clipboard";
import { useTransferScreen } from "@/modules/transactions/hooks/useTransferScreen";
jest.mock("expo-clipboard", () => ({ setStringAsync: jest.fn() }));

test("copia y limpia la confirmación anterior ante un fallo", async () => {
  jest
    .mocked(Clipboard.setStringAsync)
    .mockResolvedValueOnce(true)
    .mockResolvedValueOnce(false)
    .mockRejectedValueOnce(new Error("Sin portapapeles"));
  const { result } = await renderHook(useTransferScreen);
  await act(() => result.current.handleCopy("Cuenta", "20101000000000"));
  expect(result.current.copiedField).toBe("Cuenta");
  await act(() => result.current.handleCopy("RUC", "20601708141"));
  expect(result.current.copyError).toContain("No pudimos copiar");
  expect(result.current.copiedField).toBe("");
  await act(() => result.current.handleCopy("RUC", "20601708141"));
  expect(result.current.copyError).toBe("Sin portapapeles");
});
test("navega hacia el paso anterior y el inicio", async () => {
  const { result } = await renderHook(useTransferScreen);
  await act(() => result.current.handleReturnToDetails());
  expect(mockRouter.dismissTo).toHaveBeenCalledWith("/operation/details");
  await act(() => result.current.handleReturnToHome());
  expect(mockRouter.replace).toHaveBeenCalledWith("/(main)");
});
test("confirma transferencia y abre la constancia", async () => {
  useOperationStore.setState(useOperationStore.getInitialState(), true);
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
      currency: "PEN",
      accountType: "AHORRO",
      accountNumber: "00123",
      alias: "",
    },
  );
  const { result } = await renderHook(useTransferScreen);
  await act(() => result.current.handleConfirmTransfer());
  expect(useOperationStore.getState().activeOperation?.transferred).toBe(true);
  expect(mockRouter.push).toHaveBeenCalledWith("/operation/voucher");
});
