import * as yup from "yup";

export const MAX_VOUCHER_SIZE = 10 * 1024 * 1024;
const allowedExtension = /\.(png|jpe?g|webp|pdf|docx?)$/i;

export const voucherSchema = yup.object({
  fileName: yup
    .string()
    .required("Selecciona tu constancia")
    .matches(allowedExtension, "Selecciona una imagen, PDF o Word"),
  fileSize: yup
    .number()
    .nullable()
    .defined()
    .test(
      "known-size",
      "No pudimos verificar el tamaño. Selecciona otro archivo.",
      (size, context) =>
        !context.parent.fileName ||
        (typeof size === "number" && Number.isFinite(size) && size >= 0),
    )
    .test(
      "maximum-size",
      "El archivo debe pesar como máximo 10 MB",
      (size) => size === null || size === undefined || size <= MAX_VOUCHER_SIZE,
    ),
});

export type VoucherFormValues = yup.InferType<typeof voucherSchema>;
