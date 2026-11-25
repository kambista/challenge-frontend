import { renderHook } from "@testing-library/react-native";
import { useOperationGate } from "@/modules/transactions/hooks/useOperationGate";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import type { OperationStep } from "@/modules/transactions/types/operation-gate.types";
jest.mock("expo-router", () => ({ useIsFocused: () => true }));

beforeEach(() =>
  useOperationStore.setState(useOperationStore.getInitialState(), true),
);

test.each([
  ["details", 0, "/(main)"],
  ["transfer", 0, "/(main)"],
  ["voucher", 0, "/(main)"],
  ["success", 0, "/(main)"],
  ["details", 1, null],
  ["transfer", 1, "/operation/details"],
  ["voucher", 1, "/operation/details"],
  ["success", 1, "/operation/details"],
  ["transfer", 2, null],
  ["voucher", 2, "/operation/transfer"],
  ["success", 2, "/operation/transfer"],
  ["voucher", 3, null],
  ["success", 3, "/operation/voucher"],
  ["success", 4, null],
] satisfies [OperationStep, number, string | null][])(
  "%s en estado %s → %s",
  async (step, stage, expected) => {
    const store = useOperationStore.getState();
    if (stage > 0) {
      store.setCalculation({
        amount: 100,
        origin: "USD",
        destination: "PEN",
        rate: 3.42,
        exchange: 342,
        savings: 0,
      });
      store.startOperation({ amount: 100, origin: "USD", destination: "PEN" });
    }
    if (stage > 1)
      store.configureOperation(
        { bankId: "1", destinationAccountId: "a", sourceFundsId: "1" },
        {
          id: "a",
          bankId: "1",
          currency: "PEN",
          accountNumber: "00123",
          accountType: "AHORRO",
          alias: "",
        },
      );
    if (stage > 2) store.confirmTransfer();
    if (stage > 3) store.submitVoucher({ name: "voucher.pdf", size: 100 });
    const { result } = await renderHook(() => useOperationGate(step));
    expect(result.current.redirect).toBe(expected);
  },
);
