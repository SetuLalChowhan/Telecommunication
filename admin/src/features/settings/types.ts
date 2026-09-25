/** Response of `GET /users/me/settings` (row is created on first read). */
export interface UserSettings {
  id: string;
  userId: string;
  language: string;
  theme: string;
  timezone: string;
  emailAlerts: boolean;
  pushAlerts: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserSettingsPayload {
  language?: string;
  theme?: string;
  timezone?: string;
  emailAlerts?: boolean;
  pushAlerts?: boolean;
  weeklyDigest?: boolean;
  marketingEmails?: boolean;
}

/** `PATCH /users/profile` (multipart) editable fields. */
export interface UpdateProfilePayload {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
}

export const settingsKeys = {
  all: ["admin", "settings"] as const,
  me: () => [...settingsKeys.all, "me"] as const,
};

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English (US)" },
  { value: "es", label: "Español (ES)" },
  { value: "fr", label: "Français (FR)" },
  { value: "de", label: "Deutsch (DE)" },
  { value: "bn", label: "বাংলা (BN)" },
] as const;

export const THEME_OPTIONS = [
  { value: "light", label: "Light mode" },
  { value: "dark", label: "Dark mode" },
  { value: "system", label: "System preference" },
] as const;

export const TIMEZONE_OPTIONS = [
  { value: "UTC-05:00", label: "UTC-05:00 Eastern Standard Time" },
  { value: "UTC+00:00", label: "UTC+00:00 Coordinated Universal Time" },
  { value: "UTC+01:00", label: "UTC+01:00 Central European Time" },
  { value: "UTC+06:00", label: "UTC+06:00 Bangladesh Standard Time" },
  { value: "UTC+08:00", label: "UTC+08:00 Singapore Standard Time" },
] as const;
