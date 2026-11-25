import { createProfile } from "@/modules/onboarding/services/profile.service";
const profile = {
  firstName: "Ana Pérez",
  documentType: "DNI",
  documentNumber: "00123456",
  phone: "901234567",
  birthDate: "1990-01-01",
  acceptTerms: true,
  acceptPrivacy: false,
} as const;

test.each([
  [{ documentNumber: "12345678" }, "DUPLICATE_DNI"],
  [{ phone: "999999999" }, "INVALID_PHONE"],
] as const)("registro conserva error %s", async (patch, name) => {
  await expect(createProfile({ ...profile, ...patch })).resolves.toMatchObject({
    success: false,
    data: { name, title: expect.any(String), message: expect.any(String) },
  });
});
test("registro acepta datos válidos alternativos", async () => {
  await expect(createProfile(profile)).resolves.toEqual({ success: true });
  await expect(
    createProfile({
      ...profile,
      firstName: "José Luis",
      documentType: "CE",
      documentNumber: "000012345",
    }),
  ).resolves.toEqual({ success: true });
});
