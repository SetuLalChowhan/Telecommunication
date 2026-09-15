"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentUser,
  selectCurrentRole,
  selectIsAuthenticated,
  setSession,
  setUserProfile,
  clearAuth,
} from "@/redux/slices/authSlice";
import {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
} from "./authClient";
import { toast } from "react-toastify";
import { User, Role } from "@/types";
import { useClient } from "./useClient";
import { useMutationClient } from "./useMutationClient";
import { axiosPublic } from "./useAxiosPublic";

export type { Role } from "@/types";

export interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
  redirectTo?: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role: Role;
}

/**
 * Helper to determine dashboard route based on user role
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
 * =============================================================================
 * useAuth
 * =============================================================================
 * Unified Authentication Hook powered completely by:
 *   - useClient (for profile querying & caching)
 *   - useMutationClient (for all auth mutations with auto-toasts & cache invalidation)
 * =============================================================================
 */
export const useAuth = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  // Better-Auth reactive session
  const { data: session, isPending: isSessionLoading } = useSession();

  // Redux store state (with fallback to session)
  const reduxUser = useAppSelector(selectCurrentUser);
  const reduxRole = useAppSelector(selectCurrentRole);
  const reduxIsAuthenticated = useAppSelector(selectIsAuthenticated);

  const isAuthenticated = reduxIsAuthenticated || !!session?.user;

  // 1. useClient hook to fetch and cache user profile
  const { data: profileUser, isLoading: isProfileLoading } = useClient<User>({
    queryKey: ["user", "me"],
    url: "/users/me",
    isPrivate: true,
    enabled: isAuthenticated,
  });

  const user = profileUser || reduxUser || (session?.user as unknown as User) || null;
  const role = profileUser?.role || reduxRole || ((session?.user as any)?.role as Role) || null;

  // 2. Login Mutation using useMutationClient
  const loginMutation = useMutationClient<any, LoginParams>({
    mutationFn: async ({ email, password, rememberMe = true }) => {
      const res = await signIn.email({ email, password, rememberMe });
      if (res.error) {
        throw new Error(res.error.message || "Invalid email or password.");
      }
      return res.data;
    },
    successMessage: "Welcome back! Signed in successfully.",
    invalidateKeys: [["user", "me"]],
    onSuccess: (data, variables) => {
      const authUser = (data as any)?.user;
      const authSession = (data as any)?.session;
      if (authUser) {
        dispatch(
          setSession({
            user: authUser as unknown as User,
            token: authSession?.token || (data as any)?.token || null,
          })
        );
      }
      queryClient.invalidateQueries();
      const userRole = authUser?.role || role;
      const destination = variables.redirectTo || getRoleDashboardRoute(userRole);
      router.push(destination);
    },
  });

  // 3. Register Mutation using useMutationClient
  const registerMutation = useMutationClient<any, RegisterParams>({
    mutationFn: async ({ name, email, password, role }) => {
      const res = await signUp.email({ email, password, name, role } as any);
      if (res.error) {
        throw new Error(res.error.message || "Failed to create account.");
      }
      return res.data;
    },
    successMessage: "Account created! Please check your email for the verification link.",
    onSuccess: (_data, variables) => {
      // Pass role to verify-email so doctor verification flow is primed
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}&role=${encodeURIComponent(variables.role)}`);
    },
  });

  // 4. Logout Mutation using useMutationClient
  const logoutMutation = useMutationClient<void, void>({
    mutationFn: async () => {
      await signOut();
    },
    successMessage: "Signed out successfully",
    redirectTo: "/login",
    onSuccess: () => {
      dispatch(clearAuth());
      queryClient.clear();
    },
  });

  // 5. Forgot Password Mutation using useMutationClient
  const forgotPasswordMutation = useMutationClient<any, { email: string; redirectTo?: string }>({
    mutationFn: async ({ email, redirectTo }) => {
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
    successMessage: "Password reset instructions sent to your email!",
  });

  // 6. Reset Password Mutation using useMutationClient
  const resetPasswordMutation = useMutationClient<any, { newPassword: string; token: string }>({
    mutationFn: async ({ newPassword, token }) => {
      const res = await resetPassword({ newPassword, token });
      if (res.error) {
        throw new Error(res.error.message || "Failed to reset password.");
      }
      return res.data;
    },
    successMessage: "Password has been reset! Please sign in with your new password.",
    redirectTo: "/login",
  });

  // 7. Verify Email Mutation using useMutationClient
  const verifyEmailMutation = useMutationClient<any, string>({
    mutationFn: async (token) => {
      const res = await verifyEmail({ query: { token } });
      if (res.error) {
        throw new Error(res.error.message || "Email verification failed.");
      }
      return res.data;
    },
    successMessage: "Email verified successfully!",
  });

  // 8. Resend Verification Email Mutation using useMutationClient
  const resendVerificationEmailMutation = useMutationClient<any, { email: string; callbackURL?: string }>({
    mutationFn: async ({ email, callbackURL }) => {
      const res = await sendVerificationEmail({
        email,
        callbackURL: callbackURL || `${typeof window !== "undefined" ? window.location.origin : ""}/`,
      });
      if (res.error) {
        throw new Error(res.error.message || "Failed to resend verification email.");
      }
      return res.data;
    },
    successMessage: "Verification link sent! Please check your inbox.",
  });

  // 9. Google Credential (One-Tap / @react-oauth/google) Mutation
  const loginWithGoogleCredentialMutation = useMutationClient<any, { credential: string }>({
    mutationFn: async ({ credential }) => {
      const res = await axiosPublic.post("/api/auth/one-tap/callback", {
        idToken: credential,
      });
      return res.data;
    },
    successMessage: "Welcome! Signed in with Google.",
    invalidateKeys: [["user", "me"]],
    onSuccess: (data) => {
      const authUser = (data as any)?.user;
      const authSession = (data as any)?.session;
      if (authUser) {
        dispatch(
          setSession({
            user: authUser as unknown as User,
            token: authSession?.token || (data as any)?.token || null,
          })
        );
      }
      queryClient.invalidateQueries();
      const userRole = authUser?.role || role;
      router.push(getRoleDashboardRoute(userRole));
    },
  });


  // Social Login (Redirect fallback)
  const loginWithGoogle = useCallback(async (callbackURL = "/dashboard") => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (err: any) {
      toast.error(err?.message || "Failed to initiate Google sign-in.");
    }
  }, []);

  // Native React Query states
  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending ||
    forgotPasswordMutation.isPending ||
    resetPasswordMutation.isPending ||
    verifyEmailMutation.isPending ||
    resendVerificationEmailMutation.isPending ||
    loginWithGoogleCredentialMutation.isPending;

  const error =
    loginMutation.error?.message ||
    registerMutation.error?.message ||
    logoutMutation.error?.message ||
    forgotPasswordMutation.error?.message ||
    resetPasswordMutation.error?.message ||
    verifyEmailMutation.error?.message ||
    resendVerificationEmailMutation.error?.message ||
    loginWithGoogleCredentialMutation.error?.message ||
    null;


  return {
    user,
    role,
    isDoctor: role === "DOCTOR",
    isPatient: role === "PATIENT",
    isAdmin: role === "ADMIN",
    isAuthenticated,
    isSessionLoading: isSessionLoading || isProfileLoading,
    isLoading,
    error,
    // Async actions
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
    // Expose granular mutation hooks for direct use
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
