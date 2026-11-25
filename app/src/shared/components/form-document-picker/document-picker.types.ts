import type { Control, FieldPath, FieldValues } from "react-hook-form";

export type SelectedDocument = { name: string; size: number | null };

export type FormDocumentPickerProps<TForm extends FieldValues> = {
  control: Control<TForm>;
  name: FieldPath<TForm>;
  label: string;
  accessibilityLabel?: string;
  description?: string;
  acceptedTypes?: string[];
  onFileSizeChange: (size: number | null) => void;
  sizeError?: string;
};
