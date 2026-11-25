import { ACCOUNTS_KEY } from '~/shared/constants/storage';
import { accountStoreSchema } from '../schemas/bankAccount.schema';
import type { SavedAccount } from '../types/bankAccount.types';
export interface AccountStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function accountStorageKey(email: string) {
  return ACCOUNTS_KEY + ':' + email.toLowerCase();
}
export function readAccounts(storage: AccountStorage, email: string): SavedAccount[] {
  try {
    const parsed = accountStoreSchema.safeParse(
      JSON.parse(storage.getItem(accountStorageKey(email)) || 'null'),
    );
    return parsed.success ? parsed.data.accounts : [];
  } catch {
    return [];
  }
}
export function writeAccounts(storage: AccountStorage, email: string, accounts: SavedAccount[]) {
  storage.setItem(
    accountStorageKey(email),
    JSON.stringify(accountStoreSchema.parse({ version: 1, accounts })),
  );
}
