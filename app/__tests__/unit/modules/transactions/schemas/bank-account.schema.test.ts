import { bankAccountSchema } from "@/modules/transactions/schemas/bank-account.schema";
import { BANK_OPTIONS } from "@/modules/transactions/constants/options.const";
test.each(["AHORRO", "CORRIENTE"])(
  "valida cuenta de tipo %s",
  async (accountType) => {
    const account = {
      bankId: BANK_OPTIONS[0]?.value,
      accountType,
      currency: "PEN",
      accountNumber: "00123",
      owned: true,
    };
    await expect(bankAccountSchema.validate(account)).resolves.toMatchObject({
      accountNumber: "00123",
      alias: "",
    });
    expect(
      await bankAccountSchema.isValid({ ...account, accountNumber: "00-1" }),
    ).toBe(false);
    expect(await bankAccountSchema.isValid({ ...account, owned: false })).toBe(
      false,
    );
    expect(
      await bankAccountSchema.isValid({ ...account, bankId: "inexistente" }),
    ).toBe(false);
  },
);

test.each(BANK_OPTIONS)("acepta banco $label", async ({ value }) => {
  expect(
    await bankAccountSchema.isValid({
      bankId: value,
      accountType: "AHORRO",
      currency: "USD",
      accountNumber: "00123",
      owned: true,
    }),
  ).toBe(true);
});
test("valida límites del alias", async () => {
  const account = {
    bankId: BANK_OPTIONS[0]!.value,
    accountType: "CORRIENTE",
    currency: "PEN",
    accountNumber: "00123",
    owned: true,
  };
  expect(
    await bankAccountSchema.isValid({ ...account, alias: "a".repeat(60) }),
  ).toBe(true);
  expect(
    await bankAccountSchema.isValid({ ...account, alias: "a".repeat(61) }),
  ).toBe(false);
});
