import { useAuthStatus } from "@/modules/auth/hooks/useAuthStatus";
import { Redirect } from "expo-router";
import type { PropsWithChildren } from "react";

export function AuthGate({ children }: PropsWithChildren) {
  const { isAuthenticated, isProfileComplete } = useAuthStatus();

  if (!isAuthenticated) return <Redirect href="/login" />;
  if (!isProfileComplete) return <Redirect href="/register" />;
  return children;
}
