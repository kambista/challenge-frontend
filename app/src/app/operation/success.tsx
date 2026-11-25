import {
  OperationGate,
  OperationSuccessScreen as Screen,
} from "@/modules/transactions";

export default function OperationRoute() {
  return (
    <OperationGate step="success">
      <Screen />
    </OperationGate>
  );
}
