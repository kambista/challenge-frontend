import { BANK_OPTIONS } from '../constants/options';

export function bankName(id: string): string {
  return BANK_OPTIONS.find((bank) => bank.value === id)?.label || '';
}
