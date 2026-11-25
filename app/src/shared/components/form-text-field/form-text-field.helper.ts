export function toInputValue(value: unknown) {
  if (typeof value === "string") return value;
  return value === null || value === undefined ? "" : String(value);
}
