import { OperationProgress } from "@/modules/transactions/components/OperationProgress";
import {
  getBankAlias,
  KAMBISTA_DEMO_ACCOUNT,
} from "@/modules/transactions/constants/options.const";
import { WALLET_ILLUSTRATION } from "@/modules/transactions/constants/transfer-screen.const";
import { useTransferScreen } from "@/modules/transactions/hooks/useTransferScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppIcon } from "@/shared/components/app-icon";
import { AppScreen } from "@/shared/components/app-screen";
import { NoticeCard } from "@/shared/components/notice-card";
import { PrimaryButton } from "@/shared/components/primary-button";
import { formatMoney } from "@/shared/types/currency.types";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

export function TransferScreen() {
  const {
    operation,
    copiedField,
    copyError,
    handleConfirmTransfer,
    handleCopy,
    handleReturnToHome,
    handleReturnToDetails,
  } = useTransferScreen();

  if (!operation) {
    return (
      <AppScreen title="No hay una operación activa">
        <PrimaryButton onPress={handleReturnToHome}>IR A INICIO</PrimaryButton>
      </AppScreen>
    );
  }

  const amountFormatted = formatMoney(operation.amount, operation.origin);

  return (
    <AppScreen
      header={<OperationProgress onBack={handleReturnToDetails} step={2} />}
    >
      <AnimatedEntry delay={0} className="gap-4">
        <View className="rounded-xl border border-line-soft bg-white px-5 py-6">
          <View className="mb-4 items-center">
            <Image
              accessibilityLabel="Transfiere a Kambista"
              contentFit="contain"
              source={WALLET_ILLUSTRATION}
              style={{ width: 92, height: 84 }}
            />
          </View>

          <Text className="font-brand mb-5 text-sm leading-5 text-ink">
            Estos datos son de demostración. Confirma el paso para continuar con
            la simulación.
          </Text>

          <View className="gap-3.5 rounded-lg border border-line p-4">
            <DataRow label="Banco" value={getBankAlias(operation.bankId)} />
            <CopyableDataRow
              copied={copiedField === "Monto"}
              label="Monto"
              onCopy={() => handleCopy("Monto", operation.amount.toFixed(2))}
              value={amountFormatted}
            />
            <CopyableDataRow
              copied={copiedField === "Número de cuenta"}
              label="Número de cuenta"
              onCopy={() =>
                handleCopy("Número de cuenta", KAMBISTA_DEMO_ACCOUNT.number)
              }
              value={KAMBISTA_DEMO_ACCOUNT.number}
            />
            <CopyableDataRow
              copied={copiedField === "RUC"}
              label="RUC"
              onCopy={() => handleCopy("RUC", KAMBISTA_DEMO_ACCOUNT.ruc)}
              value={KAMBISTA_DEMO_ACCOUNT.ruc}
            />
            <DataRow
              label="Titular de la cuenta"
              value={KAMBISTA_DEMO_ACCOUNT.holder}
            />
            <DataRow
              label="Tipo de cuenta"
              value={KAMBISTA_DEMO_ACCOUNT.type}
            />
          </View>

          {copiedField ? (
            <Text
              accessibilityLiveRegion="polite"
              className="mt-3 text-center text-xs font-brand-semibold text-success"
            >
              {copiedField} copiado al portapapeles
            </Text>
          ) : null}

          {copyError ? (
            <View className="mt-3">
              <NoticeCard tone="warning">{copyError}</NoticeCard>
            </View>
          ) : null}
        </View>

        <View className="mt-2">
          <PrimaryButton onPress={handleConfirmTransfer}>
            YA HICE MI TRANSFERENCIA
          </PrimaryButton>
        </View>
      </AnimatedEntry>
    </AppScreen>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="gap-0.5">
      <Text className="text-xs font-brand-medium text-muted">{label}</Text>
      <Text className="text-sm font-brand-bold text-ink">{value}</Text>
    </View>
  );
}

function CopyableDataRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <View className="gap-0.5">
      <Text className="text-xs font-brand-medium text-muted">{label}</Text>
      <View className="flex-row items-center gap-3">
        <Text className="text-sm font-brand-bold text-ink">{value}</Text>
        <Pressable
          accessibilityLabel={`Copiar ${label}`}
          accessibilityRole="button"
          className="p-1 active:opacity-60"
          hitSlop={8}
          onPress={onCopy}
        >
          <AppIcon
            color={copied ? "#05be50" : "#686868"}
            name={copied ? "check" : "copy"}
            size={16}
          />
        </Pressable>
      </View>
    </View>
  );
}
