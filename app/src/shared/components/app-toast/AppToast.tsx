import { AppIcon } from "@/shared/components/app-icon";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { AppToastProps } from "./app-toast.types";

export function AppToast({
  visible,
  title,
  message,
  onDismiss,
}: AppToastProps) {
  if (!visible) return null;

  return (
    <Animated.View
      accessibilityRole="alert"
      entering={FadeInUp.duration(240)}
      exiting={FadeOutUp.duration(180)}
      className="mx-5 mb-3 flex-row items-start gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3"
    >
      <View className="mt-0.5">
        <AppIcon color="#ff3d4a" name="info" size={18} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-brand-bold text-ink">{title}</Text>
        <Text className="font-brand mt-0.5 text-xs leading-4 text-ink-light">
          {message}
        </Text>
      </View>
      <Pressable
        accessibilityLabel="Cerrar alerta"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onDismiss}
      >
        <AppIcon color="#686868" name="close" size={16} />
      </Pressable>
    </Animated.View>
  );
}
