export type AppIconName =
  | "chevron-left"
  | "chevron-down"
  | "copy"
  | "check"
  | "info"
  | "eye"
  | "eye-off"
  | "swap"
  | "logout"
  | "close"
  | "plus"
  | "menu";

export type AppIconProps = {
  name: AppIconName;
  size?: number;
  color?: string;
};
