import { OperationStep } from "@/modules/transactions/types/operation-gate.types";
import { Redirect } from "expo-router";
import type { PropsWithChildren } from "react";
import { useOperationGate } from "../hooks/useOperationGate";

export function OperationGate({
  children,
  step,
}: PropsWithChildren<{ step: OperationStep }>) {
  const { redirect, isFocused } = useOperationGate(step);
  
  if (redirect) return isFocused ? <Redirect href={redirect} /> : null;
  return children;
}
