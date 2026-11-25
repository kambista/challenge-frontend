import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { useController, type FieldValues } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { toInputValue } from "./form-text-field.helper";
import { FormTextFieldProps } from "./form-text-field.types";

export function FormTextField<TForm extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  keyboardType,
  autoCapitalize = "sentences",
  multiline = false,
  maxLength,
}: FormTextFieldProps<TForm>) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  function handleTogglePasswordVisibility() {
    setIsPasswordVisible((visible) => !visible);
  }
  const { field, fieldState } = useController({ control, name: name });

  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-sm font-brand-medium text-muted">{label}</Text>
      ) : null}
      <View
        className={`min-h-12 flex-row items-center rounded-lg border bg-white px-4 ${
          fieldState.error
            ? "border-danger"
            : isFocused
              ? "border-ink"
              : "border-line"
        } ${multiline ? "min-h-24 items-start py-2" : ""}`}
      >
        <TextInput
          accessibilityLabel={label ?? placeholder ?? String(name)}
          autoCapitalize={autoCapitalize}
          className="flex-1 border-0 bg-transparent py-2.5 text-sm font-brand-medium text-ink outline-none"
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          onBlur={() => {
            setIsFocused(false);
            field.onBlur();
          }}
          onFocus={() => setIsFocused(true)}
          ref={(instance) => field.ref(instance)}
          onChangeText={field.onChange}
          placeholder={placeholder}
          placeholderTextColor="#686868"
          style={{
            borderWidth: 0,
            outlineWidth: 0,
            ...(multiline ? { minHeight: 80 } : {}),
          }}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          textAlignVertical={multiline ? "top" : "center"}
          value={toInputValue(field.value)}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityLabel={
              isPasswordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            accessibilityRole="button"
            className="ml-2 h-12 w-12 items-center justify-center"
            onPress={handleTogglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff color="#686868" size={20} strokeWidth={1.8} />
            ) : (
              <Eye color="#686868" size={20} strokeWidth={1.8} />
            )}
          </Pressable>
        ) : null}
      </View>
      {fieldState.error?.message ? (
        <Text
          accessibilityRole="alert"
          className="font-brand text-xs text-danger"
        >
          {fieldState.error.message}
        </Text>
      ) : null}
    </View>
  );
}
