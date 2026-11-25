import { AccountPickerField } from "@/modules/transactions/components/AccountPickerField";
import { OperationProgress } from "@/modules/transactions/components/OperationProgress";
import {
  BANK_OPTIONS,
  FUND_OPTIONS,
} from "@/modules/transactions/constants/options.const";
import { useOperationDetailsScreen } from "@/modules/transactions/hooks/useOperationDetailsScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppScreen } from "@/shared/components/app-screen";
import { FormSelectField } from "@/shared/components/form-select-field";
import { NoticeCard } from "@/shared/components/notice-card";
import { PrimaryButton } from "@/shared/components/primary-button";
import { formatMoney } from "@/shared/types/currency.types";
import { Text, View } from "react-native";

export function OperationDetailsScreen() {
  const {
    quote,
    formError,
    eligibleAccounts,
    control,
    formState,
    handleAddDestinationAccount,
    handleReturnToQuote,
    onSubmit,
  } = useOperationDetailsScreen();

  if (!quote) {
    return (
      <AppScreen title="No hay una cotización activa">
        <View className="gap-4">
          <NoticeCard tone="warning">
            Vuelve a cotizar para empezar una nueva operación.
          </NoticeCard>
          <PrimaryButton onPress={handleReturnToQuote}>
            IR A INICIO
          </PrimaryButton>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      header={<OperationProgress onBack={handleReturnToQuote} step={1} />}
    >
      <AnimatedEntry delay={0} className="gap-4">
        <View className="gap-2.5 rounded-xl border border-line-soft bg-white p-5">
          <DataRow
            label="Tú envías"
            value={formatMoney(quote.amount, quote.origin)}
          />
          <DataRow
            label="Tú recibes"
            value={formatMoney(quote.exchange, quote.destination)}
          />
          {quote.savings !== null ? (
            <DataRow
              label="Ahorro estimado"
              value={formatMoney(quote.savings, quote.destination)}
            />
          ) : null}
          <View className="mt-1 flex-row items-center justify-between border-t border-line-soft pt-3">
            <Text className="flex-1 text-sm font-brand-bold text-ink">
              Tipo de cambio utilizado
            </Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-sm font-brand-bold text-ink">
                {quote.rate.toFixed(3)}
              </Text>
            </View>
          </View>
        </View>

        <NoticeCard>
          Tiempo estimado de espera{" "}
          <Text className="font-brand-bold">
            BCP, Interbank, BanBif, Pichincha:
          </Text>{" "}
          15 minutos. <Text className="font-brand-bold">Otros bancos:</Text> 1
          día hábil
        </NoticeCard>

        <FormSelectField
          control={control}
          label="¿Desde qué banco nos envías tu dinero?"
          name="bankId"
          options={BANK_OPTIONS}
          sheetTitle="¿Desde que banco nos envías tu dinero?"
        />

        <AccountPickerField
          accounts={eligibleAccounts}
          control={control}
          currency={quote.destination}
          label="¿En qué cuenta deseas recibir tu dinero?"
          name="destinationAccountId"
          onAddAccount={handleAddDestinationAccount}
        />

        <NoticeCard tone="warning">
          Recuerda que las cuentas deben estar{" "}
          <Text className="font-brand-bold">a tu nombre.</Text> Kambista no
          transfiere a{" "}
          <Text className="font-brand-bold">cuentas de terceros</Text>
        </NoticeCard>

        <FormSelectField
          control={control}
          label="Origen de fondos"
          name="sourceFundsId"
          options={FUND_OPTIONS}
        />

        {formError ? <NoticeCard tone="warning">{formError}</NoticeCard> : null}

        <View className="mt-2">
          <PrimaryButton disabled={!formState.isValid} onPress={onSubmit}>
            CONTINUAR
          </PrimaryButton>
        </View>
      </AnimatedEntry>
    </AppScreen>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-3">
      <Text className="font-brand flex-1 text-sm text-ink-light">{label}</Text>
      <Text className="text-right text-sm font-brand-bold text-ink">
        {value}
      </Text>
    </View>
  );
}
