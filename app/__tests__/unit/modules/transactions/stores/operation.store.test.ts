import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import {
  BANK_OPTIONS,
  FUND_OPTIONS,
} from "@/modules/transactions/constants/options.const";

const quote = { amount: 100, origin: "USD", destination: "PEN" } as const;
const account = {
  id: "account",
  bankId: BANK_OPTIONS[0]!.value,
  currency: "PEN",
  accountType: "AHORRO",
  accountNumber: "001234",
  alias: "",
} as const;
const values = {
  bankId: account.bankId,
  destinationAccountId: account.id,
  sourceFundsId: FUND_OPTIONS[0]!.value,
};

beforeEach(() =>
  useOperationStore.setState(useOperationStore.getInitialState(), true),
);

test("bloquea el inicio sin una cotización vigente para los mismos datos", () => {
  const store = useOperationStore.getState();
  expect(store.startOperation(quote)).toBe(false);
  store.setCalculation({ ...quote, exchange: 342, rate: 3.42, savings: 0 });
  for (const patch of [
    { amount: 101 },
    { origin: "PEN" as const },
    { destination: "USD" as const },
  ]) {
    expect(store.startOperation({ ...quote, ...patch })).toBe(false);
  }
  expect(store.startOperation(quote)).toBe(true);
});

test("exige el orden de la operación y conserva una sola constancia", () => {
  const store = useOperationStore.getState();
  const file = { name: "voucher.pdf", size: 100 };
  expect(store.configureOperation(values, account)).toBe(false);
  expect(store.submitVoucher(file)).toBe(false);
  store.confirmTransfer();
  expect(useOperationStore.getState().activeOperation).toBeNull();
  store.setCalculation({ ...quote, exchange: 342, rate: 3.42, savings: null });
  store.startOperation(quote);
  expect(
    store.configureOperation(values, { ...account, currency: "USD" }),
  ).toBe(false);
  expect(store.configureOperation(values, account)).toBe(true);
  expect(store.submitVoucher(file)).toBe(false);
  store.confirmTransfer();
  expect(store.submitVoucher(file)).toBe(true);
  expect(store.submitVoucher({ name: "otro.pdf", size: 200 })).toBe(false);
  expect(useOperationStore.getState().activeOperation?.voucher).toEqual(file);
  store.resetOperation();
  expect(useOperationStore.getState()).toMatchObject({
    activeOperation: null,
    pendingQuote: null,
  });
});
