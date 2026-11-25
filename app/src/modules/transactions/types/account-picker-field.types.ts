import type { SavedBankAccount } from "@/modules/transactions/schemas/bank-account.schema";
import type { Currency } from "@/shared/types/currency.types";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
export type AccountPickerFieldProps<TForm extends FieldValues> = {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label: string;
  currency: Currency;
  accounts: SavedBankAccount[];
  onAddAccount: () => void;
};
