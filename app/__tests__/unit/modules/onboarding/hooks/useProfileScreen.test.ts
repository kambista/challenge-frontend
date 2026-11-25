import { mockRouter } from "../../../../support/router";
import { useField } from "../../../../support/form";
import { act, renderHook } from "@testing-library/react-native";
import { useProfileScreen } from "@/modules/onboarding/hooks/useProfileScreen";
import { createProfile } from "@/modules/onboarding/services/profile.service";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

jest.mock("@/modules/onboarding/services/profile.service", () => ({
  createProfile: jest.fn(),
}));
beforeEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState(), true);
  useAuthStore.getState().startSession("demo@kambista.com");
});
async function setup() {
  const view = await renderHook(() => {
    const form = useProfileScreen();
    return {
      form,
      errors: form.formState.errors,
      name: useField(form.control, "firstName"),
      document: useField(form.control, "documentNumber"),
      phone: useField(form.control, "phone"),
      birthDate: useField(form.control, "birthDate"),
      terms: useField(form.control, "acceptTerms"),
    };
  });
  await act(() => {
    view.result.current.name.onChange("Ana Pérez");
    view.result.current.document.onChange("00012345");
    view.result.current.phone.onChange("901234567");
    view.result.current.birthDate.onChange("1990-01-01");
  });
  return view;
}
test("exige términos antes de guardar", async () => {
  const { result } = await setup();
  await act(() => result.current.form.onSubmit());
  expect(result.current.errors.acceptTerms).toBeDefined();
  expect(createProfile).not.toHaveBeenCalled();
});
test.each([
  "DUPLICATE_DNI",
  "INVALID_PHONE",
  "SERVER_ERROR",
  "excepción",
] as const)(
  "maneja %s conservando los datos y permite reintento",
  async (name) => {
    const service = jest.mocked(createProfile);
    if (name === "excepción")
      service.mockRejectedValueOnce(new Error("Sin conexión"));
    else
      service.mockResolvedValueOnce({
        success: false,
        data: { name, title: "Error", message: "Reintenta" },
      });
    service.mockResolvedValueOnce({ success: true });
    const { result } = await setup();
    await act(() => result.current.terms.onChange(true));
    await act(() => result.current.form.onSubmit());
    expect(result.current.form.serviceError?.name).toBe(
      name === "excepción" ? "SERVER_ERROR" : name,
    );
    expect(result.current.document.value).toBe("00012345");
    expect(mockRouter.replace).not.toHaveBeenCalled();
    await act(() => result.current.form.handleDismissError());
    expect(result.current.form.serviceError).toBeNull();
    await act(() => result.current.form.onSubmit());
    expect(createProfile).toHaveBeenLastCalledWith(
      expect.objectContaining({ acceptPrivacy: false }),
    );
    expect(useAuthStore.getState().isProfileComplete).toBe(true);
    expect(mockRouter.replace).toHaveBeenCalledWith("/registration-success");
  },
);
test("cierra sesión desde el perfil", async () => {
  const { result } = await setup();
  await act(() => result.current.form.handleSignOut());
  expect(useAuthStore.getState().isAuthenticated).toBe(false);
  expect(mockRouter.replace).toHaveBeenCalledWith("/login");
});
