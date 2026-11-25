import {
  COUPON_ICON,
  CURRENCY_LABELS,
  CURRENCY_REFRESH_ICON,
  PROFILE_ICON,
  STAR_ICON,
} from "@/modules/transactions/constants/exchange-screen.const";
import { useExchangeScreen } from "@/modules/transactions/hooks/useExchangeScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppDialog } from "@/shared/components/app-dialog";
import { AppScreen } from "@/shared/components/app-screen";
import { BrandLogo } from "@/shared/components/brand-logo";
import { NoticeCard } from "@/shared/components/notice-card";
import { PrimaryButton } from "@/shared/components/primary-button";
import { formatMoney } from "@/shared/types/currency.types";
import { Image } from "expo-image";
import { Controller } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";

export function ExchangeScreen() {
  const {
    couponInput,
    setCouponInput,
    formError,
    menuOpen,
    handleOpenMenu,
    handleCloseMenu,
    swapAnimatedStyle,
    control,
    formState,
    origin,
    destination,
    rates,
    calculation,
    isLoadingRates,
    isCalculating,
    ratesError,
    quoteError,
    retry,
    handleSetPair,
    handleSwap,
    handleSignOut,
    onSubmit,
    convertedAmount,
    firstName,
  } = useExchangeScreen();

  const header = (
    <View className="min-h-16 flex-row items-center justify-between px-5 py-3">
      <View className="w-12" />
      <BrandLogo height={26} width={104} />
      <View className="flex-row items-center gap-3">
        <Pressable
          accessibilityLabel="Abrir menú de perfil"
          accessibilityRole="button"
          className="h-12 w-12 items-center justify-center"
          onPress={handleOpenMenu}
        >
          <Image
            contentFit="contain"
            source={PROFILE_ICON}
            style={{ width: 28, height: 28 }}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <AppScreen bottomInset={false} header={header}>
      <AnimatedEntry delay={0} className="mt-2 gap-4">
        <View className="overflow-hidden rounded-xl border border-line-soft bg-white">
          {/* Compra / Venta Tabs */}
          <View className="flex-row border-b border-line-soft">
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: origin === "USD" }}
              className={`flex-1 items-center justify-center py-3.5 ${
                origin === "USD" ? "bg-ink" : "bg-white"
              }`}
              onPress={() => handleSetPair("USD", "PEN")}
            >
              <Text
                className={`text-sm font-brand-bold ${
                  origin === "USD" ? "text-white" : "text-muted-light"
                }`}
              >
                Compra:{" "}
                {rates ? rates.bid.toFixed(3) : isLoadingRates ? "…" : "—"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: origin === "PEN" }}
              className={`flex-1 items-center justify-center py-3.5 ${
                origin === "PEN" ? "bg-ink" : "bg-white"
              }`}
              onPress={() => handleSetPair("PEN", "USD")}
            >
              <Text
                className={`text-sm font-brand-bold ${
                  origin === "PEN" ? "text-white" : "text-muted-light"
                }`}
              >
                Venta:{" "}
                {rates ? rates.ask.toFixed(3) : isLoadingRates ? "…" : "—"}
              </Text>
            </Pressable>
          </View>

          <View className="p-4 pt-6">
            {/* Currency Inputs */}
            <View className="relative gap-3">
              {/* Origin Input */}
              <View className="flex-row overflow-hidden rounded-lg bg-line-soft">
                <View className="flex-1 justify-center px-4 py-3">
                  <Text className="text-xs font-brand-medium text-muted">
                    ¿Cuánto envías?
                  </Text>
                  <Controller
                    control={control}
                    name="amount"
                    render={({ field }) => (
                      <TextInput
                        accessibilityLabel="¿Cuánto envías?"
                        className="mt-0.5 text-xl font-brand-bold text-ink"
                        keyboardType="decimal-pad"
                        onBlur={field.onBlur}
                        onChangeText={field.onChange}
                        placeholder="0.00"
                        placeholderTextColor="#a7a7a7"
                        value={field.value}
                      />
                    )}
                  />
                </View>
                <Pressable
                  accessibilityLabel="Cambiar moneda de envío"
                  accessibilityRole="button"
                  className="w-28 items-center justify-center bg-ink px-3"
                  onPress={handleSwap}
                >
                  <Text className="text-sm font-brand-bold text-white">
                    {origin}
                  </Text>
                  <Text className="font-brand text-[11px] text-muted-light">
                    {CURRENCY_LABELS[origin]}
                  </Text>
                </Pressable>
              </View>

              {/* Floating Swap Button */}
              <View className="items-center -my-5 z-10">
                <Pressable
                  accessibilityLabel="Invertir monedas"
                  accessibilityRole="button"
                  className="h-11 w-11 items-center justify-center rounded-full border-4 border-canvas bg-white shadow-sm"
                  onPress={handleSwap}
                >
                  <Animated.View style={swapAnimatedStyle}>
                    <Image
                      contentFit="contain"
                      source={CURRENCY_REFRESH_ICON}
                      style={{ width: 22, height: 22 }}
                    />
                  </Animated.View>
                </Pressable>
              </View>

              {/* Destination Output */}
              <View className="flex-row overflow-hidden rounded-lg bg-line-soft">
                <View className="flex-1 justify-center px-4 py-3">
                  <Text className="text-xs font-brand-medium text-muted">
                    Entonces recibes
                  </Text>
                  <Text
                    className="mt-0.5 text-xl font-brand-bold text-ink"
                    numberOfLines={1}
                  >
                    {convertedAmount ?? (isCalculating ? "…" : "—")}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Cambiar moneda que recibes"
                  accessibilityRole="button"
                  className="w-28 items-center justify-center bg-ink px-3"
                  onPress={handleSwap}
                >
                  <Text className="text-sm font-brand-bold text-white">
                    {destination}
                  </Text>
                  <Text className="font-brand text-[11px] text-muted-light">
                    {CURRENCY_LABELS[destination]}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Savings & Koinks */}
            <View className="mt-4 flex-row items-center justify-between">
              <View>
                <Text className="font-brand text-xs text-muted">
                  Ahorro estimado:
                </Text>
                <Text className="text-sm font-brand-bold text-ink">
                  {calculation?.savings !== null &&
                  calculation?.savings !== undefined
                    ? formatMoney(calculation.savings, destination)
                    : "—"}
                </Text>
              </View>
              <View className="items-end">
                <Text className="font-brand text-xs text-muted">Koinks</Text>
                <Text className="text-sm font-brand-bold text-ink">—</Text>
              </View>
            </View>

            {/* Coupon Bar */}
            <View className="mt-5 flex-row items-center overflow-hidden rounded-xl border border-line bg-white shadow-sm">
              <Image
                contentFit="contain"
                source={COUPON_ICON}
                style={{ width: 26, height: 26, marginLeft: 10 }}
              />
              <TextInput
                accessibilityLabel="Ingresa el cupón"
                autoCapitalize="characters"
                className="min-w-0 flex-1 px-3 py-2.5 text-center font-brand text-sm text-ink"
                onChangeText={setCouponInput}
                placeholder="Ingresa el cupón"
                placeholderTextColor="#a7a7a7"
                value={couponInput}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: true }}
                className="min-h-12 justify-center bg-ink px-4 opacity-50"
                disabled
              >
                <Text className="text-xs font-brand-semibold text-white">
                  APLICAR
                </Text>
              </Pressable>
            </View>
            {/* Preferential Rate */}
            <View className="mt-6 flex-row items-center justify-center gap-3 pb-1">
              <Image
                contentFit="contain"
                source={STAR_ICON}
                style={{ width: 28, height: 28 }}
              />
              <View>
                <Text className="font-brand text-xs text-ink">
                  ¿Monto mayor a $5.000 o S/18.000?
                </Text>
                <Text className="text-xs font-brand-bold text-ink">
                  ¡Obtén un{" "}
                  <Text className="font-brand underline">
                    Tipo de Cambio Preferencial!
                  </Text>
                </Text>
              </View>
            </View>

            {ratesError || quoteError ? (
              <View className="mt-4 gap-3">
                <NoticeCard tone="warning">
                  {ratesError || quoteError}
                </NoticeCard>
                <PrimaryButton onPress={retry} variant="outline">
                  REINTENTAR COTIZACIÓN
                </PrimaryButton>
              </View>
            ) : isLoadingRates ? (
              <Text className="font-brand mt-3 text-center text-xs text-muted">
                Consultando tipo de cambio…
              </Text>
            ) : null}
          </View>
        </View>

        {formError ? <NoticeCard tone="warning">{formError}</NoticeCard> : null}

        <PrimaryButton
          disabled={
            !formState.isValid ||
            !rates ||
            !calculation ||
            isCalculating ||
            Boolean(ratesError || quoteError)
          }
          onPress={onSubmit}
        >
          INICIAR OPERACIÓN
        </PrimaryButton>
      </AnimatedEntry>

      <AppDialog
        onClose={handleCloseMenu}
        title={`Hola, ${firstName}`}
        visible={menuOpen}
      >
        <Text className="font-brand mb-4 text-sm text-muted">
          Sesión activa en modo demostración de Kambista.
        </Text>
        <PrimaryButton onPress={handleSignOut} variant="secondary">
          CERRAR SESIÓN
        </PrimaryButton>
      </AppDialog>
    </AppScreen>
  );
}
