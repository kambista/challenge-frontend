import { useAuthStatus } from "@/modules/auth";
import { Redirect } from "expo-router";

export default function IndexRoute() {
  const { isAuthenticated, isProfileComplete } = useAuthStatus();
  if (!isAuthenticated) return <Redirect href="/login" />;
  return <Redirect href={isProfileComplete ? "/(main)" : "/register"} />;
}
