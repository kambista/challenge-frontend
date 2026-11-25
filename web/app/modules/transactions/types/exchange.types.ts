import type { z } from 'zod';
import type { ratesSchema } from '../schemas/exchange.schema';
import type { Currency } from '~/shared/constants/currencies';

export type ExchangeRates = z.infer<typeof ratesSchema>;

export interface ExchangeCalculation {
  exchange: number;
  rate: number;
  savings: number | null;
}

export type QuoteInputs = readonly [
  amount: number,
  origin: Currency,
  destination: Currency,
  refresh: number,
];
