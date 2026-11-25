import { profileSchema } from "@/modules/onboarding/schemas/profile.schema";
const profile = {
  firstName: "María  José Álvarez",
  documentType: "DNI",
  documentNumber: "00012345",
  phone: "987654321",
  birthDate: "1996-02-29",
  acceptTerms: true,
};

test.each([
  ["DNI", "00012345"],
  ["CE", "001234567"],
  ["PASAPORTE", "AB123456"],
  ["PASAPORTE", "A1234567890123Z"],
])(
  "acepta %s %s y permite omitir la política de datos",
  async (documentType, documentNumber) => {
    await expect(
      profileSchema.validate({ ...profile, documentType, documentNumber }),
    ).resolves.toMatchObject({ acceptPrivacy: false });
  },
);

test.each([
  { firstName: "Ana2" },
  { firstName: "\u0301" },
  { documentNumber: "1234567" },
  { documentType: "CE", documentNumber: "12345678" },
  { documentType: "PASAPORTE", documentNumber: "A123456" },
  { documentType: "PASAPORTE", documentNumber: "A123456789012345" },
  { documentType: "PASAPORTE", documentNumber: "AB-123456" },
  { phone: "12345678" },
  { phone: "12345678x" },
  { acceptTerms: false },
])("rechaza el perfil con %j", async (patch) => {
  expect(await profileSchema.isValid({ ...profile, ...patch })).toBe(false);
});
