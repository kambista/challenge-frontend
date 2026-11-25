import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  BUTTON_STYLES,
  DISABLED_STYLES,
  TEXT_STYLES,
} from "./primary-button.const";
import { PrimaryButtonProps } from "./primary-button.types";

export function PrimaryButton({
  children,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  function handlePressIn() {
    if (isDisabled) return;
    scale.set(withSpring(0.97, { damping: 16, stiffness: 260 }));
  }
  function handlePressOut() {
    scale.set(withSpring(1, { damping: 16, stiffness: 260 }));
  }
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        className={`min-h-12 w-full items-center justify-center rounded-lg px-5 py-3 ${
          isDisabled ? DISABLED_STYLES[variant] : BUTTON_STYLES[variant]
        }`}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === "secondary" ? "#ffffff" : "#060f26"}
          />
        ) : (
          <Text
            className={`text-center text-sm font-brand-semibold tracking-wide ${
              isDisabled && variant === "primary"
                ? "text-muted"
                : TEXT_STYLES[variant]
            }`}
          >
            {children}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
