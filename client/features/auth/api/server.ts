import { serverFetch, serverGet, ServerFetchOptions } from "@/lib/api/server";
import { CACHE } from "@/lib/cache/policy";

import { ServerSessionResponse, SessionUser, User } from "../types";
export type { SessionUser, ServerSessionResponse };

/**
 * Fetch the Better-Auth session from a Server Component.
 *
 * `/api/auth/get-session` is a Better-Auth endpoint, so it is not wrapped in
 * the app's response envelope — it uses the raw server client. Cookie
 * forwarding is handled once by that client.
 *
 * Returns `null` on failure so callers fail closed (treat as signed out).
 */
export async function getSessionServer(
  options?: ServerFetchOptions
): Promise<ServerSessionResponse | null> {
  try {
    return await serverFetch<ServerSessionResponse>(
      "/api/auth/get-session",
      options
    );
  } catch {
    return null;
  }
}

/**
 * Fetch the authenticated user's profile.
 *
 * Uses the exact same query key as `useAuth()` (`authKeys.profile()`), so a
 * dashboard page that prefetches this renders the real user — name, role and
 * doctor verification state — on the very first paint instead of flashing a
 * loading/default state while the client refetches `/users/me`.
 */
export async function getProfileServer(
  options?: ServerFetchOptions
): Promise<User | null> {
  try {
    return await serverGet<User>("/users/me", {
      ...CACHE.private.server,
      ...options,
    });
  } catch {
    return null;
  }
}
