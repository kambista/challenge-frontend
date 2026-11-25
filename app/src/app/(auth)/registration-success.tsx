import { useAuthStatus } from "@/modules/auth";
import { RegistrationSuccessScreen } from "@/modules/onboarding";
import { Redirect } from "expo-router";

export default function RegistrationSuccessRoute() {
  const { isAuthenticated, isProfileComplete } = useAuthStatus();
  if (!isAuthenticated) return <Redirect href="/login" />;
  if (!isProfileComplete) return <Redirect href="/register" />;
  return <RegistrationSuccessScreen />;
}
