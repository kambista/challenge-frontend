import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppScreenProps } from "./app-screen.types";

export function AppScreen({
  children,
  title,
  subtitle,
  header,
  footer,
  scroll = true,
  bottomInset = true,
  backgroundClassName = "bg-canvas",
}: AppScreenProps) {
  const content = (
    <View className="w-full max-w-lg flex-1 self-center px-6 pb-8 pt-4">
      {title ? (
        <Text className="mb-1.5 text-center text-xl font-brand-bold text-ink">
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text className="font-brand mb-5 text-center text-sm text-muted">
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  );

  return (
    <SafeAreaView
      className={`flex-1 ${backgroundClassName}`}
      edges={
        bottomInset
          ? ["top", "left", "right", "bottom"]
          : ["top", "left", "right"]
      }
    >
      {header}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {scroll ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName="min-h-full"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
            {footer ? <View className="px-6 pb-5">{footer}</View> : null}
          </ScrollView>
        ) : (
          <>
            {content}
            {footer ? <View className="px-6 pb-5">{footer}</View> : null}
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
