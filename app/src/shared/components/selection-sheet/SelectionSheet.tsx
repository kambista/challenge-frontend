import { Modal, Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  ReduceMotion,
  SlideInDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SelectionSheetProps } from "./selection-sheet.types";

export function SelectionSheet({
  title,
  visible,
  onClose,
  children,
}: SelectionSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Animated.View
        entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
        className="flex-1 justify-end bg-black/60"
      >
        <Pressable
          accessibilityLabel="Cerrar selector"
          accessibilityRole="button"
          className="flex-1"
          onPress={onClose}
        />
        <Animated.View
          accessibilityViewIsModal
          entering={SlideInDown.duration(240).reduceMotion(ReduceMotion.System)}
          className="max-h-[85%] w-full max-w-lg self-center rounded-t-[20px] bg-white pt-5"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <View className="border-b border-line px-6 pb-4">
            <Text
              accessibilityRole="header"
              className="font-brand-bold text-base text-ink"
            >
              {title}
            </Text>
          </View>
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
