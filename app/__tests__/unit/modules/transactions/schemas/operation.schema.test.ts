import { operationSchema } from "@/modules/transactions/schemas/operation.schema";
import {
  BANK_OPTIONS,
  FUND_OPTIONS,
} from "@/modules/transactions/constants/options.const";
test.each(FUND_OPTIONS)("acepta fondos $label", async ({ value }) => {
  expect(
    await operationSchema.isValid({
      bankId: BANK_OPTIONS[0]!.value,
      destinationAccountId: "a",
      sourceFundsId: value,
    }),
  ).toBe(true);
});
