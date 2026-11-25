import { OperationProgress } from "@/modules/transactions/components/OperationProgress";
import { VOUCHER_ILLUSTRATION } from "@/modules/transactions/constants/voucher-screen.const";
import { useVoucherScreen } from "@/modules/transactions/hooks/useVoucherScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppScreen } from "@/shared/components/app-screen";
import { FormDocumentPicker } from "@/shared/components/form-document-picker";
import { NoticeCard } from "@/shared/components/notice-card";
import { PrimaryButton } from "@/shared/components/primary-button";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { ACCEPTED_TYPES } from "../constants/form-document-picker.const";

export function VoucherScreen() {
  const {
    operation,
    control,
    formState,
    handleFileSizeChange,
    onSubmit,
    handleReturnToHome,
    handleReturnToTransfer,
  } = useVoucherScreen();

  if (!operation?.transferred) {
    return (
      <AppScreen title="No hay una transferencia por confirmar">
        <View className="gap-4">
          <NoticeCard tone="warning">
            Completa primero los datos de tu operación y confirma la
            transferencia.
          </NoticeCard>
          <PrimaryButton onPress={handleReturnToHome}>
            IR A INICIO
          </PrimaryButton>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      header={<OperationProgress onBack={handleReturnToTransfer} step={3} />}
    >
      <AnimatedEntry delay={0} className="gap-5">
        <View className="gap-5 rounded-xl border border-line-soft bg-white p-5 pb-6">
          <View className="items-center">
            <Image
              accessibilityLabel="Adjunta tu constancia"
              contentFit="contain"
              source={VOUCHER_ILLUSTRATION}
              style={{ width: 124, height: 84 }}
            />
          </View>

          <Text className="font-brand text-sm leading-5 text-ink">
            Adjunta la constancia de tu transferencia para poder verificar tu
            operación.
          </Text>

          <FormDocumentPicker
            name="fileName"
            label="Sube el archivo de tu constancia"
            accessibilityLabel="Seleccionar constancia de transferencia"
            description="Tamaño máximo permitido del archivo 10 MB"
            acceptedTypes={ACCEPTED_TYPES}
            control={control}
            onFileSizeChange={handleFileSizeChange}
            sizeError={formState.errors.fileSize?.message}
          />

          <View className="gap-1.5">
            <Text className="font-brand text-xs text-muted">Recuerda:</Text>
            <Text className="font-brand text-xs leading-4 text-muted">
              • El voucher enviado debe tener el{" "}
              <Text className="font-brand-bold text-ink">
                monto, datos del beneficiario, fecha y hora.
              </Text>
            </Text>
            <Text className="font-brand text-xs leading-4 text-muted">
              • El voucher debe ser legible
            </Text>
            <Text className="font-brand text-xs leading-4 text-muted">
              • Archivos permitidos{" "}
              <Text className="font-brand-bold text-ink">
                imágenes, word y PDF
              </Text>
            </Text>
          </View>
        </View>

        <PrimaryButton
          disabled={!formState.isValid || operation.submitted}
          loading={formState.isSubmitting}
          onPress={onSubmit}
        >
          ENVIAR CONSTANCIA
        </PrimaryButton>
      </AnimatedEntry>
    </AppScreen>
  );
}
