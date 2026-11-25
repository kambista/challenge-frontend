import { afterEach, describe, expect, it, vi } from 'vitest';
import { KAMBISTA_ENDPOINTS } from '~/shared/constants/api';
import {
  calculateExchange,
  getExchangeRates,
} from '~/modules/transactions/services/exchange.service';

afterEach(() => vi.unstubAllGlobals());

describe('Servicio de cotización', () => {
  it('consulta las tasas desde el endpoint público de Kambista', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ bid: '3.428', ask: 3.467 });
    vi.stubGlobal('$fetch', fetchMock);

    await expect(getExchangeRates()).resolves.toEqual({ bid: 3.428, ask: 3.467 });
    expect(fetchMock).toHaveBeenCalledWith(KAMBISTA_ENDPOINTS.currentExchange, {
      signal: undefined,
      retry: 0,
    });
  });

  it('envía los parámetros de cálculo al endpoint público de Kambista', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      exchange: 342.8,
      rate: 3.428,
      savings: { amount: '5.14', currency: 'S/' },
    });
    vi.stubGlobal('$fetch', fetchMock);

    await expect(calculateExchange(100, 'USD', 'PEN')).resolves.toEqual({
      exchange: 342.8,
      rate: 3.428,
      savings: 5.14,
    });
    expect(fetchMock).toHaveBeenCalledWith(KAMBISTA_ENDPOINTS.calculateExchange, {
      query: {
        originCurrency: 'USD',
        destinationCurrency: 'PEN',
        amount: 100,
        active: 'S',
      },
      signal: undefined,
      retry: 0,
    });
  });
  it.each([0, -1, Infinity, NaN])(
    'rechaza el monto inválido %s antes de llamar a HTTP',
    async (amount) => {
      const request = vi.fn();
      vi.stubGlobal('$fetch', request);
      await expect(calculateExchange(amount, 'USD', 'PEN')).rejects.toThrow('monto mayor a cero');
      expect(request).not.toHaveBeenCalled();
    },
  );

  it('rechaza una respuesta malformada y admite una respuesta sin ahorro', async () => {
    vi.stubGlobal(
      '$fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ exchange: '??', rate: 3.47 })
        .mockResolvedValueOnce({ exchange: 10, rate: 3.47 }),
    );
    await expect(calculateExchange(100, 'PEN', 'USD')).rejects.toThrow('No pudimos');
    await expect(calculateExchange(100, 'PEN', 'USD')).resolves.toMatchObject({ savings: null });
  });
});
