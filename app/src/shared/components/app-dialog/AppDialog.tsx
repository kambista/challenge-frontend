import { AppIcon } from "@/shared/components/app-icon";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { AppDialogProps } from "./app-dialog.types";

export function AppDialog({
  scrollable = true,
  visible,
  title,
  onClose,
  children,
}: AppDialogProps) {
  return (
    <Modal
      animationType="none"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Animated.View
        entering={FadeIn.duration(180)}
        className="flex-1 items-center justify-center bg-black/50"
      >
        <KeyboardAvoidingView
          className="w-full flex-1 items-center justify-center px-6"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Pressable className="absolute inset-0" onPress={onClose} />
          <Animated.View
            entering={ZoomIn.duration(220).springify().damping(20)}
            className="max-h-[80%] w-full max-w-md rounded-2xl bg-white p-6"
          >
            <View className="mb-4 flex-row items-center justify-between gap-3">
              <Text className="flex-1 text-lg font-brand-bold text-ink">
                {title}
              </Text>
              <Pressable
                accessibilityLabel="Cerrar"
                accessibilityRole="button"
                hitSlop={8}
                onPress={onClose}
              >
                <AppIcon color="#686868" name="close" size={20} />
              </Pressable>
            </View>
            {scrollable ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>
            ) : (
              children
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}
