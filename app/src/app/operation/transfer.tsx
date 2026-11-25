import {
  OperationGate,
  TransferScreen as Screen,
} from "@/modules/transactions";

export default function OperationRoute() {
  return (
    <OperationGate step="transfer">
      <Screen />
    </OperationGate>
  );
}
