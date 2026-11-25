import { KAMBISTA_ENDPOINTS } from '~/shared/constants/api';
import type { Currency } from '~/shared/constants/currencies';
import { ratesSchema, calculationSchema } from '../schemas/exchange.schema';
import type { ExchangeRates, ExchangeCalculation } from '../types/exchange.types';
import { isAbortError } from '~/shared/utils/errors';

export { ratesSchema, calculationSchema, isAbortError };
export type { ExchangeRates, ExchangeCalculation };
function errorMessage(error: unknown) {
  const candidate = error as {
    data?: {
      data?: { message?: string };
      message?: string;
      statusMessage?: string
    };
  };

  return (
    candidate?.data?.data?.message ||
    candidate?.data?.message ||
    candidate?.data?.statusMessage ||
    'No pudimos consultar la cotización. Intenta nuevamente.'
  );
}
export async function getExchangeRates(signal?: AbortSignal): Promise<ExchangeRates> {
  try {
    return ratesSchema.parse(
      await $fetch(KAMBISTA_ENDPOINTS.currentExchange, { signal, retry: 0 }),
    );
  } catch (error) {
    if (signal?.aborted || isAbortError(error)) throw error;
    throw new Error(errorMessage(error));
  }
}
export async function calculateExchange(
  amount: number,
  origin: Currency,
  destination: Currency,
  signal?: AbortSignal,
): Promise<ExchangeCalculation> {
  if (origin === destination) throw new Error('Selecciona monedas diferentes.');
  if (!Number.isFinite(amount) || amount <= 0) throw new Error('Ingresa un monto mayor a cero.');
  try {
    const result = calculationSchema.parse(
      await $fetch(KAMBISTA_ENDPOINTS.calculateExchange, {
        query: { originCurrency: origin, destinationCurrency: destination, amount, active: 'S' },
        signal,
        retry: 0,
      }),
    );
    return {
      exchange: result.exchange,
      rate: result.rate,
      savings: result.savings?.amount ?? null,
    };
  } catch (error) {
    if (signal?.aborted || isAbortError(error)) throw error;
    throw new Error(errorMessage(error));
  }
}
