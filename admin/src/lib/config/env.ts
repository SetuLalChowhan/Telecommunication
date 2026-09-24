/**
 * Typed access to the environment values the admin bundle is allowed to expose.
 *
 * Only `VITE_*` variables are inlined into the browser bundle. Never put server
 * secrets, database URLs or private API keys behind a `VITE_` prefix.
 */
const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

if (!apiUrl) {
  // Fail loud so a misconfigured build is obvious at runtime instead of
  // silently firing requests at the current origin.
  console.error(
    "[admin] VITE_API_URL is not set. API requests will fail. Add it to admin/.env.",
  );
}

export const API_BASE_URL: string = apiUrl ?? "";
