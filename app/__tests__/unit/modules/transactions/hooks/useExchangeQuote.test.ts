import { act, renderHook } from "@testing-library/react-native";
import { useExchangeQuote } from "@/modules/transactions/hooks/useExchangeQuote";
import {
  calculateExchange,
  getExchangeRates,
} from "@/modules/transactions/services/exchange.service";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import { useExchangeRateStore } from "@/modules/transactions/stores/exchange-rate.store";

jest.mock("@/modules/transactions/services/exchange.service", () => ({
  calculateExchange: jest.fn(),
  getExchangeRates: jest.fn(),
}));
beforeEach(() => {
  jest.useFakeTimers();
  useOperationStore.setState(useOperationStore.getInitialState(), true);
  useExchangeRateStore.setState(useExchangeRateStore.getInitialState(), true);
  jest.mocked(getExchangeRates).mockResolvedValue({ bid: 3.42, ask: 3.47 });
});
afterEach(() => jest.useRealTimers());

async function advance(ms: number) {
  await act(async () => {
    await jest.advanceTimersByTimeAsync(ms);
  });
}
test("aplica debounce y descarta la respuesta cancelada", async () => {
  let finishFirst!: (value: {
    exchange: number;
    rate: number;
    savings: number | null;
  }) => void;
  const calculate = jest.mocked(calculateExchange);
  calculate
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishFirst = resolve;
        }),
    )
    .mockResolvedValueOnce({ exchange: 684, rate: 3.42, savings: 0 });
  const { result, rerender } = await renderHook(
    ({ amount }: { amount: string }) => useExchangeQuote(amount, "USD", "PEN"),
    { initialProps: { amount: "100" } },
  );
  await advance(299);
  expect(calculate).not.toHaveBeenCalled();
  await advance(1);
  const signal = calculate.mock.calls[0]?.[3];
  await rerender({ amount: "200" });
  expect(signal?.aborted).toBe(true);
  await advance(300);
  expect(result.current.calculation?.exchange).toBe(684);
  await act(() => finishFirst({ exchange: 342, rate: 3.42, savings: 2 }));
  expect(result.current.calculation?.exchange).toBe(684);
});
test("permite reintentar fallos de cálculo y tasas", async () => {
  jest.mocked(getExchangeRates).mockRejectedValueOnce(new Error("Sin tasas"));
  jest
    .mocked(calculateExchange)
    .mockRejectedValueOnce(new Error("Sin cálculo"))
    .mockResolvedValueOnce({ exchange: 28.84, rate: 3.47, savings: null });
  const { result } = await renderHook(() =>
    useExchangeQuote("100", "PEN", "USD"),
  );
  await advance(300);
  expect(result.current.ratesError).toBe("Sin tasas");
  expect(result.current.quoteError).toBe("Sin cálculo");
  await act(() => result.current.retry());
  await advance(300);
  expect(result.current.ratesError).toBe("");
  expect(result.current.quoteError).toBe("");
  expect(result.current.calculation?.savings).toBeNull();
});
test.each(["", "0", "-1", "abc"])(
  "omite cálculo para monto inválido %s",
  async (amount) => {
    const { result } = await renderHook(() =>
      useExchangeQuote(amount, "USD", "PEN"),
    );
    await advance(300);
    expect(calculateExchange).not.toHaveBeenCalled();
    expect(result.current.calculation).toBeNull();
  },
);
test("cancela solicitudes al desmontar", async () => {
  jest
    .mocked(calculateExchange)
    .mockImplementation(() => new Promise(() => {}));
  const { unmount } = await renderHook(() =>
    useExchangeQuote("100", "USD", "PEN"),
  );
  await advance(300);
  const signal = jest.mocked(calculateExchange).mock.calls[0]?.[3];
  await unmount();
  expect(signal?.aborted).toBe(true);
});
