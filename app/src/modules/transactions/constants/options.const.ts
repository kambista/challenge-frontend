import bankAccounts from "@mocks/bankAccounts.json";
import sourceFunds from "@mocks/sourceFunds.json";

export const BANK_OPTIONS = bankAccounts.map((bank) => ({
  value: bank.id,
  label: bank.name,
}));

export const FUND_OPTIONS = sourceFunds.map((fund) => ({
  value: fund.id,
  label: fund.name,
}));

export const ACCOUNT_TYPE_OPTIONS = [
  { value: "AHORRO", label: "Ahorros" },
  { value: "CORRIENTE", label: "Corriente" },
] as const;

export const KAMBISTA_DEMO_ACCOUNT = {
  number: "20101000000000",
  ruc: "20601708141",
  holder: "Kambista SAC",
  type: "Corriente",
} as const;

export function getBankName(id: string) {
  return bankAccounts.find((bank) => bank.id === id)?.name ?? "";
}

export function getBankAlias(id: string) {
  return bankAccounts.find((bank) => bank.id === id)?.alias ?? getBankName(id);
}
