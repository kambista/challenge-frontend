import { AppIcon } from "@/shared/components/app-icon";
import { SelectionSheet } from "@/shared/components/selection-sheet";
import { useState } from "react";
import { useController, type FieldValues } from "react-hook-form";
import { FlatList, Pressable, Text, View } from "react-native";
import { FormSelectFieldProps } from "./form-select-field.types";

export function FormSelectField<TForm extends FieldValues>({
  control,
  name,
  label,
  sheetTitle,
  options,
  placeholder = "Selecciona",
}: FormSelectFieldProps<TForm>) {
  const [open, setOpen] = useState(false);

  function handleOpenPicker() {
    setOpen(true);
  }

  function handleClosePicker() {
    setOpen(false);
  }

  const { field, fieldState } = useController({ control, name: name });

  const selected = options.find((option) => option.value === field.value);

  function handleSelectOption(value: string) {
    field.onChange(value);
    handleClosePicker();
  }

  return (
    <View className="gap-1.5">
      <Text className="text-sm font-brand-medium text-muted">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open }}
        className={`min-h-12 flex-row items-center justify-between rounded-lg border bg-white px-4 ${
          fieldState.error ? "border-danger" : "border-line"
        }`}
        onBlur={field.onBlur}
        onPress={handleOpenPicker}
      >
        <Text
          className={`flex-1 text-sm font-brand-medium ${selected ? "text-ink" : "text-muted-light"}`}
          numberOfLines={1}
        >
          {selected?.label ?? placeholder}
        </Text>
        <AppIcon color="#686868" name="chevron-down" size={18} />
      </Pressable>
      {fieldState.error?.message ? (
        <Text accessibilityRole="alert" className="text-xs text-danger">
          {fieldState.error.message}
        </Text>
      ) : null}
      <SelectionSheet
        onClose={handleClosePicker}
        title={sheetTitle ?? label}
        visible={open}
      >
        <FlatList
          data={options}
          keyExtractor={(option) => option.value}
          renderItem={({ item }) => {
            const isSelected = item.value === field.value;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                className={`flex-row items-center justify-between px-6 py-4 ${
                  isSelected ? "bg-canvas" : "active:bg-canvas"
                }`}
                onPress={() => handleSelectOption(item.value)}
              >
                <Text
                  className={`flex-1 text-base ${
                    isSelected
                      ? "font-brand-bold text-ink"
                      : "font-brand-medium text-ink-light"
                  }`}
                >
                  {item.label}
                </Text>
                {isSelected ? (
                  <AppIcon color="#00e3c2" name="check" size={18} />
                ) : null}
              </Pressable>
            );
          }}
        />
      </SelectionSheet>
    </View>
  );
}
