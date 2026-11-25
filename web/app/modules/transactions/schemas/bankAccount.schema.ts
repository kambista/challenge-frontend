import { z } from 'zod';
import { CURRENCIES } from '~/shared/constants/currencies';
import { BANK_OPTIONS } from '../constants/options';
export const bankAccountSchema = z.object({
  bankId: z
    .string()
    .refine(
      (id) => BANK_OPTIONS.some((bank) => bank.value === id),
      'Selecciona una entidad financiera',
    ),
  accountType: z.enum(['AHORRO', 'CORRIENTE'], { error: 'Selecciona el tipo de cuenta' }),
  currency: z.enum(CURRENCIES),
  accountNumber: z.string().trim().regex(/^\d+$/, 'Ingresa un número de cuenta de solo dígitos'),
  alias: z.string().trim().max(60, 'Usa un alias de hasta 60 caracteres').optional(),
});
export const bankAccountFormSchema = bankAccountSchema.extend({
  owned: z.boolean().refine(Boolean, 'Debes declarar que la cuenta está a tu nombre'),
});
export const savedAccountSchema = bankAccountSchema.extend({ id: z.string().min(1) });
export const accountStoreSchema = z.object({
  version: z.literal(1),
  accounts: z.array(savedAccountSchema),
});
