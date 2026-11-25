export const CURRENCIES = ['PEN', 'USD'] as const;

export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'Dólares' },
  { value: 'PEN', label: 'Soles' },
] as const;
