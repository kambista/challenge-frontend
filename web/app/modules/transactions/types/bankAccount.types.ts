import type { z } from 'zod';
import type {
  bankAccountSchema,
  bankAccountFormSchema,
  savedAccountSchema,
} from '../schemas/bankAccount.schema';
export type BankAccount = z.infer<typeof bankAccountSchema>;
export type BankAccountFormValues = z.infer<typeof bankAccountFormSchema>;
export type SavedAccount = z.infer<typeof savedAccountSchema>;
