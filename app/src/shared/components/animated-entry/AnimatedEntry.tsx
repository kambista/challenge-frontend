import Animated, { FadeInDown } from "react-native-reanimated";
import { AnimatedEntryProps } from "./animated-entry.types";

export function AnimatedEntry({
  children,
  delay = 0,
  className,
}: AnimatedEntryProps) {
  return (
    <Animated.View
      className={className}
      entering={FadeInDown.delay(delay).duration(320).springify().damping(18)}
    >
      {children}
    </Animated.View>
  );
}
