import { useState } from "react";
import { civilDate, formatDate, parseDate } from "./date-picker.helper";
import type { DatePickerOptions } from "./date-picker.types";

export function useDatePicker({
  value,
  onChange,
  onBlur,
  minimumDate,
  maximumDate,
  initialDate,
}: DatePickerOptions) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date | null>(null);
  const [shownMonth, setShownMonth] = useState(() => civilDate(2000, 0, 1));
  const [view, setView] = useState<"days" | "months" | "years">("days");
  const [yearQuery, setYearQuery] = useState("");
  const dateLimit = maximumDate ?? civilDate(9999, 11, 31);
  const dateStart = minimumDate ?? civilDate(1, 0, 1);
  const firstYear = dateStart.getFullYear();
  const firstMonth = dateStart.getMonth();
  const year = shownMonth.getFullYear();
  const month = shownMonth.getMonth();
  const lastYear = dateLimit.getFullYear();
  const lastMonth = dateLimit.getMonth();
  const canGoBack = year > firstYear || month > firstMonth;
  const canGoForward = year < lastYear || month < lastMonth;
  const years =
    view === "years"
      ? Array.from(
          { length: Math.max(0, lastYear - firstYear + 1) },
          (_, index) => lastYear - index,
        ).filter((option) => String(option).padStart(4, "0").includes(yearQuery))
      : [];
  const firstWeekday = (shownMonth.getDay() + 6) % 7;
  const daysInMonth = civilDate(
    shownMonth.getFullYear(),
    shownMonth.getMonth() + 1,
    0,
  ).getDate();
  const calendarCells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);
  const currentValue = typeof value === "string" ? parseDate(value) : null;
  const displayValue = currentValue
    ? formatDate(currentValue).split("-").reverse().join("/")
    : "DD/MM/AAAA";
  function handleOpenPicker() {
    const startDate = currentValue ?? initialDate ?? new Date();
    const start =
      startDate > dateLimit
        ? dateLimit
        : startDate < dateStart
          ? dateStart
          : startDate;
    setShownMonth(civilDate(start.getFullYear(), start.getMonth(), 1));
    setDraft(
      currentValue && currentValue >= dateStart && currentValue <= dateLimit
        ? currentValue
        : null,
    );
    setView("days");
    setOpen(true);
  }
  function handleCancel() {
    setOpen(false);
  }
  function handleChangeMonth(offset: number) {
    if ((offset < 0 && !canGoBack) || (offset > 0 && !canGoForward)) return;
    setShownMonth(civilDate(year, month + offset, 1));
  }
  function handleSelectMonth(nextMonth: number) {
    setShownMonth(civilDate(year, nextMonth, 1));
    setView("days");
  }
  function handleSelectYear(nextYear: number) {
    if (nextYear < firstYear || nextYear > lastYear) return;
    const nextMonth =
      nextYear === lastYear
        ? Math.min(month, lastMonth)
        : nextYear === firstYear
          ? Math.max(month, firstMonth)
          : month;
    setShownMonth(civilDate(nextYear, nextMonth, 1));
    setView("days");
  }
  function handleShowYears() {
    setYearQuery("");
    setView("years");
  }
  function handleYearQuery(text: string) {
    setYearQuery(text.replace(/[^0-9]/g, "").slice(0, 4));
  }
  function handleSelectDay(day: number) {
    const selected = civilDate(year, month, day);
    if (selected >= dateStart && selected <= dateLimit) setDraft(selected);
  }
  function confirm(date: Date) {
    onChange(formatDate(date));
    onBlur();
    handleCancel();
  }
  function handleAcceptDraft() {
    if (draft && draft >= dateStart && draft <= dateLimit) confirm(draft);
  }
  return {
    open,
    view,
    setView,
    yearQuery,
    years,
    canGoBack,
    canGoForward,
    handleShowYears,
    handleYearQuery,
    handleSelectMonth,
    handleSelectYear,
    draft,
    dateLimit,
    dateStart,
    shownMonth,
    calendarCells,
    displayValue,
    handleOpenPicker,
    handleCancel,
    handleChangeMonth,
    handleSelectDay,
    handleAcceptDraft,
  };
}
