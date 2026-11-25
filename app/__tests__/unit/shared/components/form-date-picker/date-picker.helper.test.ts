import {
  civilDate,
  formatDate,
  parseDate,
  sameDay,
} from "@/shared/components/form-date-picker/date-picker.helper";

test.each(["", "2000-02-30", "1900-02-29", "2026-13-01", "0000-01-01"])(
  "rechaza fecha inexistente %s",
  (value) => {
    expect(parseDate(value)).toBeNull();
  },
);
test.each(["2000-02-29", "0004-02-29", "1896-12-31"])(
  "conserva fecha civil %s",
  (value) => {
    expect(formatDate(parseDate(value)!)).toBe(value);
  },
);
test("compara fechas civiles independientemente de la hora", () => {
  const morning = civilDate(2000, 1, 29);
  const evening = civilDate(2000, 1, 29);
  evening.setHours(23);
  expect(sameDay(morning, evening)).toBe(true);
  expect(sameDay(morning, civilDate(2000, 2, 1))).toBe(false);
});
