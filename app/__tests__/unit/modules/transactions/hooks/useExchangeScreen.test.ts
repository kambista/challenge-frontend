import { mockRouter } from "../../../../support/router";
import { act, renderHook } from "@testing-library/react-native";
import { useExchangeScreen } from "@/modules/transactions/hooks/useExchangeScreen";
import { useExchangeQuote } from "@/modules/transactions/hooks/useExchangeQuote";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
jest.mock("@/modules/transactions/hooks/useExchangeQuote", () => ({
  useExchangeQuote: jest.fn(),
}));

beforeEach(() => {
  useOperationStore.setState(useOperationStore.getInitialState(), true);
  jest.mocked(useExchangeQuote).mockReturnValue({
    rates: null,
    calculation: null,
    isLoadingRates: false,
    isCalculating: false,
    ratesError: "",
    quoteError: "",
    retry: jest.fn(),
  });
});
test("bloquea el avance sin una cotización vigente", async () => {
  const { result } = await renderHook(useExchangeScreen);
  await act(() => result.current.onSubmit());
  expect(result.current.formError).toContain("Espera");
  expect(mockRouter.push).not.toHaveBeenCalled();
});
test.each([
  ["USD", "PEN"],
  ["PEN", "USD"],
] as const)(
  "inicia la operación %s → %s y abre los datos",
  async (origin, destination) => {
    const calculation = {
      amount: 100,
      origin,
      destination,
      exchange: 342,
      rate: 3.42,
      savings: 0,
    };
    useOperationStore.getState().setCalculation(calculation);
    jest.mocked(useExchangeQuote).mockReturnValue({
      rates: { bid: 3.42, ask: 3.47 },
      calculation,
      isLoadingRates: false,
      isCalculating: false,
      ratesError: "",
      quoteError: "",
      retry: jest.fn(),
    });
    const { result } = await renderHook(useExchangeScreen);
    await act(() => result.current.handleSetPair(origin, destination));
    await act(() => result.current.onSubmit());
    expect(mockRouter.push).toHaveBeenCalledWith("/operation/details");
    expect(useOperationStore.getState().pendingQuote).toEqual(calculation);
  },
);
