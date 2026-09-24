/**
 * Time utility functions for formatting and normalizing schedule hours
 */

/**
 * Timezone every date is formatted in.
 *
 * Client components are also server-rendered, so anything that formats a date
 * is executed twice — once on the server (UTC by default) and once in the
 * browser (the visitor's local zone). Unpinned `toLocaleDateString()` therefore
 * produces different text on the two passes and React throws a hydration
 * mismatch. Pinning a single zone keeps both passes byte-identical, and gives
 * the platform one consistent "clinical time" regardless of where the visitor
 * happens to be.
 */
export const APP_TIME_ZONE =
  process.env.NEXT_PUBLIC_TIME_ZONE || "Asia/Dhaka";

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(
  options: Intl.DateTimeFormatOptions,
  locale = "en-US"
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatterCache.get(key);

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      timeZone: APP_TIME_ZONE,
    });
    formatterCache.set(key, formatter);
  }

  return formatter;
}

/** Parses an ISO string / Date into a valid Date, or null. */
export function toValidDate(value?: string | number | Date | null): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const DATE_SHORT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

const DATE_LONG: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
};

/** "Sep 22, 2026" (or "September 22, 2026"). Returns `fallback` when invalid. */
export function formatDate(
  value?: string | number | Date | null,
  variant: "short" | "long" = "short",
  fallback = "—"
): string {
  const date = toValidDate(value);
  if (!date) return fallback;
  return getFormatter(variant === "long" ? DATE_LONG : DATE_SHORT).format(date);
}

/** "09:30 AM" — always 12-hour, app timezone. */
export function formatTime(
  value?: string | number | Date | null,
  fallback = "—"
): string {
  const date = toValidDate(value);
  if (!date) return fallback;
  return getFormatter({
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/** "09:30" on a 24-hour clock. */
export function formatTime24(
  value?: string | number | Date | null,
  fallback = "—"
): string {
  const date = toValidDate(value);
  if (!date) return fallback;
  return getFormatter({
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/** "Sep 22, 2026 · 09:30 AM" */
export function formatDateTime(
  value?: string | number | Date | null,
  fallback = "—"
): string {
  const date = toValidDate(value);
  if (!date) return fallback;
  return `${formatDate(date, "short")} · ${formatTime(date)}`;
}

/** "Mon" */
export function formatWeekdayShort(value?: string | number | Date | null): string {
  const date = toValidDate(value);
  if (!date) return "";
  return getFormatter({ weekday: "short" }).format(date);
}

/** "Sep" */
export function formatMonthShort(value?: string | number | Date | null): string {
  const date = toValidDate(value);
  if (!date) return "";
  return getFormatter({ month: "short" }).format(date);
}

/**
 * "YYYY-MM-DD" in the app timezone — the value format `<input type="date">`
 * and the API both expect. Never use `toISOString().slice(0, 10)` for this: that
 * silently shifts by a day for anyone outside UTC.
 */
export function toDateInputValue(value?: string | number | Date | null): string {
  const date = toValidDate(value);
  if (!date) return "";
  const parts = getFormatter({
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

/** "Sep 22, 2026" for a date-only API field ("2026-09-22"), timezone-safe. */
export function formatDateOnly(
  value?: string | null,
  fallback = "—"
): string {
  if (!value) return fallback;
  // Date-only strings are calendar dates, not instants — anchor them at noon
  // UTC so no timezone can roll them into the neighbouring day.
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00Z` : value;
  return formatDate(normalized, "short", fallback);
}

/**
 * Relative label ("2h ago") computed against an explicit `now`.
 *
 * Relative time is clock-dependent, so it must never be rendered during SSR:
 * pass the same `now` on both passes, or render it only after mount.
 */
export function formatRelativeTime(
  value: string | number | Date | null | undefined,
  now: number
): string {
  const date = toValidDate(value);
  if (!date) return "";

  const diffMs = now - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(date, "short");
}

/** Calendar-day key ("2026-09-22") in the app timezone. */
export function appDayKey(value?: string | number | Date | null): string {
  return toDateInputValue(value);
}

/**
 * Classifies a timestamp against "today" as seen in the app timezone.
 * `today` is injectable so callers that render during SSR can pin it.
 */
export function relativeDayLabel(
  value?: string | number | Date | null,
  today: Date = new Date()
): "Today" | "Tomorrow" | "Yesterday" | null {
  const date = toValidDate(value);
  if (!date) return null;

  const target = appDayKey(date);
  const base = toValidDate(today);
  if (!base) return null;

  const baseKey = appDayKey(base);
  if (target === baseKey) return "Today";

  const dayMs = 86_400_000;
  const baseTime = Date.parse(`${baseKey}T00:00:00Z`);
  const targetTime = Date.parse(`${target}T00:00:00Z`);
  const delta = Math.round((targetTime - baseTime) / dayMs);

  if (delta === 1) return "Tomorrow";
  if (delta === -1) return "Yesterday";
  return null;
}

/**
 * Current year in the app timezone.
 *
 * Use this instead of `new Date().getFullYear()` in anything server-rendered
 * (copyright lines, date pickers): `getFullYear()` reads the host zone, so it
 * can disagree with the browser for a few hours each New Year.
 */
export function currentAppYear(now: Date = new Date()): number {
  return Number(toDateInputValue(now).slice(0, 4));
}

/**
 * Clock-stable anchor for "today": the current calendar day at 12:00 UTC.
 *
 * Noon is far enough from both midnight boundaries that no timezone can roll it
 * into a neighbouring day, so day arithmetic on top of it is deterministic.
 */
export function todayAnchor(now: Date = new Date()): Date {
  return new Date(`${toDateInputValue(now)}T12:00:00Z`);
}

export interface BookingDayItem {
  date: Date;
  dayName: string;
  dayNum: number;
  monthName: string;
  isToday: boolean;
  dateString: string;
}

/**
 * The bookable-day strip shown by the booking widget.
 *
 * Every field is derived with the pinned app timezone, so this produces
 * identical output on the server and in the browser. Building it from plain
 * `new Date()` during render is what previously made the doctor page throw a
 * React hydration mismatch.
 *
 * Build it on the server and pass the result down as a prop.
 */
export function buildBookingDateStrip(
  count = 14,
  from: Date = new Date()
): BookingDayItem[] {
  const baseTime = todayAnchor(from).getTime();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(baseTime + index * 86_400_000);
    const dateString = toDateInputValue(date);

    return {
      date,
      dayName: formatWeekdayShort(date),
      dayNum: Number(dateString.slice(-2)),
      monthName: formatMonthShort(date),
      isToday: index === 0,
      dateString,
    };
  });
}

export interface TimeOption {
  value: string; // 24-hour HH:mm
  label: string; // 12-hour hh:mm AM/PM
}

/**
 * Normalizes any time string (e.g. "09:00 AM", "1:30 PM", "9:00", "13:30")
 * into strict 24-hour "HH:mm" format (e.g. "09:00", "13:30").
 */
export function to24Hour(timeStr?: string | null): string {
  if (!timeStr) return "09:00";
  const trimmed = timeStr.trim();

  // If already matches HH:mm (e.g., "09:00", "14:30")
  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(trimmed)) {
    return trimmed;
  }

  const isPM = /pm/i.test(trimmed);
  const isAM = /am/i.test(trimmed);
  const clean = trimmed.replace(/[^\d:]/g, "");
  const [hStr, mStr] = clean.split(":");
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;

  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Converts any 24-hour or 12-hour time string into a friendly "hh:mm A" format
 * (e.g. "13:00" -> "01:00 PM", "09:00" -> "09:00 AM").
 */
export function to12Hour(timeStr?: string | null): string {
  if (!timeStr) return "09:00 AM";
  const trimmed = timeStr.trim();

  // If already formatted with AM/PM
  if (/am|pm/i.test(trimmed)) {
    return trimmed;
  }

  const clean = trimmed.replace(/[^\d:]/g, "");
  const [hStr, mStr] = clean.split(":");
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;

  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;

  return `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export const TIME_OPTIONS: TimeOption[] = [
  { value: "06:00", label: "06:00 AM" },
  { value: "06:30", label: "06:30 AM" },
  { value: "07:00", label: "07:00 AM" },
  { value: "07:30", label: "07:30 AM" },
  { value: "08:00", label: "08:00 AM" },
  { value: "08:30", label: "08:30 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "09:30", label: "09:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "13:30", label: "01:30 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "14:30", label: "02:30 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "15:30", label: "03:30 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "16:30", label: "04:30 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "17:30", label: "05:30 PM" },
  { value: "18:00", label: "06:00 PM" },
  { value: "18:30", label: "06:30 PM" },
  { value: "19:00", label: "07:00 PM" },
  { value: "19:30", label: "07:30 PM" },
  { value: "20:00", label: "08:00 PM" },
  { value: "20:30", label: "08:30 PM" },
  { value: "21:00", label: "09:00 PM" },
  { value: "21:30", label: "09:30 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "22:30", label: "10:30 PM" },
  { value: "23:00", label: "11:00 PM" },
];
