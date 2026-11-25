import type { ServiceResult } from "@/modules/auth";
import type { ProfileFormValues } from "@/modules/onboarding/schemas/profile.schema";

export async function createProfile(
  values: ProfileFormValues,
): Promise<ServiceResult> {
  if (values.documentType === "DNI" && values.documentNumber === "12345678") {
    return {
      success: false,
      data: {
        name: "DUPLICATE_DNI",
        title: "DNI en uso",
        message: "El número de documento registrado ya está en uso.",
      },
    };
  }

  if (values.phone === "999999999") {
    return {
      success: false,
      data: {
        name: "INVALID_PHONE",
        title: "Celular inválido",
        message: "El número de celular registrado ya está en uso.",
      },
    };
  }

  return { success: true };
}
