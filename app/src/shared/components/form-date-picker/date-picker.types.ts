import type { Control, FieldPath, FieldValues } from "react-hook-form";

export type FormDatePickerProps<TForm extends FieldValues> = {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label: string;
  minimumDate?: Date;
  maximumDate?: Date;
  initialDate?: Date;
};

export type DatePickerOptions = {
  value: unknown;
  onChange: (value: string) => void;
  onBlur: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  initialDate?: Date;
};
