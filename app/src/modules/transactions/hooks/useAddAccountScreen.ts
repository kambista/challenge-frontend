import {
  bankAccountSchema,
  type BankAccountFormValues,
} from "@/modules/transactions/schemas/bank-account.schema";
import { useAccountsStore } from "@/modules/transactions/stores/accounts.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm } from "react-hook-form";

export function useAddAccountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ currency?: string }>();

  const requestedCurrency =
    params.currency === "USD"
      ? "USD"
      : params.currency === "PEN"
        ? "PEN"
        : null;
        
  const handleAddAccount = useAccountsStore((state) => state.addAccount);

  const { control, handleSubmit, formState } = useForm<BankAccountFormValues>({
    resolver: yupResolver(bankAccountSchema),
    mode: "onChange",
    defaultValues: {
      accountType: "AHORRO",
      bankId: "",
      currency: requestedCurrency ?? "PEN",
      accountNumber: "",
      alias: "",
      owned: false,
    },
  });

  function handleSave(values: BankAccountFormValues) {
    handleAddAccount({
      bankId: values.bankId,
      accountType: values.accountType,
      currency: values.currency,
      accountNumber: values.accountNumber.trim(),
      alias: values.alias.trim(),
    });
    handleBack();
  }

  function handleBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/(main)/accounts");
  }

  const onSubmit = handleSubmit(handleSave);

  const titleText =
    requestedCurrency === "PEN"
      ? "Agregar cuenta soles"
      : requestedCurrency === "USD"
        ? "Agregar cuenta dólares"
        : "Agregar cuenta";

  return {
    requestedCurrency,
    control,
    formState,
    handleBack,
    onSubmit,
    titleText,
  };
}
