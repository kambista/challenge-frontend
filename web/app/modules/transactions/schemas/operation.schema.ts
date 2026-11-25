import { z } from 'zod';
import { CURRENCIES } from '~/shared/constants/currencies';
import { BANK_OPTIONS, FUND_OPTIONS } from '../constants/options';
import { savedAccountSchema } from './bankAccount.schema';
export const quoteSchema = z
  .object({
    amount: z.number().finite().positive('Ingresa un monto mayor a cero'),
    origin: z.enum(CURRENCIES),
    destination: z.enum(CURRENCIES),
  })
  .refine((value) => value.origin !== value.destination, 'Selecciona monedas diferentes');
export const operationSchema = z.object({
  bankId: z
    .string()
    .refine((id) => BANK_OPTIONS.some((bank) => bank.value === id), 'Selecciona el banco de envío'),
  destinationAccountId: z.string().min(1, 'Selecciona la cuenta donde recibirás el dinero'),
  sourceFundsId: z
    .string()
    .refine(
      (id) => FUND_OPTIONS.some((fund) => fund.value === id),
      'Selecciona el origen de fondos',
    ),
});
export const snapshotSchema = z.object({
  amount: z.number().finite().positive(),
  origin: z.enum(CURRENCIES),
  destination: z.enum(CURRENCIES),
  exchange: z.number().finite().nonnegative(),
  rate: z.number().finite().positive(),
  savings: z.number().finite().nullable(),
  bankId: z.string().min(1),
  account: savedAccountSchema,
  sourceFundsId: z.string().min(1),
  code: z.string().min(1),
  transferred: z.boolean(),
  submitted: z.boolean(),
});
export const operationStateSchema = z.object({
  quote: snapshotSchema.nullable(),
  pendingQuote: snapshotSchema
    .pick({
      amount: true,
      origin: true,
      destination: true,
      exchange: true,
      rate: true,
      savings: true,
    })
    .nullable(),
});
export const voucherSchema = z.object({
  file: z
    .custom<File>(
      (value) => typeof File !== 'undefined' && value instanceof File,
      'Selecciona tu constancia',
    )
    .refine(
      (file) => !file || file.size <= 10 * 1024 * 1024,
      'El archivo debe pesar como máximo 10 MB',
    )
    .refine(
      (file) => !file || /\.(png|jpe?g|webp|pdf|docx?)$/i.test(file.name),
      'Selecciona una imagen, PDF o Word',
    ),
});
