import { createAuthClient } from "better-auth/react";

/**
 * =============================================================================
 * authClient
 * =============================================================================
 * Purpose:
 *   Official Better-Auth client configured for Next.js.
 *   Handles session cookies (better-auth.session_token), reactive useSession() hook,
 *   email/password authentication, Google OAuth, and password reset flows.
 * =============================================================================
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000",
  fetchOptions: {
    credentials: "include",
  },
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} = authClient;

export default authClient;
