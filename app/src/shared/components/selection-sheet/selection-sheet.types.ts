import type { PropsWithChildren } from "react";
export type SelectionSheetProps = PropsWithChildren<{
  title: string;
  visible: boolean;
  onClose: () => void;
}>;
