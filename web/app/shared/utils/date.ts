export const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const;

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, month) => ({
  value: month,
  label: new Intl.DateTimeFormat('es-PE', { month: 'long' }).format(new Date(2020, month, 1)),
}));

export function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear }, (_, offset) => currentYear - offset);
}

export function civilDate(year: number, month: number, day: number) {
  const date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month, day);
  return date;
}

export function parseDate(value: string): Date | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const localized = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const year = Number(iso?.[1] ?? localized?.[3]);
  const month = Number(iso?.[2] ?? localized?.[2]);
  const day = Number(iso?.[3] ?? localized?.[1]);
  if (!year || !month || !day) return null;

  const date = civilDate(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
}

export function toIso(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).padStart(4, '0');
  return `${day}/${month}/${year}`;
}

export interface CalendarDay {
  date: Date;
  iso: string;
  day: number;
  currentMonth: boolean;
  today: boolean;
  selected: boolean;
  future: boolean;
  label: string;
}

export function getCalendarDay(
  index: number,
  start: Date,
  month: number,
  today: string,
  selected: string,
): CalendarDay {
  const date = civilDate(start.getFullYear(), start.getMonth(), start.getDate() + index);
  const iso = toIso(date);
  return {
    date,
    iso,
    day: date.getDate(),
    currentMonth: date.getMonth() === month,
    today: iso === today,
    selected: iso === selected,
    future: iso > today,
    label: new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date),
  };
}

export function getCalendarDays(visibleMonth: Date, selectedIso: string): CalendarDay[] {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = civilDate(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const start = civilDate(year, month, 1 - mondayOffset);
  const today = toIso(new Date());

  const dayCount = civilDate(year, month + 1, 0).getDate();
  const weekCount = Math.ceil((mondayOffset + dayCount) / 7);
  return Array.from({ length: weekCount * 7 }, (_, index) =>
    getCalendarDay(index, start, month, today, selectedIso),
  );
}
