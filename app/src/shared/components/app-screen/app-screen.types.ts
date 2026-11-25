import type { PropsWithChildren, ReactNode } from "react";
export type AppScreenProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  header?: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  bottomInset?: boolean;
  backgroundClassName?: string;
}>;
