import type { ReactNode } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
export type FormCheckboxProps<TForm extends FieldValues> = {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label?: string;
  children?: ReactNode;
};
