import { useState } from "react";
import { selectDocument } from "./document-picker.service";
import type { SelectedDocument } from "./document-picker.types";

export function useDocumentPicker(
  onSelect: (file: SelectedDocument) => void,
  acceptedTypes = ["*/*"],
) {
  const [pickerError, setPickerError] = useState("");
  async function handleChooseFile() {
    setPickerError("");
    try {
      const selection = await selectDocument(acceptedTypes);
      if (selection) onSelect(selection);
    } catch {
      setPickerError("No pudimos abrir tus archivos. Intenta nuevamente.");
    }
  }
  return { pickerError, handleChooseFile };
}
