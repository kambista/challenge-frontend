import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
export type SelectOption = {
  value: string;
  label: string;
};

export type FormSelectFieldProps<TForm extends FieldValues> = {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label: string;
  sheetTitle?: string;
  options: readonly SelectOption[];
  placeholder?: string;
};
