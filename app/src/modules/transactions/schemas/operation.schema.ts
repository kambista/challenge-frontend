import {
  BANK_OPTIONS,
  FUND_OPTIONS,
} from "@/modules/transactions/constants/options.const";
import * as yup from "yup";

export const operationSchema = yup.object({
  bankId: yup
    .string()
    .oneOf(
      BANK_OPTIONS.map((bank) => bank.value),
      "Selecciona el banco de envío",
    )
    .required("Selecciona el banco de envío"),
  destinationAccountId: yup
    .string()
    .required("Selecciona una cuenta de destino"),
  sourceFundsId: yup
    .string()
    .oneOf(
      FUND_OPTIONS.map((fund) => fund.value),
      "Selecciona el origen de fondos",
    )
    .required("Selecciona el origen de fondos"),
});

export type OperationFormValues = yup.InferType<typeof operationSchema>;
