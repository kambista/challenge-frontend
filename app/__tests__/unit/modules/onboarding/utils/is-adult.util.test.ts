import { isAdult } from "@/modules/onboarding/utils/is-adult.util";
test.each([
  ["2008-11-24", true],
  ["2008-11-25", false],
  ["2027-01-01", false],
  ["2000-02-29", true],
  ["1900-02-29", false],
  ["2000-04-31", false],
  ["0004-02-29", true],
  ["0000-02-29", false],
  ["", false],
])("valida %s con el calendario civil", (date, valid) => {
  expect(isAdult(date, new Date(2026, 10, 24))).toBe(valid);
});
