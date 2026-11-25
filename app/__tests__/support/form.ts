import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export function useField<T extends FieldValues, N extends FieldPath<T>>(
  control: Control<T>,
  name: N,
) {
  return useController({ control, name }).field;
}
