import type { LoginFormValues } from "@/modules/auth/schemas/login.schema";
import type { ServiceResult } from "@/shared/types/service.types";

export type { ServiceError, ServiceResult } from "@/shared/types/service.types";

const DEMO_CREDENTIALS = {
  email: "demo@kambista.com",
  password: "Demo1234!",
} as const;

export async function signIn(values: LoginFormValues): Promise<ServiceResult> {
  const isValid =
    values.email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    values.password === DEMO_CREDENTIALS.password;

  if (!isValid) {
    return {
      success: false,
      data: {
        name: "SERVER_ERROR",
        title: "No pudimos iniciar sesión",
        message: "El correo o la contraseña no son correctos.",
      },
    };
  }

  return { success: true };
}
