import { Image } from "expo-image";
import { DARK_LOGO, LIGHT_LOGO } from "./brand-logo.const";
import { BrandLogoProps } from "./brand-logo.types";

export function BrandLogo({
  light = false,
  width = 140,
  height = 34,
}: BrandLogoProps) {
  return (
    <Image
      accessibilityLabel="Kambista"
      contentFit="contain"
      source={light ? LIGHT_LOGO : DARK_LOGO}
      style={{ width, height }}
    />
  );
}
