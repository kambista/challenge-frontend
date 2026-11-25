import { render } from "@testing-library/react-native";
import Index from "@/app/index";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
jest.mock("expo-router", () => {
  const { Text: MockText } = jest.requireActual("react-native");
  return {
    Redirect: ({ href }: { href: string }) => <MockText>{href}</MockText>,
  };
});
test.each([
  [false, false, "/login"],
  [true, false, "/register"],
  [true, true, "/(main)"],
] as const)(
  "inicio con sesión=%s perfil=%s → %s",
  async (isAuthenticated, isProfileComplete, expected) => {
    useAuthStore.setState({ isAuthenticated, isProfileComplete });
    const view = await render(<Index />);
    expect(view.getByText(expected)).toBeOnTheScreen();
  },
);
