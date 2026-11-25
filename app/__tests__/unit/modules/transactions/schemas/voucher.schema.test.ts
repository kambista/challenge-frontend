import {
  MAX_VOUCHER_SIZE,
  voucherSchema,
} from "@/modules/transactions/schemas/voucher.schema";
test.each(["png", "jpg", "jpeg", "webp", "pdf", "doc", "docx"])(
  "acepta %s de 10 MB exactos",
  async (extension) => {
    const fileName = "constancia." + extension;
    expect(
      await voucherSchema.isValid({ fileName, fileSize: MAX_VOUCHER_SIZE }),
    ).toBe(true);
    expect(
      await voucherSchema.isValid({ fileName, fileSize: MAX_VOUCHER_SIZE + 1 }),
    ).toBe(false);
  },
);

test("rechaza archivos ejecutables y tamaños desconocidos", async () => {
  expect(
    await voucherSchema.isValid({ fileName: "constancia.exe", fileSize: 12 }),
  ).toBe(false);
  expect(
    await voucherSchema.isValid({ fileName: "constancia.pdf", fileSize: null }),
  ).toBe(false);
});
