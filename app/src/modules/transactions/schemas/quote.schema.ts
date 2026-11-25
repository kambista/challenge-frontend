import * as yup from "yup";

export const quoteSchema = yup.object({
  amount: yup
    .string()
    .required("Ingresa un monto")
    .test("positive-amount", "Ingresa un monto mayor a cero", (value) => {
      const amount = Number(value);
      return Number.isFinite(amount) && amount > 0;
    }),
  origin: yup.mixed<"USD" | "PEN">().oneOf(["USD", "PEN"]).required(),
  destination: yup
    .mixed<"USD" | "PEN">()
    .oneOf(["USD", "PEN"])
    .required()
    .test(
      "different-currencies",
      "Selecciona monedas diferentes",
      (value, context) => !value || value !== context.parent.origin,
    ),
});

export type QuoteFormValues = yup.InferType<typeof quoteSchema>;
