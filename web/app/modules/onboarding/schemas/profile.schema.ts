import { z } from 'zod';
import { isAdult } from '../utils/isAdult';

const documentFormats = {
  DNI: /^\d{8}$/, CE: /^\d{9}$/,
  PASAPORTE: /^[a-zA-Z0-9]{8,15}$/
};

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Completa este campo')
  .regex(/^(?:\p{L}\p{M}*)+(?: +(?:\p{L}\p{M}*)+)*$/u, 'Usa solo letras y espacios');

const profileFieldsSchema = z.object({
  firstName: nameSchema,
  documentType: z.enum(['DNI', 'CE', 'PASAPORTE']),
  documentNumber: z.string().trim().min(1, 'Ingresa tu documento'),
  phone: z.string().regex(/^\d{9}$/, 'Ingresa un celular de 9 dígitos'),
  birthDate: z.string().refine(isAdult, 'Ingresa una fecha válida; debes ser mayor de edad'),
  acceptTerms: z.boolean().refine(Boolean, 'Acepta los términos para continuar'),
  acceptPrivacy: z.boolean().default(false),
});

type ProfileFields = z.infer<typeof profileFieldsSchema>;

function validateDocumentFormat(values: ProfileFields, context: z.RefinementCtx) {
  if (documentFormats[values.documentType].test(values.documentNumber)) return;
  context.addIssue({
    code: 'custom',
    path: ['documentNumber'],
    message: 'El documento no coincide con el formato seleccionado',
  });
}

export const profileSchema = profileFieldsSchema.superRefine(validateDocumentFormat);
