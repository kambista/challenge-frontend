import type { z } from 'zod';
import type {
  quoteSchema,
  operationSchema,
  voucherSchema,
  snapshotSchema,
  operationStateSchema,
} from '../schemas/operation.schema';
export type QuoteValues = z.infer<typeof quoteSchema>;
export type OperationValues = z.infer<typeof operationSchema>;
export type VoucherValues = z.infer<typeof voucherSchema>;
export type OperationSnapshot = z.infer<typeof snapshotSchema>;
export type OperationState = z.infer<typeof operationStateSchema>;
export type PendingQuote = NonNullable<OperationState['pendingQuote']>;
