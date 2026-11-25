import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { OperationGate } from "@/modules/transactions/components/OperationGate";
import { useOperationGate } from "@/modules/transactions/hooks/useOperationGate";
jest.mock("@/modules/transactions/hooks/useOperationGate", () => ({
  useOperationGate: jest.fn(),
}));
jest.mock("expo-router", () => {
  const { Text: MockText } = jest.requireActual("react-native");
  return {
    Redirect: ({ href }: { href: string }) => <MockText>{href}</MockText>,
  };
});
test.each([true, false])(
  "oculta contenido protegido con foco=%s",
  async (isFocused) => {
    jest
      .mocked(useOperationGate)
      .mockReturnValue({ redirect: "/operation/details", isFocused });
    const view = await render(
      <OperationGate step="success">
        <Text>Resumen protegido</Text>
      </OperationGate>,
    );
    expect(view.queryByText("Resumen protegido")).toBeNull();
    expect(Boolean(view.queryByText("/operation/details"))).toBe(isFocused);
  },
);
test("muestra el contenido cuando el guard autoriza el paso", async () => {
  jest
    .mocked(useOperationGate)
    .mockReturnValue({ redirect: null, isFocused: true });
  const view = await render(
    <OperationGate step="success">
      <Text>Resumen protegido</Text>
    </OperationGate>,
  );
  expect(view.getByText("Resumen protegido")).toBeOnTheScreen();
});
