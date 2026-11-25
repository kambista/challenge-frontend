import { loginSchema } from "@/modules/auth/schemas/login.schema";
test("valida campos obligatorios y correo del login", () => {
  expect(loginSchema.isValidSync({ email: "", password: "" })).toBe(false);
  expect(
    loginSchema.isValidSync({ email: "correo", password: "Demo1234!" }),
  ).toBe(false);
  expect(
    loginSchema.isValidSync({
      email: "demo@kambista.com",
      password: "Demo1234!",
    }),
  ).toBe(true);
});
