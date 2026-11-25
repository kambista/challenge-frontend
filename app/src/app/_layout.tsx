import "@/global.css";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Montserrat-Regular": require("@/assets/fonts/montserrat-latin-400-normal.ttf"),
    "Montserrat-Medium": require("@/assets/fonts/montserrat-latin-500-normal.ttf"),
    "Montserrat-SemiBold": require("@/assets/fonts/montserrat-latin-600-normal.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/montserrat-latin-700-normal.ttf"),
  });

  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="operation" />
      </Stack>
    </>
  );
}
