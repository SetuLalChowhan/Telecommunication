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

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  role?: "PATIENT" | "DOCTOR";
}

/**
 * Sign in using Better-Auth email/password
 */
export async function loginWithEmail(credentials: LoginCredentials) {
  const res = await authClient.signIn.email({
    email: credentials.email,
    password: credentials.password || "",
    rememberMe: credentials.rememberMe ?? true,
  });

  if (res.error) {
    throw new Error(res.error.message || "Failed to sign in");
  }

  return res.data;
}

/**
 * Sign up using Better-Auth
 */
export async function registerWithEmail(credentials: RegisterCredentials) {
  const res = await authClient.signUp.email({
    name: credentials.name,
    email: credentials.email,
    password: credentials.password || "",
    role: credentials.role || "PATIENT",
  } as unknown as Parameters<typeof authClient.signUp.email>[0]);

  if (res.error) {
    throw new Error(res.error.message || "Failed to register account");
  }

  return res.data;
}

/**
 * Sign out
 */
export async function logoutUser() {
  const res = await authClient.signOut();
  if (res.error) {
    throw new Error(res.error.message || "Failed to log out");
  }
  return res.data;
}

export default authClient;
