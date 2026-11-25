import { describe, expect, it } from 'vitest';
import { bankAccountSchema } from '~/modules/transactions/schemas/bankAccount.schema';

describe('Validación de cuentas bancarias', () => {
  it('conserva ceros iniciales y rechaza caracteres no numéricos', () => {
    const account = {
      bankId: '1',
      accountType: 'AHORRO',
      currency: 'PEN',
      accountNumber: '0012345678',
    };
    expect(bankAccountSchema.parse(account).accountNumber).toBe('0012345678');
    expect(bankAccountSchema.safeParse({ ...account, accountNumber: '001-234' }).success).toBe(
      false,
    );
  });
});
import { bankAccountFormSchema } from '~/modules/transactions/schemas/bankAccount.schema';
import { BANK_OPTIONS, FUND_OPTIONS } from '~/modules/transactions/constants/options';
import { operationSchema } from '~/modules/transactions/schemas/operation.schema';

describe('Catálogos y titularidad', () => {
  it.each(BANK_OPTIONS)('acepta banco $label con ambos tipos de cuenta', ({ value }) => {
    for (const accountType of ['AHORRO', 'CORRIENTE']) {
      const account = {
        bankId: value,
        accountType,
        currency: 'USD',
        accountNumber: '00123',
        owned: true,
      };
      expect(bankAccountFormSchema.safeParse(account).success).toBe(true);
      expect(bankAccountFormSchema.safeParse({ ...account, owned: false }).success).toBe(false);
    }
  });
  it.each(FUND_OPTIONS)('acepta el origen $label', ({ value }) => {
    expect(
      operationSchema.safeParse({
        bankId: BANK_OPTIONS[0]!.value,
        destinationAccountId: 'cuenta',
        sourceFundsId: value,
      }).success,
    ).toBe(true);
  });
  it('rechaza catálogos ajenos y alias mayores de 60 caracteres', () => {
    const account = {
      bankId: BANK_OPTIONS[0]!.value,
      accountType: 'AHORRO',
      currency: 'USD',
      accountNumber: '00123',
      owned: true,
    };
    expect(bankAccountFormSchema.safeParse({ ...account, bankId: 'inexistente' }).success).toBe(
      false,
    );
    expect(bankAccountFormSchema.safeParse({ ...account, alias: 'a'.repeat(60) }).success).toBe(
      true,
    );
    expect(bankAccountFormSchema.safeParse({ ...account, alias: 'a'.repeat(61) }).success).toBe(
      false,
    );
    expect(
      operationSchema.safeParse({
        bankId: account.bankId,
        destinationAccountId: 'cuenta',
        sourceFundsId: 'inexistente',
      }).success,
    ).toBe(false);
  });
});
