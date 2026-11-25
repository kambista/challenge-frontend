import type { Currency } from '../constants/currencies';

export function formatMoney(amount: number, currency: Currency): string {
  const value = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currency === 'USD' ? 'US$' : 'S/'} ${value}`;
}
