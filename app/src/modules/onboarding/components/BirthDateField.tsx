import { FormDatePicker } from "@/shared/components/form-date-picker";
import type { Control } from "react-hook-form";
import type { ProfileFormValues } from "../schemas/profile.schema";

export function BirthDateField({
  control,
}: {
  control: Control<ProfileFormValues>;
}) {
  const today = new Date();
  const maximumDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return (
    <FormDatePicker
      control={control}
      name="birthDate"
      label="Fecha de nacimiento"
      minimumDate={new Date(1900, 0, 1)}
      maximumDate={maximumDate}
    />
  );
}
