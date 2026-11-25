import { SUCCESS_ILLUSTRATION } from "@/modules/onboarding/constants/registration-success-screen.const";
import { useRegistrationSuccessScreen } from "@/modules/onboarding/hooks/useRegistrationSuccessScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppScreen } from "@/shared/components/app-screen";
import { PrimaryButton } from "@/shared/components/primary-button";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export function RegistrationSuccessScreen() {
  const { firstName, handleContinue } = useRegistrationSuccessScreen();

  const header = (
    <View className="min-h-14 items-center justify-center px-6">
      <Text
        accessibilityRole="header"
        className="text-center font-brand-semibold text-sm text-ink"
      >
        Perfil creado con éxito
      </Text>
    </View>
  );

  return (
    <AppScreen backgroundClassName="bg-white" header={header}>
      <View className="flex-1 items-center justify-center py-8">
        <AnimatedEntry delay={0} className="items-center">
          <Image
            contentFit="contain"
            source={SUCCESS_ILLUSTRATION}
            style={{ width: 152, height: 184 }}
          />
        </AnimatedEntry>

        <AnimatedEntry delay={120} className="mt-7 items-center px-2">
          <Text className="text-center text-xl font-brand-bold leading-6 text-ink">
            {firstName
              ? `¡Felicitaciones ${firstName}, tu perfil ha sido creado!`
              : "¡Felicitaciones, tu perfil ha sido creado!"}
          </Text>
          <Text className="font-brand mt-4 text-center text-sm leading-5 text-muted">
            Ya puedes empezar a{" "}
            <Text className="font-brand italic">Kambiar</Text> con la mejor tasa
            del mercado
          </Text>
        </AnimatedEntry>

        <AnimatedEntry delay={220} className="mt-10 w-full">
          <PrimaryButton onPress={handleContinue}>CONTINUAR</PrimaryButton>
        </AnimatedEntry>
      </View>
    </AppScreen>
  );
}
