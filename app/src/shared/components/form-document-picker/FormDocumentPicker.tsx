import { Image } from "expo-image";
import { useController, type FieldValues } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { UPLOAD_ICON } from "./document-picker.const";
import type {
  FormDocumentPickerProps,
  SelectedDocument,
} from "./document-picker.types";
import { useDocumentPicker } from "./useDocumentPicker";

export function FormDocumentPicker<TForm extends FieldValues>({
  control,
  name,
  label,
  accessibilityLabel,
  description,
  acceptedTypes,
  onFileSizeChange,
  sizeError,
}: FormDocumentPickerProps<TForm>) {
  const { field, fieldState } = useController({ control, name });
  const { pickerError, handleChooseFile } = useDocumentPicker(
    handleSelection,
    acceptedTypes,
  );
  function handleSelection(file: SelectedDocument) {
    field.onChange(file.name);
    onFileSizeChange(file.size);
  }
  return (
    <View className="gap-2.5 rounded-xl border border-line-soft p-4">
      <Text className="text-sm font-brand-medium text-ink">{label}</Text>
      <Pressable
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        className={`min-h-12 flex-row items-center justify-between gap-3 rounded-lg border bg-white px-4 active:opacity-80 ${
          fieldState.error || sizeError ? "border-danger" : "border-line"
        }`}
        onBlur={field.onBlur}
        onPress={handleChooseFile}
      >
        <Text
          className={`flex-1 text-sm ${field.value ? "font-brand-medium text-ink" : "text-muted"}`}
          numberOfLines={1}
        >
          {typeof field.value === "string" && field.value
            ? field.value
            : "Selecciona archivo"}
        </Text>
        <Image
          contentFit="contain"
          source={UPLOAD_ICON}
          style={{ width: 24, height: 24 }}
        />
      </Pressable>
      <Text className="font-brand text-[11px] text-muted">{description}</Text>
      {fieldState.error?.message || sizeError ? (
        <Text accessibilityRole="alert" className="text-xs text-danger">
          {fieldState.error?.message || sizeError}
        </Text>
      ) : null}
      {pickerError ? (
        <Text accessibilityRole="alert" className="text-xs text-danger">
          {pickerError}
        </Text>
      ) : null}
    </View>
  );
}
