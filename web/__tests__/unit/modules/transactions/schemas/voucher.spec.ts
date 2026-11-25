import { expect, it } from 'vitest';
import { voucherSchema } from '~/modules/transactions/schemas/operation.schema';
it('valida formato y peso de la constancia', () => {
  for (const name of ['voucher.png', 'voucher.pdf', 'voucher.doc', 'voucher.docx']) {
    expect(voucherSchema.safeParse({ file: new File(['demo'], name) }).success).toBe(true);
  }
  expect(voucherSchema.safeParse({ file: new File(['demo'], 'bad.exe') }).success).toBe(false);
  expect(
    voucherSchema.safeParse({
      file: new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.pdf'),
    }).success,
  ).toBe(false);
});
