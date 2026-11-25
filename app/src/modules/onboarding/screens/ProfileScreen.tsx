import { BirthDateField } from "@/modules/onboarding/components/BirthDateField";
import { LEGAL_CONTENT } from "@/modules/onboarding/constants/legal.const";
import { DOCUMENT_OPTIONS } from "@/modules/onboarding/constants/profile-screen.const";
import { useProfileScreen } from "@/modules/onboarding/hooks/useProfileScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppDialog } from "@/shared/components/app-dialog";
import { AppIcon } from "@/shared/components/app-icon";
import { AppScreen } from "@/shared/components/app-screen";
import { AppToast } from "@/shared/components/app-toast";
import { FormCheckbox } from "@/shared/components/form-checkbox";
import { FormSelectField } from "@/shared/components/form-select-field";
import { FormTextField } from "@/shared/components/form-text-field";
import { NoticeCard } from "@/shared/components/notice-card";
import { PrimaryButton } from "@/shared/components/primary-button";
import { Pressable, Text, View } from "react-native";

export function ProfileScreen() {
  const {
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
  } = useProfileScreen();

  const header = (
    <View className="min-h-14 flex-row items-center bg-white px-4">
      <Pressable
        accessibilityLabel="Volver"
        accessibilityRole="button"
        className="h-12 w-12 items-center justify-center"
        onPress={handleSignOut}
      >
        <AppIcon name="chevron-left" />
      </Pressable>
      <Text className="flex-1 text-center font-brand-bold text-sm text-ink">
        Completa tus datos
      </Text>
      <Pressable
        accessibilityLabel="Cerrar sesión"
        accessibilityRole="button"
        className="h-12 w-12 items-center justify-center"
        onPress={handleSignOut}
      >
        <AppIcon name="logout" />
      </Pressable>
    </View>
  );

  return (
    <AppScreen backgroundClassName="bg-white" header={header}>
      <AppToast
        message={serviceError?.message ?? ""}
        onDismiss={handleDismissError}
        title={serviceError?.title ?? "No pudimos guardar tus datos"}
        visible={Boolean(serviceError)}
      />

      <AnimatedEntry delay={0}>
        <Text className="mb-6 mt-4 text-center text-base font-brand-bold text-ink">
          Completa tus datos como figuran en tu documento de identidad
        </Text>
      </AnimatedEntry>

      <AnimatedEntry delay={80} className="gap-4">
        <FormTextField
          autoCapitalize="words"
          control={control}
          label="Nombres completos"
          name="firstName"
          placeholder="Escribe tus nombres y apellidos"
        />

        <View className="flex-row items-start gap-2.5">
          <View className="w-[38%]">
            <FormSelectField
              control={control}
              label="Documento"
              name="documentType"
              options={DOCUMENT_OPTIONS}
              sheetTitle="Tipo de documento"
            />
          </View>
          <View className="flex-1">
            <FormTextField
              autoCapitalize="characters"
              control={control}
              label="N° de documento"
              keyboardType={
                documentType === "PASAPORTE" ? "default" : "number-pad"
              }
              maxLength={
                documentType === "DNI" ? 8 : documentType === "CE" ? 9 : 15
              }
              name="documentNumber"
              placeholder="N° de documento"
            />
          </View>
        </View>

        <NoticeCard>
          Tu documento de identidad debe coincidir con tus datos para evitar
          inconvenientes al momento de hacer una primera operación
        </NoticeCard>

        <View className="flex-row items-start gap-2.5">
          <View className="flex-1">
            <FormTextField
              autoCapitalize="none"
              control={control}
              keyboardType="phone-pad"
              label="Celular"
              maxLength={9}
              name="phone"
              placeholder="N° de celular"
            />
          </View>
          <View className="flex-1">
            <BirthDateField control={control} />
          </View>
        </View>

        <View className="gap-0.5 pb-3">
          <FormCheckbox
            control={control}
            label="Acepto los términos y condiciones"
            name="acceptTerms"
          >
            <Text className="font-brand text-xs leading-5 text-ink">
              He leído y acepto los{" "}
              <Text
                accessibilityRole="link"
                className="font-brand-bold underline"
                onPress={handleOpenTerms}
              >
                Términos y condiciones
              </Text>
            </Text>
          </FormCheckbox>

          <FormCheckbox
            control={control}
            label="Acepto la política de tratamiento de datos personales"
            name="acceptPrivacy"
          >
            <Text className="font-brand text-xs leading-5 text-ink">
              Acepto de manera expresa e informada la{" "}
              <Text
                accessibilityRole="link"
                className="font-brand-bold underline"
                onPress={handleOpenPrivacy}
              >
                Política de Tratamiento de datos personales de Kambista
              </Text>
            </Text>
          </FormCheckbox>
        </View>

        <PrimaryButton
          disabled={!formState.isValid}
          loading={formState.isSubmitting}
          onPress={onSubmit}
        >
          REGISTRARME
        </PrimaryButton>
      </AnimatedEntry>

      <AppDialog
        onClose={handleCloseLegal}
        title={legalType ? LEGAL_CONTENT[legalType].title : ""}
        visible={Boolean(legalType)}
      >
        <View className="gap-3">
          {legalType
            ? LEGAL_CONTENT[legalType].paragraphs.map((paragraph) => (
                <Text key={paragraph} className="text-sm leading-5 text-muted">
                  {paragraph}
                </Text>
              ))
            : null}
        </View>
        <View className="mt-5">
          <PrimaryButton onPress={handleCloseLegal}>ENTENDIDO</PrimaryButton>
        </View>
      </AppDialog>
    </AppScreen>
  );
}
