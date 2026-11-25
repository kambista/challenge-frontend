import {
  voucherSchema,
  type VoucherFormValues,
} from "@/modules/transactions/schemas/voucher.schema";
import { useOperationStore } from "@/modules/transactions/stores/operation.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";

export function useVoucherScreen() {
  const router = useRouter();
  const operation = useOperationStore((state) => state.activeOperation);
  const markVoucherSubmitted = useOperationStore(
    (state) => state.submitVoucher,
  );

  const { control, handleSubmit, setValue, formState } =
    useForm<VoucherFormValues>({
      resolver: yupResolver(voucherSchema),
      mode: "onChange",
      defaultValues: { fileName: "", fileSize: null },
    });

  function handleFileSizeChange(size: number | null) {
    setValue("fileSize", size, { shouldValidate: true });
  }

  function handleSendVoucher(values: VoucherFormValues) {
    if (values.fileSize === null) return;
    if (!markVoucherSubmitted({ name: values.fileName, size: values.fileSize }))
      return;
    router.replace("/operation/success");
  }

  function handleReturnToHome() {
    router.replace("/(main)");
  }

  function handleReturnToTransfer() {
    router.dismissTo("/operation/transfer");
  }

  const onSubmit = handleSubmit(handleSendVoucher);
  
  return {
    operation,
    control,
    formState,
    handleFileSizeChange,
    onSubmit,
    handleReturnToHome,
    handleReturnToTransfer,
  };
}
