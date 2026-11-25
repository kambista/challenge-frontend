import { AuthGate } from "@/modules/auth";
import { Stack } from "expo-router";

export default function OperationLayout() {
  return (
    <AuthGate>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="add-account"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [0.9, 1],
            sheetGrabberVisible: true,
          }}
        />
      </Stack>
    </AuthGate>
  );
}
