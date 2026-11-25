import { apiClient } from "@/shared/services/http.client";
import type { Currency } from "@/shared/types/currency.types";
import { isAxiosError } from "axios";

export type ExchangeRates = {
  bid: number;
  ask: number;
};

export type ExchangeCalculation = {
  exchange: number;
  rate: number;
  savings: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toFiniteNumber(value: unknown, name: string) {
  let parsed = Number.NaN;
  if (typeof value === "number") {
    parsed = value;
  } else if (
    typeof value === "string" &&
    /^-?\d+(?:\.\d+)?$/.test(value.trim())
  ) {
    parsed = Number(value.trim());
  }
  if (!Number.isFinite(parsed)) {
    throw new Error(
      `La respuesta de cotización no contiene un valor válido para ${name}.`,
    );
  }
  return parsed;
}

function responseErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    if (isRecord(responseData)) {
      const nested = responseData.data;
      if (isRecord(nested) && typeof nested.message === "string")
        return nested.message;
      if (typeof responseData.message === "string") return responseData.message;
    }
    return error.message || "No pudimos consultar el servicio de cambio.";
  }
  if (error instanceof Error) return error.message;
  return "No pudimos consultar el servicio de cambio. Intenta nuevamente.";
}

function throwServiceError(error: unknown): never {
  throw new Error(responseErrorMessage(error));
}

export async function getExchangeRates(
  signal?: AbortSignal,
): Promise<ExchangeRates> {
  try {
    const response = await apiClient.get<unknown>(
      "/exchange/kambista/current",
      { signal },
    );
    if (!isRecord(response.data)) {
      throw new Error("El servicio de cambio devolvió una respuesta inválida.");
    }

    const rates = {
      bid: toFiniteNumber(response.data.bid, "bid"),
      ask: toFiniteNumber(response.data.ask, "ask"),
    };
    if (rates.bid <= 0 || rates.ask <= 0) {
      throw new Error("El servicio de cambio devolvió tasas fuera de rango.");
    }
    return rates;
  } catch (error) {
    throwServiceError(error);
  }
}

export async function calculateExchange(
  amount: number,
  origin: Currency,
  destination: Currency,
  signal?: AbortSignal,
): Promise<ExchangeCalculation> {
  if (origin === destination) throw new Error("Selecciona monedas diferentes.");
  if (!Number.isFinite(amount) || amount <= 0)
    throw new Error("Ingresa un monto mayor a cero.");

  try {
    const response = await apiClient.get<unknown>("/exchange/calculates", {
      params: {
        originCurrency: origin,
        destinationCurrency: destination,
        amount,
        active: "S",
      },
      signal,
    });

    if (!isRecord(response.data)) {
      throw new Error(
        "El servicio de cálculo devolvió una respuesta inválida.",
      );
    }

    let savingsAmount: number | null = null;
    if (response.data.savings !== undefined && response.data.savings !== null) {
      if (!isRecord(response.data.savings)) {
        throw new Error("El servicio de cálculo devolvió un ahorro inválido.");
      }
      savingsAmount = toFiniteNumber(
        response.data.savings.amount,
        "savings.amount",
      );
    }
    const exchange = toFiniteNumber(response.data.exchange, "exchange");
    const rate = toFiniteNumber(response.data.rate, "rate");

    if (exchange < 0 || rate <= 0) {
      throw new Error(
        "El servicio de cálculo devolvió valores fuera de rango.",
      );
    }

    return { exchange, rate, savings: savingsAmount };
  } catch (error) {
    throwServiceError(error);
  }
}
