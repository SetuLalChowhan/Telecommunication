import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/config/env";

/**
 * Better-Auth React Client
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PRIVATE_BETTER_AUTH_URL ||
    process.env.NEXT_PRIVATE_API_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    env.NEXT_PRIVATE_BETTER_AUTH_URL ||
    env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:5000",
  fetchOptions: {
    credentials: "include",
    auth: {
      type: "Bearer",
      token: () => {
        if (typeof window !== "undefined") {
          return localStorage.getItem("auth_token") || "";
        }
        return "";
      },
    },
    onRequest: (context) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          context.headers.set("Authorization", `Bearer ${token}`);
        }
      }
    },
    onResponse: (context) => {
      if (typeof window !== "undefined") {
        const token = context.response.headers.get("set-auth-token");
        if (token && typeof token === "string") {
          localStorage.setItem("auth_token", token);
        }
      }
    },
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
