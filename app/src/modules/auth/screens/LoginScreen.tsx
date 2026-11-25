import { useLoginScreen } from "@/modules/auth/hooks/useLoginScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppDialog } from "@/shared/components/app-dialog";
import { AppScreen } from "@/shared/components/app-screen";
import { BrandLogo } from "@/shared/components/brand-logo";
import { FormTextField } from "@/shared/components/form-text-field";
import { PrimaryButton } from "@/shared/components/primary-button";
import { Pressable, Text, View } from "react-native";

export function LoginScreen() {
  const {
    serviceError,
    dialog,
    control,
    formState,
    handleOpenHelp,
    handleCloseDialog,
    handleOpenRegistration,
    onSubmit,
  } = useLoginScreen();

  return (
    <AppScreen backgroundClassName="bg-white">
      <View className="flex-1 justify-center py-6">
        <AnimatedEntry delay={0}>
          <View className="mb-10 items-center">
            <BrandLogo height={36} width={148} />
          </View>
          <Text className="mb-14 text-center text-xl font-brand-bold text-ink">
            Inicia sesión
          </Text>
        </AnimatedEntry>

        <AnimatedEntry delay={80}>
          <View className="gap-5">
            <FormTextField
              autoCapitalize="none"
              control={control}
              keyboardType="email-address"
              label="Correo electrónico"
              name="email"
              placeholder="Escribe tu correo"
            />
            <FormTextField
              autoCapitalize="none"
              control={control}
              label="Contraseña"
              name="password"
              placeholder="Escribe tu contraseña"
              secureTextEntry
            />
          </View>

          <View className="mt-2 flex-row flex-wrap items-center justify-between gap-x-3">
            <View
              accessible
              accessibilityLabel="Recordarme"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: false, disabled: true }}
              className="min-h-12 flex-row items-center gap-2"
            >
              <View className="h-4 w-4 rounded border border-line" />
              <Text className="font-brand text-xs text-muted">Recordarme</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              className="min-h-12 justify-center"
              onPress={handleOpenHelp}
            >
              <Text className="font-brand text-xs text-muted underline">
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>
          </View>

          {serviceError ? (
            <View
              accessibilityRole="alert"
              className="mt-4 rounded-lg bg-danger-soft px-4 py-3"
            >
              <Text className="text-xs font-brand-bold text-danger">
                {serviceError.title}
              </Text>
              <Text className="font-brand mt-0.5 text-xs text-danger">
                {serviceError.message}
              </Text>
            </View>
          ) : null}

          <View className="mt-12">
            <PrimaryButton
              disabled={!formState.isValid}
              loading={formState.isSubmitting}
              onPress={onSubmit}
            >
              INICIA SESIÓN
            </PrimaryButton>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={160}>
          <View className="mt-6 flex-row justify-center gap-1">
            <Text className="font-brand text-sm text-muted">
              ¿No tienes cuenta?
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleOpenRegistration}
            >
              <Text className="font-brand-bold text-sm text-ink underline">
                Regístrate aquí
              </Text>
            </Pressable>
          </View>
        </AnimatedEntry>
      </View>

      <AppDialog
        onClose={handleCloseDialog}
        title={
          dialog === "register" ? "Completa tu registro" : "¿Necesitas ayuda?"
        }
        visible={dialog !== null}
      >
        <Text className="font-brand text-sm leading-5 text-muted">
          {dialog === "register"
            ? "Inicia sesión para completar tu perfil en esta demostración."
            : "Si olvidaste tu contraseña, comunícate con soporte de Kambista al correo soporte@kambista.com."}
        </Text>
        <View className="mt-5">
          <PrimaryButton onPress={handleCloseDialog}>ENTENDIDO</PrimaryButton>
        </View>
      </AppDialog>
    </AppScreen>
  );
}
