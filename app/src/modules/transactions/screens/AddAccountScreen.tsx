import { CURRENCY_BUTTONS } from "@/modules/transactions/constants/add-account-screen.const";
import {
  ACCOUNT_TYPE_OPTIONS,
  BANK_OPTIONS,
} from "@/modules/transactions/constants/options.const";
import { useAddAccountScreen } from "@/modules/transactions/hooks/useAddAccountScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppIcon } from "@/shared/components/app-icon";
import { AppScreen } from "@/shared/components/app-screen";
import { FormCheckbox } from "@/shared/components/form-checkbox";
import { FormSelectField } from "@/shared/components/form-select-field";
import { FormTextField } from "@/shared/components/form-text-field";
import { NoticeCard } from "@/shared/components/notice-card";
import { PrimaryButton } from "@/shared/components/primary-button";
import { Controller } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

export function AddAccountScreen() {
  const {
    requestedCurrency,
    control,
    formState,
    handleBack,
    onSubmit,
    titleText,
  } = useAddAccountScreen();

  const header = (
    <View className="flex-row items-center justify-between border-b border-line bg-white px-5 py-3.5">
      <Pressable
        accessibilityLabel="Volver"
        accessibilityRole="button"
        className="h-8 w-8 items-start justify-center active:opacity-70"
        hitSlop={8}
        onPress={handleBack}
      >
        <AppIcon color="#060f26" name="chevron-left" size={20} />
      </Pressable>
      <Text className="flex-1 text-center text-lg font-brand-bold text-ink">
        {titleText}
      </Text>
      <View className="h-8 w-8" />
    </View>
  );

  return (
    <AppScreen backgroundClassName="bg-white" header={header}>
      <AnimatedEntry delay={0} className="gap-4 pt-1">
        <Text className="font-brand text-sm leading-5 text-ink">
          La cuenta que registres{" "}
          <Text className="font-brand-bold">debe estar a tu nombre</Text>{" "}
          (titular de este perfil en Kambista)
        </Text>

        <FormSelectField
          control={control}
          label="Tipo de cuenta bancaria"
          name="accountType"
          options={ACCOUNT_TYPE_OPTIONS}
        />

        <FormSelectField
          control={control}
          label="Entidad financiera"
          name="bankId"
          options={BANK_OPTIONS}
          sheetTitle="Entidad financiera"
        />

        <NoticeCard>
          Operamos en Lima con todos los bancos. Y en provincia con el BCP y
          cuentas digitales Interbank.
        </NoticeCard>

        <View className="gap-2">
          <Text className="text-sm font-brand-medium text-muted">Moneda</Text>
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <View className="flex-row gap-4">
                {CURRENCY_BUTTONS.map((option) => {
                  const isSelected = field.value === option.value;
                  const isLockedOut = Boolean(
                    requestedCurrency && requestedCurrency !== option.value,
                  );

                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      accessibilityState={{
                        selected: isSelected,
                        disabled: isLockedOut,
                      }}
                      className={`h-11 flex-1 items-center justify-center rounded-lg border ${
                        isSelected
                          ? "border-ink bg-ink"
                          : "border-line bg-white"
                      }`}
                      disabled={isLockedOut}
                      onPress={() => field.onChange(option.value)}
                    >
                      <Text
                        className={`text-xs font-brand-semibold ${
                          isSelected ? "text-white" : "text-muted-light"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </View>

        <FormTextField
          autoCapitalize="none"
          control={control}
          keyboardType="number-pad"
          label="Número de cuenta"
          name="accountNumber"
          placeholder="Escribe tu cuenta de destino"
        />

        <FormTextField
          autoCapitalize="sentences"
          control={control}
          label="Ponle nombre a tu cuenta"
          maxLength={60}
          name="alias"
          placeholder="Escribe un alias"
        />

        <View className="pt-1">
          <FormCheckbox
            control={control}
            label="Declaro que esta cuenta es mia"
            name="owned"
          />
        </View>

        <View className="pt-2">
          <PrimaryButton
            disabled={!formState.isValid}
            loading={formState.isSubmitting}
            onPress={onSubmit}
          >
            GUARDAR CUENTA
          </PrimaryButton>
        </View>
      </AnimatedEntry>
    </AppScreen>
  );
}
