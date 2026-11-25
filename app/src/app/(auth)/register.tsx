import { useAuthStatus } from "@/modules/auth";
import { ProfileScreen } from "@/modules/onboarding";
import { Redirect } from "expo-router";

export default function RegisterRoute() {
  const { isAuthenticated } = useAuthStatus();
  if (!isAuthenticated) return <Redirect href="/login" />;
  return <ProfileScreen />;
}
