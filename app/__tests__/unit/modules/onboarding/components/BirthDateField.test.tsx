import { yupResolver } from "@hookform/resolvers/yup";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import { BirthDateField } from "@/modules/onboarding/components/BirthDateField";
import {
  profileSchema,
  type ProfileFormValues,
} from "@/modules/onboarding/schemas/profile.schema";

function Harness() {
  const { control } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
    defaultValues: { birthDate: "" },
  });
  return <BirthDateField control={control} />;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 10, 25, 12));
});

afterEach(() => {
  jest.useRealTimers();
});

test("ofrece el año actual y bloquea las fechas futuras", async () => {
  await render(<Harness />);
  await fireEvent.press(screen.getByRole("button", { name: "Fecha de nacimiento" }));
  await fireEvent.press(screen.getByRole("button", { name: "Elegir año" }));
  expect(screen.getByRole("button", { name: "2026" })).toBeOnTheScreen();
  expect(screen.queryByRole("button", { name: "2027" })).toBeNull();
  await fireEvent.press(screen.getByRole("button", { name: "2026" }));
  expect(screen.getByRole("button", { name: "Mes siguiente" })).toBeDisabled();
  expect(
    screen.getByRole("gridcell", { name: /26 de noviembre de 2026/ }),
  ).toBeDisabled();
});

test("ofrece 1900 como primer año e impide retroceder a 1899", async () => {
  await render(<Harness />);
  await fireEvent.press(screen.getByRole("button", { name: "Fecha de nacimiento" }));
  await fireEvent.press(screen.getByRole("button", { name: "Elegir año" }));
  await fireEvent.changeText(screen.getByLabelText("Buscar año"), "1899");
  expect(screen.getByText("No hay años disponibles")).toBeOnTheScreen();
  await fireEvent.changeText(screen.getByLabelText("Buscar año"), "1900");
  await fireEvent.press(screen.getByRole("button", { name: "1900" }));
  await fireEvent.press(screen.getByRole("button", { name: "Elegir mes" }));
  await fireEvent.press(screen.getByRole("button", { name: "enero" }));
  expect(screen.getByRole("button", { name: "Mes anterior" })).toBeDisabled();
  await fireEvent.press(
    screen.getByRole("gridcell", { name: /\b1 de enero de 1900/ }),
  );
  await fireEvent.press(screen.getByRole("button", { name: "ACEPTAR" }));
  expect(screen.getByText("01/01/1900")).toBeOnTheScreen();
});

test("permite elegir una fecha reciente y muestra el error de mayoría de edad", async () => {
  await render(<Harness />);
  await fireEvent.press(screen.getByRole("button", { name: "Fecha de nacimiento" }));
  await fireEvent.press(
    screen.getByRole("gridcell", { name: /25 de noviembre de 2026/ }),
  );
  await fireEvent.press(screen.getByRole("button", { name: "ACEPTAR" }));
  expect(screen.getByText("25/11/2026")).toBeOnTheScreen();
  expect(
    screen.getByText("Ingresa una fecha válida; debes ser mayor de edad"),
  ).toBeOnTheScreen();
});
