import { AppIcon } from "@/shared/components/app-icon";
import { Text, View } from "react-native";
import { NoticeCardProps } from "./notice-card.types";

export function NoticeCard({ children, tone = "info" }: NoticeCardProps) {
  const isWarning = tone === "warning";

  return (
    <View
      className={`flex-row items-center gap-3 rounded-lg px-3.5 py-3 ${
        isWarning ? "bg-warning-bg" : "bg-info-bg"
      }`}
    >
      <AppIcon
        color={isWarning ? "#874400" : "#060f26"}
        name="info"
        size={20}
      />
      <Text
        className={`flex-1 text-xs leading-4 ${isWarning ? "text-warning" : "text-ink"}`}
      >
        {children}
      </Text>
    </View>
  );
}
