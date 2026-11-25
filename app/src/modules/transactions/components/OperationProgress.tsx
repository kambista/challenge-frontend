import {
  STEPS,
  STEP_TITLES,
} from "@/modules/transactions/constants/operation-progress.const";
import { OperationProgressProps } from "@/modules/transactions/types/operation-progress.types";
import { AppIcon } from "@/shared/components/app-icon";
import { Pressable, Text, View } from "react-native";

export function OperationProgress({ step, onBack }: OperationProgressProps) {
  return (
    <View className="bg-white px-5 pb-3 pt-2">
      <View className="flex-row items-center justify-between py-2">
        <Pressable
          accessibilityLabel="Volver al paso anterior"
          accessibilityRole="button"
          className="h-9 w-9 items-start justify-center active:opacity-70"
          hitSlop={8}
          onPress={onBack}
        >
          <AppIcon color="#060f26" name="chevron-left" size={22} />
        </Pressable>
        <Text className="flex-1 text-center text-base font-brand-bold text-ink">
          {STEP_TITLES[step]}
        </Text>
        <View className="h-9 w-9" />
      </View>

      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 1, max: STEPS.length, now: step }}
        className="mt-1 flex-row items-start px-2"
      >
        {STEPS.map((label, index) => {
          const currentStep = index + 1;
          const isReached = currentStep <= step;
          const isLineActive = currentStep < step;

          return (
            <View key={label} className="flex-1 items-center">
              <View className="w-full flex-row items-center">
                <View
                  className={`h-0.5 flex-1 ${
                    index === 0
                      ? "bg-transparent"
                      : currentStep <= step
                        ? "bg-ink"
                        : "bg-line"
                  }`}
                />
                <View
                  className={`h-2.5 w-2.5 rounded-full ${
                    isReached ? "bg-ink" : "bg-muted-light"
                  }`}
                />
                <View
                  className={`h-0.5 flex-1 ${
                    index === STEPS.length - 1
                      ? "bg-transparent"
                      : isLineActive
                        ? "bg-ink"
                        : "bg-line"
                  }`}
                />
              </View>
              <Text
                className={`mt-1.5 text-xs ${
                  isReached
                    ? "font-brand-bold text-ink"
                    : "font-brand-medium text-muted-light"
                }`}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
