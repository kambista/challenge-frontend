import {
  loginSchema,
  type LoginFormValues,
} from "@/modules/auth/schemas/login.schema";
import { signIn } from "@/modules/auth/services/auth.service";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
import type { ServiceError } from "@/shared/types/service.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function useLoginScreen() {
  const router = useRouter();
  const startSession = useAuthStore((state) => state.startSession);
  const [serviceError, setServiceError] = useState<ServiceError | null>(null);
  const [dialog, setDialog] = useState<"help" | "register" | null>(null);
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });
  async function handleLogin(values: LoginFormValues) {
    setServiceError(null);
    let result: Awaited<ReturnType<typeof signIn>>;
    try {
      result = await signIn(values);
    } catch {
      setServiceError({
        name: "SERVER_ERROR",
        title: "No pudimos iniciar sesión",
        message: "Intenta nuevamente.",
      });
      return;
    }
    if (!result.success) {
      setServiceError(result.data);
      return;
    }

    startSession(values.email);
    router.replace("/register");
  }
  function handleOpenHelp() {
    setDialog("help");
  }
  function handleCloseDialog() {
    setDialog(null);
  }
  function handleOpenRegistration() {
    setDialog("register");
  }
  const onSubmit = handleSubmit(handleLogin);
  return {
    serviceError,
    dialog,
    control,
    formState,
    handleOpenHelp,
    handleCloseDialog,
    handleOpenRegistration,
    onSubmit,
  };
}
