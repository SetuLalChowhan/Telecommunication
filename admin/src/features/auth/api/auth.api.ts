import { http } from "@/lib/api/client";
import { ApiError } from "@/lib/api/error";
import type { CurrentUser } from "../types";

/**
 * Fetch the authenticated user's profile.
 *
 * Returns `null` on 401 so "signed out" resolves to a normal value; every other
 * failure (5xx, network) propagates so an outage is never rendered as a
 * signed-out state.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await http.get<CurrentUser>("/users/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    throw error;
  }
}
