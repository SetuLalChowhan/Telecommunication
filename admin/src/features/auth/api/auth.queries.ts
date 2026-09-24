import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";
import { clearAuthToken, setAuthToken } from "@/lib/auth/token";
import { ApiError } from "@/lib/api/error";
import { CACHE } from "@/lib/query/policy";
import { authKeys } from "../types";
import type { LoginParams } from "../types";
import { getCurrentUser } from "./auth.api";

/**
 * The current-user query. This is the single source of truth for who is signed
 * in — no duplicated session copies in Redux/Zustand/Context/localStorage.
 */
export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.profile(),
    queryFn: getCurrentUser,
    staleTime: CACHE.profile.staleTime,
  });

export function useCurrentUser() {
  return useQuery(currentUserQueryOptions());
}

/**
 * Session state derived from the same query as `useCurrentUser`, so there can
 * never be two disagreeing answers about whether the admin is signed in.
 */
export function useSession() {
  const query = useCurrentUser();

  return {
    user: query.data ?? null,
    isAuthenticated: Boolean(query.data),
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: LoginParams) => {
      const res = await authClient.signIn.email({
        email: params.email,
        password: params.password,
        rememberMe: true,
      });

      if (res.error) {
        throw new ApiError(res.error.message || "Invalid email or password.", {
          status: res.error.status ?? 401,
          code: "UNAUTHORIZED",
        });
      }

      // The primary token capture happens in the auth client's `onSuccess`
      // (set-auth-token header). This is a fallback for deployments that also
      // return the session token in the body.
      const data = res.data as unknown as { session?: { token?: string } } | null;
      const bodyToken = data?.session?.token;
      if (bodyToken) {
        setAuthToken(bodyToken);
      }

      return res.data;
    },
    onSuccess: () => {
      // Re-resolve the profile with the freshly stored token.
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authClient.signOut();
      clearAuthToken();
    },
    onSuccess: () => {
      // Drop every cached server response so the next user never sees the
      // previous admin's data.
      queryClient.clear();
    },
  });
}

/** Requests a password-reset email. The server builds the link from its own
 * configured client URL, so `redirectTo` is best-effort. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async ({ email, redirectTo }: { email: string; redirectTo?: string }) => {
      const res = await authClient.requestPasswordReset({
        email,
        redirectTo: redirectTo ?? `${window.location.origin}/reset-password`,
      });
      if (res.error) {
        throw new ApiError(res.error.message || "Failed to send the reset email.", {
          status: res.error.status ?? 500,
        });
      }
      return res.data;
    },
  });
}

/** Completes a password reset using the token from the emailed link. */
export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ newPassword, token }: { newPassword: string; token: string }) => {
      const res = await authClient.resetPassword({ newPassword, token });
      if (res.error) {
        throw new ApiError(res.error.message || "Failed to reset the password.", {
          status: res.error.status ?? 400,
        });
      }
      return res.data;
    },
  });
}
