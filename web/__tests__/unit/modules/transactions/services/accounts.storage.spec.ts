import { expect, it } from 'vitest';
import { readAccounts, writeAccounts } from '~/modules/transactions/services/accounts.storage';
it('preserva cuentas, ceros iniciales y aislamiento por usuario', () => {
  const map = new Map<string, string>();
  const storage = {
    getItem: (key: string) => map.get(key) || null,
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
  const account = {
    id: 'demo',
    bankId: '1',
    accountType: 'AHORRO' as const,
    currency: 'PEN' as const,
    accountNumber: '0012345678',
  };

  writeAccounts(storage, 'demo@kambista.com', [account]);
  expect(readAccounts(storage, 'demo@kambista.com')).toEqual([account]);
  expect(readAccounts(storage, 'other@example.com')).toEqual([]);
  map.set('kambista.accounts.v1:demo@kambista.com', 'invalid');
  expect(readAccounts(storage, 'demo@kambista.com')).toEqual([]);
});
