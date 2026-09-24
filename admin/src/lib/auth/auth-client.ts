import { createAuthClient } from "better-auth/react";
import { API_BASE_URL } from "@/lib/config/env";
import { setAuthToken } from "./token";

/**
 * The Better Auth client for the admin SPA.
 *
 * The server exposes its session token via the `set-auth-token` response header
 * (Better Auth `bearer()` plugin). We capture it here once, so every subsequent
 * API call can authenticate with a bearer header instead of relying on a
 * cross-origin cookie.
 *
 * This is the *same* auth system the client and server use — not a second one.
 */
export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  fetchOptions: {
    credentials: "include",
    onSuccess: (ctx) => {
      const token = ctx.response?.headers.get("set-auth-token");
      if (token) {
        setAuthToken(token);
      }
    },
  },
});

export default authClient;
