import { useAuthStore } from "@/modules/auth";
import { useRouter } from "expo-router";

export function useRegistrationSuccessScreen() {
  const router = useRouter();
  const displayName = useAuthStore((state) => state.displayName);
  const firstName = displayName ? displayName.trim().split(" ")[0] : "";
  function handleContinue() {
    router.replace("/(main)");
  }
  return { firstName, handleContinue };
}
