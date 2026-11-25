import { getBankName } from "@/modules/transactions/constants/options.const";
import { useAccountsScreen } from "@/modules/transactions/hooks/useAccountsScreen";
import { AnimatedEntry } from "@/shared/components/animated-entry";
import { AppScreen } from "@/shared/components/app-screen";
import { BrandLogo } from "@/shared/components/brand-logo";
import { NoticeCard } from "@/shared/components/notice-card";
import { PrimaryButton } from "@/shared/components/primary-button";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function AccountsScreen() {
  const { accounts, handleAddAccount } = useAccountsScreen();

  const header = (
    <View className="flex-row items-center justify-between border-b border-line-soft bg-white px-5 py-3">
      <BrandLogo height={26} width={104} />
      <Text className="text-sm font-brand-bold text-ink">Mis cuentas</Text>
    </View>
  );

  return (
    <AppScreen bottomInset={false} header={header}>
      <View className="mt-2 gap-4">
        {accounts.length === 0 ? (
          <AnimatedEntry delay={0}>
            <View className="gap-4 rounded-xl border border-line-soft bg-white p-5">
              <Text className="text-base font-brand-bold text-ink">
                Aún no tienes cuentas
              </Text>
              <Text className="font-brand text-sm leading-5 text-muted">
                Registra una cuenta bancaria a tu nombre para recibir tus
                operaciones.
              </Text>
              <PrimaryButton onPress={handleAddAccount}>
                AGREGAR CUENTA
              </PrimaryButton>
            </View>
          </AnimatedEntry>
        ) : (
          <>
            <NoticeCard>
              Las cuentas que registres deben estar a tu nombre.
            </NoticeCard>
            {accounts.map((account, index) => (
              <AnimatedEntry key={account.id} delay={index * 60}>
                <View className="rounded-xl border border-line-soft bg-white p-5">
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="flex-1 text-base font-brand-bold text-ink">
                      {account.alias || getBankName(account.bankId)}
                    </Text>
                    <View className="rounded-md bg-ink px-2.5 py-1">
                      <Text className="text-xs font-brand-bold text-white">
                        {account.currency}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-brand mt-2 text-sm text-muted">
                    {getBankName(account.bankId)} ·{" "}
                    {account.accountType.toLowerCase()}
                  </Text>
                  <Text className="mt-1 text-sm font-brand-medium text-ink-light">
                    ******{account.accountNumber.slice(-4)}
                  </Text>
                </View>
              </AnimatedEntry>
            ))}
            <PrimaryButton onPress={handleAddAccount}>
              AGREGAR OTRA CUENTA
            </PrimaryButton>
          </>
        )}
        <Link href="/(main)" asChild>
          <Pressable accessibilityRole="link" className="items-center py-2">
            <Text className="text-sm font-brand-bold text-ink underline">
              Volver a inicio
            </Text>
          </Pressable>
        </Link>
      </View>
    </AppScreen>
  );
}
