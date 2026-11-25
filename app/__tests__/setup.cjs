/* global jest */

function createReanimatedMock() {
  const { View } = jest.requireActual("react-native");
  const preset = {
    delay: () => preset,
    duration: () => preset,
    reduceMotion: () => preset,
    springify: () => preset,
    damping: () => preset,
  };
  return {
    __esModule: true,
    default: { View },
    useSharedValue: (value) => ({
      value,
      set(next) {
        this.value = next;
      },
    }),
    useAnimatedStyle: (getStyle) => getStyle(),
    withSpring: (value) => value,
    FadeIn: preset,
    FadeInDown: preset,
    FadeInUp: preset,
    FadeOutUp: preset,
    ZoomIn: preset,
    SlideInDown: preset,
    ReduceMotion: { System: "system" },
  };
}

jest.mock("react-native-reanimated/mock", () => createReanimatedMock());
jest.mock("react-native-reanimated", () => createReanimatedMock());
