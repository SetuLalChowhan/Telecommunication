import { http } from "@/lib/api/client";
import type { CurrentUser } from "@/features/auth/types";
import type { UpdateProfilePayload, UpdateUserSettingsPayload, UserSettings } from "../types";

/**
 * Account settings endpoints (authenticated user, any role):
 *
 *   GET   /users/me/settings   -> preferences + notification channels
 *   PATCH /users/me/settings   -> update preferences
 *   PATCH /users/profile       -> update profile (multipart, optional avatar)
 */

export async function getSettings(): Promise<UserSettings> {
  return http.get<UserSettings>("/users/me/settings");
}

export async function updateSettings(
  payload: UpdateUserSettingsPayload,
): Promise<UserSettings> {
  return http.patch<UserSettings>("/users/me/settings", payload);
}

/**
 * Updates the profile and optionally replaces the avatar.
 *
 * Sent as `multipart/form-data`. The Content-Type header is intentionally left
 * for axios/the browser to set so the multipart boundary is correct.
 */
export async function updateProfile(
  payload: UpdateProfilePayload,
  image?: File | null,
): Promise<CurrentUser> {
  const form = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null && value !== "") {
      form.append(key, String(value));
    }
  }
  if (image) {
    form.append("image", image);
  }

  return http.patch<CurrentUser>("/users/profile", form);
}
