import { mockRouter } from "../../../../support/router";
import { act, renderHook } from "@testing-library/react-native";
import { useRegistrationSuccessScreen } from "@/modules/onboarding/hooks/useRegistrationSuccessScreen";
import { useAuthStore } from "@/modules/auth/stores/auth.store";
test("continúa a Inicio después del registro", async () => {
  useAuthStore.setState({ displayName: "Ana Lucía" });
  const { result } = await renderHook(useRegistrationSuccessScreen);
  expect(result.current.firstName).toBe("Ana");
  await act(() => result.current.handleContinue());
  expect(mockRouter.replace).toHaveBeenCalledWith("/(main)");
});
