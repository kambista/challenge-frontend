import { OperationGate, VoucherScreen as Screen } from "@/modules/transactions";

export default function OperationRoute() {
  return (
    <OperationGate step="voucher">
      <Screen />
    </OperationGate>
  );
}
