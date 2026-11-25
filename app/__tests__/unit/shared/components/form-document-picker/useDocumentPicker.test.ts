import { act, renderHook } from "@testing-library/react-native";
import * as DocumentPicker from "expo-document-picker";
import { useDocumentPicker } from "@/shared/components/form-document-picker/useDocumentPicker";

jest.mock("expo-document-picker", () => ({ getDocumentAsync: jest.fn() }));

test("conserva la constancia ante cancelación o error del selector y permite reintentar", async () => {
  const onSelect = jest.fn();
  const pick = jest.mocked(DocumentPicker.getDocumentAsync);
  pick
    .mockResolvedValueOnce({ canceled: true, assets: null })
    .mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce({
      canceled: false,
      assets: [
        {
          uri: "file:///demo.pdf",
          name: "demo.pdf",
          size: 1024,
          lastModified: 0,
        },
      ],
    })
    .mockResolvedValueOnce({ canceled: true, assets: null });
  const { result } = await renderHook(() =>
    useDocumentPicker(onSelect, ["application/pdf"]),
  );
  await act(() => result.current.handleChooseFile());
  expect(onSelect).not.toHaveBeenCalled();
  await act(() => result.current.handleChooseFile());
  expect(result.current.pickerError).toContain("No pudimos abrir");
  await act(() => result.current.handleChooseFile());
  expect(result.current.pickerError).toBe("");
  expect(onSelect).toHaveBeenCalledWith({ name: "demo.pdf", size: 1024 });
  await act(() => result.current.handleChooseFile());
  expect(onSelect).toHaveBeenCalledTimes(1);
});
