import {
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import type { TextInputProps } from "react-native";
export type FormTextFieldProps<TForm extends FieldValues> = {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  multiline?: boolean;
  maxLength?: number;
};
