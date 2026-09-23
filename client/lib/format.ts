/**
 * Fixed-locale, fixed-timezone formatters.
 *
 * Dates are rendered on the server (RSC) and again on the client after
 * hydration. Using the host locale/timezone would make the two disagree and
 * trigger a hydration mismatch, so both sides go through these formatters with
 * an explicit locale and UTC.
 */

const LONG_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatLongDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return LONG_DATE.format(date);
}

export function formatShortDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return SHORT_DATE.format(date);
}
