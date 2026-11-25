import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { AuthGate } from "@/modules/auth/components/AuthGate";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

jest.mock("expo-router", () => {
  const { Text: MockText } = jest.requireActual("react-native");
  return {
    Redirect: ({ href }: { href: string }) => <MockText>{href}</MockText>,
  };
});
beforeEach(() => useAuthStore.setState(useAuthStore.getInitialState(), true));
test.each([
  [false, false, "/login"],
  [true, false, "/register"],
  [true, true, "Contenido privado"],
] as const)(
  "sesión=%s perfil=%s → %s",
  async (authenticated, profileComplete, expected) => {
    useAuthStore.setState({
      isAuthenticated: authenticated,
      isProfileComplete: profileComplete,
    });
    const view = await render(
      <AuthGate>
        <Text>Contenido privado</Text>
      </AuthGate>,
    );
    expect(view.getByText(expected)).toBeOnTheScreen();
    if (expected !== "Contenido privado")
      expect(view.queryByText("Contenido privado")).toBeNull();
  },
);
