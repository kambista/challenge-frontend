import { BANK_OPTIONS } from "@/modules/transactions/constants/options.const";
import * as yup from "yup";

export const bankAccountSchema = yup.object({
  bankId: yup
    .string()
    .oneOf(
      BANK_OPTIONS.map((bank) => bank.value),
      "Selecciona una entidad financiera",
    )
    .required("Selecciona una entidad financiera"),
  accountType: yup
    .mixed<"AHORRO" | "CORRIENTE">()
    .oneOf(["AHORRO", "CORRIENTE"], "Selecciona el tipo de cuenta")
    .required("Selecciona el tipo de cuenta"),
  currency: yup.mixed<"PEN" | "USD">().oneOf(["PEN", "USD"]).required(),
  accountNumber: yup
    .string()
    .trim()
    .matches(/^\d+$/, "Ingresa un número de cuenta de solo dígitos")
    .required("Ingresa tu número de cuenta"),
  alias: yup
    .string()
    .trim()
    .max(60, "Usa un alias de hasta 60 caracteres")
    .default(""),
  owned: yup
    .boolean()
    .oneOf([true], "Debes declarar que la cuenta está a tu nombre")
    .required(),
});

export type BankAccountFormValues = yup.InferType<typeof bankAccountSchema>;

export type SavedBankAccount = Omit<BankAccountFormValues, "owned"> & {
  id: string;
};
