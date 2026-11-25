import { mockRouter } from "../../../../support/router";
import { act, renderHook } from "@testing-library/react-native";
import { useOperationSuccessScreen } from "@/modules/transactions/hooks/useOperationSuccessScreen";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
test("volver a Inicio limpia el borrador y bloquea el resumen anterior", async () => {
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
  const reset = jest.spyOn(useOperationStore.getState(), "resetOperation");
  const { result } = await renderHook(useOperationSuccessScreen);
  await act(() => result.current.handleReturnHome());
  expect(reset).toHaveBeenCalledTimes(1);
  expect(mockRouter.dismissTo).toHaveBeenCalledWith("/(main)");
  expect(useOperationStore.getState()).toMatchObject({
    pendingQuote: null,
    activeOperation: null,
  });
});
