import { z } from 'zod';

const numeric = z
  .union([
    z.number(),
    z
      .string()
      .trim()
      .regex(/^-?\d+(?:\.\d+)?$/)
      .transform(Number),
  ])
  .pipe(z.number().finite());

export const ratesSchema = z.object({
  bid: numeric.pipe(z.number().positive()),
  ask: numeric.pipe(z.number().positive()),
});

export const calculationSchema = z.object({
  exchange: numeric.pipe(z.number().nonnegative()),
  rate: numeric.pipe(z.number().positive()),
  savings: z.object({ amount: numeric, currency: z.string().optional() }).nullable().optional(),
});
