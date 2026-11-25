import { computed, shallowRef } from 'vue';
import { useSession } from '~/shared/composables/useSession';
import { readAccounts, writeAccounts } from '../services/accounts.storage';
import type { SavedAccount, BankAccountFormValues } from '../types/bankAccount.types';
import { bankAccountFormSchema } from '../schemas/bankAccount.schema';
export function useBankAccounts() {
  const { session } = useSession();
  const accounts = useState<SavedAccount[]>('bank-accounts', () => []);
  const owner = useState('accounts-owner', () => '');
  const storageError = shallowRef('');

  if (import.meta.client && owner.value !== session.value.email) {
    owner.value = session.value.email;
    try {
      accounts.value = readAccounts(localStorage, owner.value);
    } catch {
      accounts.value = [];
    }
  }

  function addAccount(values: BankAccountFormValues): SavedAccount | null {
    storageError.value = '';
    const parsed = bankAccountFormSchema.parse(values);
    const account: SavedAccount = {
      bankId: parsed.bankId,
      accountType: parsed.accountType,
      currency: parsed.currency,
      accountNumber: parsed.accountNumber,
      alias: parsed.alias || '',
      id: crypto.randomUUID(),
    };
    try {
      writeAccounts(localStorage, session.value.email, [...accounts.value, account]);
    } catch {
      storageError.value =
        'No pudimos guardar la cuenta. Habilita el almacenamiento del navegador e intenta nuevamente.';
      return null;
    }
    accounts.value = [...accounts.value, account];
    return account;
  }
  return { accounts: computed(() => accounts.value), addAccount, storageError };
}
