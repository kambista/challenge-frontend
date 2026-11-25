import { expect, it } from 'vitest';
import { calculationSchema } from '~/modules/transactions/schemas/exchange.schema';
it('interpreta savings.amount y conserva el ahorro cero', () => {
  expect(calculationSchema.safeParse({ exchange: null, rate: 3.428 }).success).toBe(false);
  expect(
    calculationSchema.parse({
      exchange: 342.8,
      rate: 3.428,
      savings: { amount: '5.14', currency: 'S/' },
    }).savings?.amount,
  ).toBe(5.14);
  expect(
    calculationSchema.parse({
      exchange: 0,
      rate: 3.428,
      savings: { amount: '0' },
    }).savings?.amount,
  ).toBe(0);
});
