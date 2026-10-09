import { createAuthClient } from "better-auth/react";

/**
 * Better-Auth React Client
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
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} = authClient as unknown as {
  signIn: typeof authClient.signIn;
  signUp: typeof authClient.signUp;
  signOut: typeof authClient.signOut;
  useSession: typeof authClient.useSession;
  getSession?: (params?: unknown) => Promise<unknown>;
  sendVerificationEmail: (params: {
    email: string;
    callbackURL?: string;
  }) => Promise<{ error?: { message?: string }; data?: unknown }>;
  requestPasswordReset: (params: {
    email: string;
    redirectTo?: string;
  }) => Promise<{ error?: { message?: string }; data?: unknown }>;
  resetPassword: (params: {
    newPassword: string;
    token: string;
  }) => Promise<{ error?: { message?: string }; data?: unknown }>;
  verifyEmail: (params: {
    query: { token: string };
  }) => Promise<{ error?: { message?: string }; data?: unknown }>;
};

export default authClient;
