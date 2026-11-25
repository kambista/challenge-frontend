import type { Currency } from '~/shared/constants/currencies';

export const DEFAULT_QUOTE_DRAFT: { amount: number; origin: Currency; destination: Currency } = {
  amount: 10000,
  origin: 'USD',
  destination: 'PEN',
};
