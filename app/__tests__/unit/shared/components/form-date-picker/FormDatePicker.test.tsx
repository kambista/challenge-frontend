import { fireEvent, render, screen } from "@testing-library/react-native";
import { useForm } from "react-hook-form";
import { FormDatePicker } from "@/shared/components/form-date-picker";

function Harness({ value = "" }: { value?: string }) {
  const { control } = useForm({ defaultValues: { birthDate: value } });
  return (
    <FormDatePicker
      control={control}
      label="Nacimiento"
      name="birthDate"
      maximumDate={new Date(2008, 1, 28)}
      initialDate={new Date(2008, 0, 31)}
    />
  );
}

test("busca años y cambia el mes sin confirmar una fecha implícita", async () => {
  await render(<Harness />);
  await fireEvent.press(screen.getByRole("button", { name: "Nacimiento" }));
  expect(screen.getByRole("button", { name: "ACEPTAR" })).toBeDisabled();

  await fireEvent.press(screen.getByRole("button", { name: "Elegir año" }));
  await fireEvent.changeText(screen.getByLabelText("Buscar año"), "18a96");
  await fireEvent.press(screen.getByRole("button", { name: "1896" }));
  await fireEvent.press(screen.getByRole("button", { name: "Elegir mes" }));
  await fireEvent.press(screen.getByRole("button", { name: "febrero" }));
  await fireEvent.press(
    screen.getByRole("gridcell", { name: /29 de febrero de 1896/ }),
  );
  await fireEvent.press(screen.getByRole("button", { name: "ACEPTAR" }));
  expect(screen.getByText("29/02/1896")).toBeOnTheScreen();
});
test("cancelar conserva el valor anterior", async () => {
  await render(<Harness value="1896-02-29" />);
  await fireEvent.press(screen.getByRole("button", { name: "Nacimiento" }));
  await fireEvent.press(screen.getByRole("button", { name: "Mes siguiente" }));
  await fireEvent.press(
    screen.getByRole("gridcell", { name: /\b1 de marzo de 1896/ }),
  );
  await fireEvent.press(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.getByText("29/02/1896")).toBeOnTheScreen();
});
test("respeta el límite y cerrar conserva el valor anterior", async () => {
  await render(<Harness value="1896-02-29" />);
  await fireEvent.press(screen.getByRole("button", { name: "Nacimiento" }));
  await fireEvent.press(screen.getByRole("button", { name: "Elegir año" }));
  expect(screen.getByRole("button", { name: "1896" })).toBeOnTheScreen();
  await fireEvent.changeText(screen.getByLabelText("Buscar año"), "2008");
  await fireEvent.press(screen.getByRole("button", { name: "2008" }));
  expect(screen.getByRole("button", { name: "Mes siguiente" })).toBeDisabled();
  await fireEvent.press(screen.getByRole("button", { name: "Elegir mes" }));
  expect(screen.getByRole("button", { name: "marzo" })).toBeDisabled();
  await fireEvent.press(
    screen.getByRole("button", { name: "Volver al calendario" }),
  );
  expect(
    screen.getByRole("gridcell", { name: /29 de febrero de 2008/ }),
  ).toBeDisabled();
  await fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
  expect(screen.getByText("29/02/1896")).toBeOnTheScreen();
});
