import { mockRouter } from "../../../../support/router";
import { useField } from "../../../../support/form";
import { act, renderHook } from "@testing-library/react-native";
import { useLoginScreen } from "@/modules/auth/hooks/useLoginScreen";
import { signIn } from "@/modules/auth/services/auth.service";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

jest.mock("@/modules/auth/services/auth.service", () => ({
  signIn: jest.fn(),
}));
beforeEach(() => useAuthStore.setState(useAuthStore.getInitialState(), true));

async function setup() {
  return renderHook(() => {
    const form = useLoginScreen();
    return {
      form,
      errors: form.formState.errors,
      email: useField(form.control, "email"),
      password: useField(form.control, "password"),
    };
  });
}
test("rechaza campos vacíos y email inválido sin invocar el servicio", async () => {
  const { result } = await setup();
  await act(() => result.current.form.onSubmit());
  expect(result.current.errors.email).toBeDefined();
  expect(result.current.errors.password).toBeDefined();
  await act(() => result.current.email.onChange("correo"));
  await act(() => result.current.password.onChange("Demo1234!"));
  await act(() => result.current.form.onSubmit());
  expect(result.current.errors.email).toBeDefined();
  expect(signIn).not.toHaveBeenCalled();
  expect(mockRouter.replace).not.toHaveBeenCalled();
});
test.each(["respuesta", "excepción"])(
  "conserva los campos ante %s de error y permite reintentar",
  async (kind) => {
    const error = {
      name: "SERVER_ERROR" as const,
      title: "Error",
      message: "Sin conexión",
    };
    const service = jest.mocked(signIn);
    if (kind === "respuesta")
      service.mockResolvedValueOnce({ success: false, data: error });
    else service.mockRejectedValueOnce(new Error("Sin conexión"));
    service.mockResolvedValueOnce({ success: true });
    const { result } = await setup();
    await act(() => {
      result.current.email.onChange("demo@kambista.com");
      result.current.password.onChange("Demo1234!");
    });
    await act(() => result.current.form.onSubmit());
    expect(result.current.form.serviceError?.name).toBe("SERVER_ERROR");
    expect(result.current.password.value).toBe("Demo1234!");
    expect(mockRouter.replace).not.toHaveBeenCalled();
    await act(() => result.current.form.onSubmit());
    expect(result.current.form.serviceError).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(mockRouter.replace).toHaveBeenCalledWith("/register");
  },
);
