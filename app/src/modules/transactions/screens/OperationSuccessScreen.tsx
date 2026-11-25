import {
  GIFT_ICON,
  PIGGY_PEEK,
  PIGGY_SUCCESS,
} from "@/modules/transactions/constants/operation-success-screen.const";
import { useOperationSuccessScreen } from "@/modules/transactions/hooks/useOperationSuccessScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppScreen } from "@/shared/components/app-screen";
import { PrimaryButton } from "@/shared/components/primary-button";
import { formatMoney } from "@/shared/types/currency.types";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export function OperationSuccessScreen() {
  const { operation, handleReturnHome } = useOperationSuccessScreen();

  if (!operation?.submitted) {
    return (
      <AppScreen title="No hay una constancia enviada">
        <PrimaryButton onPress={handleReturnHome}>IR A INICIO</PrimaryButton>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <View className="flex-1 justify-center gap-4 py-4">
        <AnimatedEntry delay={0}>
          <View className="rounded-xl border border-line-soft bg-white px-5 pb-6 pt-7">
            <View className="mb-5 items-center">
              <Image
                accessibilityLabel="Constancia enviada"
                contentFit="contain"
                source={PIGGY_SUCCESS}
                style={{ width: 108, height: 108 }}
              />
            </View>

            <Text className="mb-4 text-center text-xl font-brand-bold text-ink">
              ¡Constancia enviada!
            </Text>

            <View className="gap-3 border-t border-line-soft pt-4">
              <DataRow label="Código Kambista" value={operation.code} />
              <Text className="font-brand text-xs leading-4 text-muted">
                Código de referencia de tu operación.
              </Text>
              <DataRow
                label="Monto a recibir"
                value={formatMoney(operation.exchange, operation.destination)}
              />
            </View>
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={120}>
          <View
            className="relative mt-2 h-[112px] flex-row items-center justify-center overflow-hidden rounded-xl px-[72px]"
            style={{
              backgroundColor: "#f0979e",
              backgroundImage:
                "linear-gradient(105deg, #b28fd9 0%, #f0979e 54%, #fcc48c 100%)",
            }}
          >
            <Image
              contentFit="contain"
              source={PIGGY_PEEK}
              style={{
                position: "absolute",
                left: -15,
                bottom: -15,
                width: 88,
                height: 88,
              }}
            />
            <View className="items-center py-2">
              <View className="flex-row items-center justify-center gap-1.5">
                <Text className="text-xs font-brand-bold text-ink">
                  Disfruta de
                </Text>
                <View
                  className="rounded-full px-2.5 py-1"
                  style={{
                    backgroundColor: "#fcc832",
                    shadowColor: "#663c42",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.22,
                    shadowRadius: 3,
                    elevation: 3,
                  }}
                >
                  <Text className="text-xs font-brand-bold text-ink">
                    descuentos{" "}
                  </Text>
                </View>
              </View>
              <Text className="mt-1 text-center text-xs font-brand-bold text-ink">
                en los{" "}
                <Text className="text-white">mejores{"\n"}comercios</Text>
              </Text>
            </View>
            <Image
              contentFit="contain"
              source={GIFT_ICON}
              style={{
                position: "absolute",
                right: -10,
                bottom: -12,
                width: 76,
                height: 84,
              }}
            />
          </View>
        </AnimatedEntry>

        <AnimatedEntry delay={200} className="gap-5 pt-1">
          <Text className="font-brand text-center text-sm leading-5 text-muted">
            Tu constancia quedó registrada en esta sesión de demostración.
          </Text>
          <PrimaryButton onPress={handleReturnHome}>
            VOLVER A INICIO
          </PrimaryButton>
        </AnimatedEntry>
      </View>
    </AppScreen>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-0.5">
      <Text className="text-xs font-brand-bold text-muted">{label}</Text>
      <Text className="text-sm font-brand-bold text-ink">{value}</Text>
    </View>
  );
}
