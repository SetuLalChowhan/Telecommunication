"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
} from "./client";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/lib/api/error";
import { CACHE } from "@/lib/cache/policy";
import { toast } from "react-toastify";
import { User, Role, LoginParams, RegisterParams, authKeys } from "../types";

/**
 * Helper to determine dashboard route based on user role and verification status
 */
export function getRoleDashboardRoute(role?: Role | string | null, isVerified?: boolean): string {
  switch (role) {
    case "DOCTOR":
      return isVerified === false ? "/doctor-verification" : "/doctor/dashboard";
    case "PATIENT":
      return "/patient/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/patient/dashboard";
  }
}

/**
 * useAuth Hook
 *
 * The single authentication hook for the app. Better-Auth's HTTP-only session
 * is the sole source of truth — there is no second (localStorage) auth cache to
 * drift out of sync.
 */
export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Session & current user resolution
  const { data: session, isPending: isSessionLoading } = useSession();

  // Fetch the full backend profile. The query key matches `authProfilePrefetch`
  // in `../api/server`, so dashboard pages hydrate this entry on the server
  // and public pages (like Home) instantly resolve the active user from cache or backend.
  const { data: profileUser, isLoading: isProfileLoading } = useQuery<User | null>({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        const res = await apiClient.get("/users/me");
        return res.data?.data || res.data || null;
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    staleTime: CACHE.profile.client.staleTime,
    retry: (failureCount, error) => {
      // A missing/expired session is a normal signed-out state, not a fault.
      if (error instanceof ApiError && error.status === 401) return false;
      return failureCount < 1;
    },
  });

  const user = profileUser || (session?.user as unknown as User) || null;
  const isAuthenticated = Boolean(user);
  const role = (user?.role as Role) || "PATIENT";
  const isAuthLoading = !user && (isProfileLoading || isSessionLoading);

  // 2. Auth mutations

  // Email & Password Login
  const loginMutation = useMutation({
    mutationFn: async ({ email, password, rememberMe = true }: LoginParams) => {
      const res = await signIn.email({ email, password: password || "", rememberMe });
      if (res.error) {
        throw new Error(res.error.message || "Invalid email or password.");
      }
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Welcome back! Signed in successfully.");
      const authPayload = data as unknown as { user?: User; data?: { user?: User } };
      const authUser = authPayload?.user || authPayload?.data?.user;
      if (authUser) {
        queryClient.setQueryData(authKeys.profile(), authUser);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      const userRole = authUser?.role || role;
      const destination = variables.redirectTo || getRoleDashboardRoute(userRole);
      router.push(destination);
      router.refresh();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to sign in");
    },
  });

  // Account Registration
  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password, phone, role }: RegisterParams) => {
      const res = await signUp.email({
        email,
        password: password || "",
        name,
        phone,
        role,
      } as unknown as Parameters<typeof signUp.email>[0]);
      if (res.error) {
        throw new Error(res.error.message || "Failed to create account.");
      }
      return res.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Account created! Please check your email for verification.");
      router.push(
        `/verify-email?email=${encodeURIComponent(variables.email)}&role=${encodeURIComponent(variables.role)}`
      );
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create account");
    },
  });

  // Sign Out
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut();
    },
    onSuccess: () => {
      toast.success("Signed out successfully");
      // Drop cached profile and user data immediately
      queryClient.setQueryData(authKeys.profile(), null);
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to log out");
    },
  });

  // Forgot Password Request
  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email, redirectTo }: { email: string; redirectTo?: string }) => {
      const res = await requestPasswordReset({
        email,
        redirectTo:
          redirectTo ||
          `${typeof window !== "undefined" ? window.location.origin : ""}/reset-password`,
      });
      if (res.error) {
        throw new Error(res.error.message || "Failed to send reset email.");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password reset instructions sent to your email!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to request password reset");
    },
  });

  // Reset Password Execution
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ newPassword, token }: { newPassword: string; token: string }) => {
      const res = await resetPassword({ newPassword, token });
      if (res.error) {
        throw new Error(res.error.message || "Failed to reset password.");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password has been reset! Please sign in with your new password.");
      router.push("/login");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to reset password");
    },
  });

  // Verify Email
  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await verifyEmail({ query: { token } });
      if (res.error) {
        throw new Error(res.error.message || "Email verification failed.");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Email verified successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Email verification failed");
    },
  });

  // Resend Email Verification Link
  const resendVerificationEmailMutation = useMutation({
    mutationFn: async ({ email, callbackURL }: { email: string; callbackURL?: string }) => {
      const res = await sendVerificationEmail({
        email,
        callbackURL:
          callbackURL || `${typeof window !== "undefined" ? window.location.origin : ""}/`,
      });
      if (res.error) {
        throw new Error(res.error.message || "Failed to resend verification email.");
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success("Verification link sent! Please check your inbox.");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to resend verification email");
    },
  });

  // Google One-Tap / ID-Token Login
  const loginWithGoogleCredentialMutation = useMutation({
    mutationFn: async ({ credential }: { credential: string }) => {
      const res = await apiClient.post("/api/auth/one-tap/callback", {
        idToken: credential,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Welcome! Signed in with Google.");
      const authPayload = data as unknown as { user?: User; data?: { user?: User } };
      const authUser = authPayload?.user || authPayload?.data?.user;
      if (authUser) {
        queryClient.setQueryData(authKeys.profile(), authUser);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      const userRole = authUser?.role || role;
      router.push(getRoleDashboardRoute(userRole));
      router.refresh();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Google sign-in failed");
    },
  });

  // Social Redirect Fallback Login
  const loginWithGoogle = useCallback(async (callbackURL = "/dashboard") => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to initiate Google sign-in.";
      toast.error(message);
    }
  }, []);

  return {
    // Current User & State
    user,
    role,
    isDoctor: role === "DOCTOR",
    isPatient: role === "PATIENT",
    isAdmin: role === "ADMIN",
    isAuthenticated,
    isSessionLoading: isAuthLoading,

    // Auth Action Methods
    login: (params: LoginParams, redirectTo?: string) =>
      loginMutation.mutateAsync({ ...params, redirectTo }),
    register: (params: RegisterParams) => registerMutation.mutateAsync(params),
    logout: () => logoutMutation.mutateAsync(),
    forgotPassword: (params: { email: string; redirectTo?: string }) =>
      forgotPasswordMutation.mutateAsync(params),
    resetPassword: (params: { newPassword: string; token: string }) =>
      resetPasswordMutation.mutateAsync(params),
    verifyEmail: (token: string) => verifyEmailMutation.mutateAsync(token),
    resendVerificationEmail: (params: { email: string; callbackURL?: string }) =>
      resendVerificationEmailMutation.mutateAsync(params),
    loginWithGoogle,
    loginWithGoogleCredential: (credential: string) =>
      loginWithGoogleCredentialMutation.mutateAsync({ credential }),

    // Direct Mutation Handles
    loginMutation,
    registerMutation,
    logoutMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    verifyEmailMutation,
    resendVerificationEmailMutation,
    loginWithGoogleCredentialMutation,
  };
};

export default useAuth;
