import { signIn } from "@/modules/auth/services/auth.service";
test("login conserva el contrato de éxito y error del mock", async () => {
  await expect(
    signIn({ email: "demo@kambista.com", password: "Demo1234!" }),
  ).resolves.toEqual({ success: true });
  await expect(
    signIn({ email: "demo@kambista.com", password: "incorrecta" }),
  ).resolves.toMatchObject({
    success: false,
    data: {
      name: "SERVER_ERROR",
      title: expect.any(String),
      message: expect.any(String),
    },
  });
});
