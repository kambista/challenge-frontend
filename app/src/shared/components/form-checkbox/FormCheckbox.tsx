import { AppIcon } from "@/shared/components/app-icon";
import { useController, type FieldValues } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { FormCheckboxProps } from "./form-checkbox.types";

export function FormCheckbox<TForm extends FieldValues>({
  control,
  name,
  label,
  children,
}: FormCheckboxProps<TForm>) {
  const { field, fieldState } = useController({ control, name: name });
  const checked = Boolean(field.value);
  function handleToggleCheckbox() {
    field.onChange(!checked);
  }

  return (
    <View className="gap-1">
      <View className="flex-row items-center">
        <Pressable
          accessibilityLabel={label}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          className={
            children
              ? "h-12 w-12 items-center justify-center"
              : "min-h-12 flex-1 flex-row items-center gap-2.5"
          }
          onPress={handleToggleCheckbox}
        >
          <View
            className={`h-4 w-4 items-center justify-center rounded border ${
              checked
                ? "border-ink bg-ink"
                : fieldState.error
                  ? "border-danger bg-white"
                  : "border-muted bg-white"
            }`}
          >
            {checked ? (
              <AppIcon color="#ffffff" name="check" size={12} />
            ) : null}
          </View>
          {!children ? (
            <Text className="flex-1 font-brand text-xs leading-5 text-ink">
              {label}
            </Text>
          ) : null}
        </Pressable>
        {children ? <View className="flex-1">{children}</View> : null}
      </View>
      {fieldState.error?.message ? (
        <Text accessibilityRole="alert" className="text-xs text-danger">
          {fieldState.error.message}
        </Text>
      ) : null}
    </View>
  );
}
