/**
 * Time utility functions for formatting and normalizing schedule hours
 */

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
  let h = parseInt(hStr, 10) || 0;
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
