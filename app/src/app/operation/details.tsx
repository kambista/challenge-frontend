import {
  OperationGate,
  OperationDetailsScreen as Screen,
} from "@/modules/transactions";

export default function OperationRoute() {
  return (
    <OperationGate step="details">
      <Screen />
    </OperationGate>
  );
}
