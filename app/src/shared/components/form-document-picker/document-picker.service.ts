import * as DocumentPicker from "expo-document-picker";
import type { SelectedDocument } from "./document-picker.types";

export async function selectDocument(
  acceptedTypes: string[],
): Promise<SelectedDocument | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: acceptedTypes,
    copyToCacheDirectory: false,
    multiple: false,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  return { name: asset.name, size: asset.size ?? asset.file?.size ?? null };
}
