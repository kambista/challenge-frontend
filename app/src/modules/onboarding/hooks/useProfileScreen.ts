import { useAuthStore, type ServiceError } from "@/modules/auth";
import { type LegalType } from "@/modules/onboarding/constants/legal.const";
import {
  DOCUMENT_TYPES,
  profileSchema,
  type ProfileFormValues,
} from "@/modules/onboarding/schemas/profile.schema";
import { createProfile } from "@/modules/onboarding/services/profile.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export function useProfileScreen() {
  const router = useRouter();
  const completeProfile = useAuthStore((state) => state.completeProfile);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [serviceError, setServiceError] = useState<ServiceError | null>(null);
  const [legalType, setLegalType] = useState<LegalType | null>(null);

  const { control, handleSubmit, formState } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      documentType: DOCUMENT_TYPES[0],
      documentNumber: "",
      phone: "",
      birthDate: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const documentType = useWatch({ control, name: "documentType" });
  async function handleProfile(values: ProfileFormValues) {
    setServiceError(null);
    let result: Awaited<ReturnType<typeof createProfile>>;
    try {
      result = await createProfile(values);
    } catch {
      setServiceError({
        name: "SERVER_ERROR",
        title: "No pudimos guardar tus datos",
        message: "Intenta nuevamente en unos minutos.",
      });
      return;
    }
    if (!result.success) {
      setServiceError(result.data);
      return;
    }

    completeProfile(values.firstName);
    router.replace("/registration-success");
  }

  function handleSignOut() {
    clearSession();
    router.replace("/login");
  }

  function handleDismissError() {
    setServiceError(null);
  }

  function handleOpenTerms() {
    setLegalType("terms");
  }

  function handleOpenPrivacy() {
    setLegalType("privacy");
  }

  function handleCloseLegal() {
    setLegalType(null);
  }
  
  const onSubmit = handleSubmit(handleProfile);
  return {
    serviceError,
    legalType,
    control,
    formState,
    documentType,
    handleSignOut,
    handleDismissError,
    handleOpenTerms,
    handleOpenPrivacy,
    handleCloseLegal,
    onSubmit,
  };
}
