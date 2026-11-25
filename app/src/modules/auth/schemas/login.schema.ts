import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido")
    .required("Ingresa tu correo electrónico"),
  password: yup.string().required("Ingresa tu contraseña"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
