export const CURRENCIES = ["PEN", "USD"] as const;

export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_OPTIONS: readonly {
  value: Currency;
  label: string;
}[] = [
  { value: "USD", label: "Dólares" },
  { value: "PEN", label: "Soles" },
];

export function getCurrencyLabel(currency: Currency) {
  return currency === "PEN" ? "Soles" : "Dólares";
}

export function formatMoney(amount: number, currency: Currency) {
  const formattedAmount = new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return currency === "PEN" ? `S/ ${formattedAmount}` : `$ ${formattedAmount}`;
}
