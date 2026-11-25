import banks from '@mocks/bankAccounts.json';
import funds from '@mocks/sourceFunds.json';
export const BANK_OPTIONS = banks.map((bank) => ({ value: bank.id, label: bank.alias }));
export const FUND_OPTIONS = funds.map((fund) => ({ value: fund.id, label: fund.name }));
export const ACCOUNT_TYPES = [
  { value: 'AHORRO', label: 'Ahorros' },
  { value: 'CORRIENTE', label: 'Corriente' },
] as const;
export { bankName } from '../utils/bank';
export const KAMBISTA_DEMO_ACCOUNT = {
  number: '20101000000000',
  ruc: '20601708141',
  holder: 'Kambista SAC',
  type: 'Corriente',
} as const;
