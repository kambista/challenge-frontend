import { useAuthStore } from "../stores/auth.store";

export function useAuthStatus() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isProfileComplete = useAuthStore((state) => state.isProfileComplete);
  return { isAuthenticated, isProfileComplete };
}
