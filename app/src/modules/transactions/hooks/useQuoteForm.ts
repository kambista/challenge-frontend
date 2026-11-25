import {
  quoteSchema,
  type QuoteFormValues,
} from "@/modules/transactions/schemas/quote.schema";
import { type Currency } from "@/shared/types/currency.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
export function useQuoteForm() {
  const swapRotation = useSharedValue(0);

  const swapAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${swapRotation.value}deg` }],
  }));

  const { control, handleSubmit, setValue, formState } =
    useForm<QuoteFormValues>({
      resolver: yupResolver(quoteSchema),
      mode: "onChange",
      defaultValues: { amount: "100", origin: "USD", destination: "PEN" },
    });

  const amount = useWatch({ control, name: "amount" }) ?? "";
  const origin = useWatch({ control, name: "origin" }) ?? "USD";
  const destination = useWatch({ control, name: "destination" }) ?? "PEN";

  function handleSetPair(nextOrigin: Currency, nextDestination: Currency) {
    setValue("origin", nextOrigin, { shouldValidate: true });
    setValue("destination", nextDestination, { shouldValidate: true });
  }
  
  function handleSwap() {
    swapRotation.value = withSpring(swapRotation.value + 180, {
      damping: 14,
      stiffness: 180,
    });
    handleSetPair(destination, origin);
  }

  return {
    swapAnimatedStyle,
    control,
    handleSubmit,
    formState,
    amount,
    origin,
    destination,
    handleSetPair,
    handleSwap,
  };
}
