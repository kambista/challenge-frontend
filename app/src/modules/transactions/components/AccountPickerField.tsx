import { getBankAlias } from "@/modules/transactions/constants/options.const";
import { AccountPickerFieldProps } from "@/modules/transactions/types/account-picker-field.types";
import { useState } from "react";
import { useController, type FieldValues } from "react-hook-form";

import { AppIcon } from "@/shared/components/app-icon";
import { SelectionSheet } from "@/shared/components/selection-sheet";
import { FlatList, Pressable, Text, View } from "react-native";

export function AccountPickerField<TForm extends FieldValues>({
  control,
  name,
  label,
  currency,
  accounts,
  onAddAccount,
}: AccountPickerFieldProps<TForm>) {
  const [open, setOpen] = useState(false);
  
  function handleOpenPicker() {
    setOpen(true);
  }

  function handleClosePicker() {
    setOpen(false);
  }

  function handleAddAccount() {
    handleClosePicker();
    onAddAccount();
  }
  
  const { field, fieldState } = useController({ control, name: name });

  const selected = accounts.find((account) => account.id === field.value);

  function handleSelectAccount(id: string) {
    field.onChange(id);
    handleClosePicker();
  }
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-brand-medium text-muted">{label}</Text>
      <Pressable
        accessibilityLabel={label}
        accessibilityState={{ expanded: open }}
        accessibilityRole="button"
        className={`min-h-12 flex-row items-center justify-between rounded-lg border bg-white px-4 ${
          fieldState.error ? "border-danger" : "border-line"
        }`}
        onBlur={field.onBlur}
        onPress={handleOpenPicker}
      >
        <Text
          className={`flex-1 text-sm font-brand-medium ${
            selected ? "text-ink" : "text-muted-light"
          }`}
          numberOfLines={1}
        >
          {selected
            ? selected.alias || getBankAlias(selected.bankId)
            : "Selecciona"}
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
        title="Selecciona tu cuenta destino"
        visible={open}
      >
        {accounts.length === 0 ? (
          <View className="px-6 py-5">
            <Text className="font-brand text-sm text-muted">
              Aún no tienes cuentas en{" "}
              {currency === "PEN" ? "soles" : "dólares"}.
            </Text>
          </View>
        ) : (
          <FlatList
            data={accounts}
            keyExtractor={(account) => account.id}
            renderItem={({ item }) => {
              const isSelected = item.id === field.value;
              const accountTitle = `${item.alias || "Cuenta"} - ${getBankAlias(item.bankId)} - ${item.currency}`;
              const maskedNumber = `******${item.accountNumber.slice(-4)}`;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  className={`flex-row items-center justify-between border-b border-line-soft px-6 py-4 ${
                    isSelected ? "bg-canvas" : "active:bg-canvas"
                  }`}
                  onPress={() => handleSelectAccount(item.id)}
                >
                  <View className="flex-1">
                    <Text className="text-base font-brand-medium text-ink">
                      {accountTitle}
                    </Text>
                    <Text className="font-brand mt-0.5 text-sm text-muted">
                      {maskedNumber}
                    </Text>
                  </View>
                  {isSelected ? (
                    <AppIcon color="#00e3c2" name="check" size={18} />
                  ) : null}
                </Pressable>
              );
            }}
          />
        )}

        <Pressable
          accessibilityRole="button"
          className="flex-row items-center gap-4 px-6 pt-5 active:opacity-75"
          onPress={handleAddAccount}
        >
          <View className="h-10 w-10 items-center justify-center rounded-lg border-2 border-ink">
            <AppIcon color="#060f26" name="plus" size={20} />
          </View>
          <Text className="text-base font-brand-medium text-ink">
            Agregar cuenta
          </Text>
        </Pressable>
      </SelectionSheet>
    </View>
  );
}
