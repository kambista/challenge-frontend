import { AuthGate } from "@/modules/auth";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ITEMS = [
  {
    label: "Inicio",
    icon: require("@/assets/images/figma/icons/home.png"),
    route: "index",
  },
  {
    label: "Historial",
    icon: require("@/assets/images/figma/icons/history.png"),
  },
  {
    label: "Cuentas",
    icon: require("@/assets/images/figma/icons/bank-cards.png"),
    route: "accounts",
  },
  { label: "Koinks", icon: require("@/assets/images/figma/icons/koinks.png") },
  { label: "Perfil", icon: require("@/assets/images/figma/icons/profile.png") },
] as const;

type TabBar = NonNullable<React.ComponentProps<typeof Tabs>["tabBar"]>;

const renderTabBar: TabBar = function renderTabBar({
  state,
  emitter,
  navigateToTab,
}) {
  const currentRoute = state.routes[state.index].name;

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      className="border-t border-line bg-white"
    >
      <View accessibilityRole="tablist" className="flex-row">
        {ITEMS.map((item) => {
          const routeName = "route" in item ? item.route : undefined;
          const route = state.routes.find((entry) => entry.name === routeName);
          const selected = route?.name === currentRoute;

          function handlePress() {
            if (!route) return;
            const event = emitter.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!selected && !event.defaultPrevented) navigateToTab(route.key);
          }

          return (
            <Pressable
              key={item.label}
              accessibilityRole="tab"
              accessibilityState={{ disabled: !route, selected }}
              className="min-h-14 flex-1 items-center justify-center gap-1 px-1 py-2 active:bg-canvas"
              disabled={!route}
              onPress={handlePress}
            >
              <Image
                contentFit="contain"
                source={item.icon}
                style={{ width: 22, height: 22, opacity: selected ? 1 : 0.5 }}
              />
              <Text
                className={
                  selected
                    ? "text-center font-brand-semibold text-xs text-ink"
                    : "text-center font-brand-medium text-xs text-muted"
                }
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default function MainLayout() {
  return (
    <AuthGate>
      <Tabs tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: "Inicio" }} />
        <Tabs.Screen name="accounts" options={{ title: "Cuentas" }} />
      </Tabs>
    </AuthGate>
  );
}
