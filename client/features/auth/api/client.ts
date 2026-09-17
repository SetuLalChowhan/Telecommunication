import { createAuthClient } from "better-auth/react";
import { apiClient } from "@/lib/api/axios";

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
} = authClient;

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
  } as any);

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
