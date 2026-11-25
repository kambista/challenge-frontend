import { View } from "react-native";
import { AppIconProps } from "./app-icon.types";

export function AppIcon({ name, size = 20, color = "#060f26" }: AppIconProps) {
  const stroke = Math.max(1.6, size * 0.09);

  if (name === "chevron-left") {
    const arm = size * 0.36;
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <View
          style={{
            width: arm,
            height: arm,
            borderLeftWidth: stroke,
            borderBottomWidth: stroke,
            borderColor: color,
            transform: [{ rotate: "45deg" }, { translateX: size * 0.08 }],
          }}
        />
      </View>
    );
  }

  if (name === "chevron-down") {
    const arm = size * 0.36;
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <View
          style={{
            width: arm,
            height: arm,
            borderRightWidth: stroke,
            borderBottomWidth: stroke,
            borderColor: color,
            transform: [{ rotate: "45deg" }, { translateY: -size * 0.08 }],
          }}
        />
      </View>
    );
  }

  if (name === "check") {
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <View
          style={{
            width: size * 0.5,
            height: size * 0.28,
            borderLeftWidth: stroke * 1.15,
            borderBottomWidth: stroke * 1.15,
            borderColor: color,
            transform: [{ rotate: "-45deg" }, { translateY: -size * 0.06 }],
          }}
        />
      </View>
    );
  }

  if (name === "info") {
    const dotSize = Math.max(2, size * 0.11);
    return (
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          borderWidth: stroke * 0.9,
          borderColor: color,
        }}
      >
        <View
          className="rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            marginBottom: size * 0.08,
          }}
        />
        <View
          className="rounded-full"
          style={{
            width: dotSize,
            height: size * 0.34,
            backgroundColor: color,
          }}
        />
      </View>
    );
  }

  if (name === "copy") {
    const boxW = size * 0.52;
    const boxH = size * 0.62;
    return (
      <View style={{ width: size, height: size }}>
        <View
          style={{
            position: "absolute",
            top: size * 0.1,
            left: size * 0.12,
            width: boxW,
            height: boxH,
            borderRadius: 2,
            borderWidth: stroke * 0.85,
            borderColor: color,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: size * 0.1,
            right: size * 0.12,
            width: boxW,
            height: boxH,
            borderRadius: 2,
            borderWidth: stroke * 0.85,
            borderColor: color,
            backgroundColor: "#ffffff",
          }}
        />
      </View>
    );
  }

  if (name === "plus") {
    const barLen = size * 0.56;
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <View
          className="rounded-full"
          style={{
            position: "absolute",
            width: barLen,
            height: stroke,
            backgroundColor: color,
          }}
        />
        <View
          className="rounded-full"
          style={{
            position: "absolute",
            width: stroke,
            height: barLen,
            backgroundColor: color,
          }}
        />
      </View>
    );
  }

  if (name === "close") {
    const barLen = size * 0.65;
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <View
          className="rounded-full"
          style={{
            position: "absolute",
            width: barLen,
            height: stroke,
            backgroundColor: color,
            transform: [{ rotate: "45deg" }],
          }}
        />
        <View
          className="rounded-full"
          style={{
            position: "absolute",
            width: barLen,
            height: stroke,
            backgroundColor: color,
            transform: [{ rotate: "-45deg" }],
          }}
        />
      </View>
    );
  }

  if (name === "menu") {
    const barW = size * 0.72;
    return (
      <View
        className="items-center justify-between"
        style={{ width: size, height: size * 0.62 }}
      >
        <View
          className="rounded-full"
          style={{ width: barW, height: stroke, backgroundColor: color }}
        />
        <View
          className="rounded-full"
          style={{ width: barW, height: stroke, backgroundColor: color }}
        />
        <View
          className="rounded-full"
          style={{ width: barW, height: stroke, backgroundColor: color }}
        />
      </View>
    );
  }

  if (name === "swap") {
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <View
          style={{
            position: "absolute",
            width: size * 0.68,
            height: stroke,
            borderRadius: stroke,
            backgroundColor: color,
            transform: [{ rotate: "-48deg" }],
          }}
        />
        <View
          style={{
            position: "absolute",
            width: size * 0.22,
            height: size * 0.22,
            borderTopWidth: stroke,
            borderRightWidth: stroke,
            borderColor: color,
            transform: [
              { rotate: "-3deg" },
              { translateX: size * 0.24 },
              { translateY: -size * 0.19 },
            ],
          }}
        />
        <View
          style={{
            position: "absolute",
            width: size * 0.22,
            height: size * 0.22,
            borderBottomWidth: stroke,
            borderLeftWidth: stroke,
            borderColor: color,
            transform: [
              { rotate: "-3deg" },
              { translateX: -size * 0.24 },
              { translateY: size * 0.19 },
            ],
          }}
        />
      </View>
    );
  }

  if (name === "logout") {
    return (
      <View
        className="flex-row items-center justify-center"
        style={{ width: size, height: size }}
      >
        <View
          style={{
            width: size * 0.38,
            height: size * 0.68,
            borderTopWidth: stroke,
            borderBottomWidth: stroke,
            borderLeftWidth: stroke,
            borderColor: color,
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          }}
        />
        <View
          style={{
            width: size * 0.36,
            height: stroke,
            backgroundColor: color,
            marginLeft: -size * 0.12,
          }}
        />
        <View
          style={{
            width: size * 0.22,
            height: size * 0.22,
            borderTopWidth: stroke,
            borderRightWidth: stroke,
            borderColor: color,
            transform: [{ rotate: "45deg" }, { translateX: -size * 0.12 }],
          }}
        />
      </View>
    );
  }

  // eye / eye-off
  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <View
        style={{
          width: size * 0.78,
          height: size * 0.46,
          borderRadius: size * 0.4,
          borderWidth: stroke * 0.9,
          borderColor: color,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: size * 0.11,
            backgroundColor: color,
          }}
        />
      </View>
      {name === "eye-off" ? (
        <View
          style={{
            position: "absolute",
            width: size * 0.82,
            height: stroke,
            backgroundColor: color,
            transform: [{ rotate: "-40deg" }],
          }}
        />
      ) : null}
    </View>
  );
}
