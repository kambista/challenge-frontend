import type { PropsWithChildren } from "react";
export type AppDialogProps = PropsWithChildren<{
  scrollable?: boolean;
  visible: boolean;
  title: string;
  onClose: () => void;
}>;
