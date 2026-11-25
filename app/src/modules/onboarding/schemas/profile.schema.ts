import { isAdult } from "@/modules/onboarding/utils/is-adult.util";
import * as yup from "yup";

export const DOCUMENT_TYPES = ["DNI", "CE", "PASAPORTE"] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

const namePattern = /^(?:\p{L}\p{M}*)+(?: +(?:\p{L}\p{M}*)+)*$/u;

export const profileSchema = yup.object({
  firstName: yup
    .string()
    .trim()
    .matches(namePattern, "Usa solo letras y espacios")
    .required("Completa este campo"),
  documentType: yup
    .mixed<DocumentType>()
    .oneOf(DOCUMENT_TYPES, "Selecciona un tipo de documento")
    .required("Selecciona un tipo de documento"),
  documentNumber: yup
    .string()
    .trim()
    .required("Ingresa tu documento")
    .test(
      "document-format",
      "El documento no coincide con el formato seleccionado",
      function validateDocument(value) {
        const documentType = this.parent.documentType;
        if (documentType === "DNI") return /^\d{8}$/.test(value ?? "");
        if (documentType === "CE") return /^\d{9}$/.test(value ?? "");
        if (documentType === "PASAPORTE")
          return /^[a-zA-Z0-9]{8,15}$/.test(value ?? "");
        return false;
      },
    ),
  phone: yup
    .string()
    .matches(/^\d{9}$/, "Ingresa un celular de 9 dígitos")
    .required("Ingresa tu celular"),
  birthDate: yup
    .string()
    .required("Ingresa tu fecha de nacimiento")
    .test(
      "adult",
      "Ingresa una fecha válida; debes ser mayor de edad",
      (value) => typeof value === "string" && isAdult(value),
    ),
  acceptTerms: yup
    .boolean()
    .oneOf([true], "Acepta los términos para continuar")
    .required(),
  acceptPrivacy: yup.boolean().default(false),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
