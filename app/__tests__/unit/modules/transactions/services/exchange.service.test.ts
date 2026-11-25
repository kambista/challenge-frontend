import {
  calculateExchange,
  getExchangeRates,
} from "@/modules/transactions/services/exchange.service";
import { apiClient } from "@/shared/services/http.client";

const originalAdapter = apiClient.defaults.adapter;
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter;
});

test.each([
  ["USD", "PEN"],
  ["PEN", "USD"],
] as const)(
  "consulta %s → %s con el contrato HTTP",
  async (origin, destination) => {
    const request = jest.fn(
      async (config: import("axios").InternalAxiosRequestConfig) => ({
        config,
        status: 200,
        statusText: "OK",
        headers: {},
        data: { exchange: "342.8", rate: "3.428", savings: { amount: "0" } },
      }),
    );
    apiClient.defaults.adapter = request;
    await expect(calculateExchange(100, origin, destination)).resolves.toEqual({
      exchange: 342.8,
      rate: 3.428,
      savings: 0,
    });
    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/exchange/calculates",
        params: {
          originCurrency: origin,
          destinationCurrency: destination,
          amount: 100,
          active: "S",
        },
      }),
    );
  },
);
test.each([null, {}, { bid: 0, ask: 3.4 }, { bid: "bad", ask: 3.4 }])(
  "rechaza tasas inválidas %j",
  async (data) => {
    apiClient.defaults.adapter = async (config) => ({
      config,
      data,
      status: 200,
      statusText: "OK",
      headers: {},
    });
    await expect(getExchangeRates()).rejects.toThrow();
  },
);
test.each([
  null,
  {},
  { exchange: -1, rate: 3.4 },
  { exchange: 1, rate: 0 },
  { exchange: 1, rate: 3.4, savings: "bad" },
])("rechaza cálculo inválido %j", async (data) => {
  apiClient.defaults.adapter = async (config) => ({
    config,
    data,
    status: 200,
    statusText: "OK",
    headers: {},
  });
  await expect(calculateExchange(100, "PEN", "USD")).rejects.toThrow();
});
test.each([0, -1, NaN, Infinity])(
  "rechaza monto %s sin HTTP",
  async (amount) => {
    const request = jest.fn();
    apiClient.defaults.adapter = request;
    await expect(calculateExchange(amount, "PEN", "USD")).rejects.toThrow();
    expect(request).not.toHaveBeenCalled();
  },
);
