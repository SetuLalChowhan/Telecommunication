"use client";

import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { axiosPublic } from "./useAxiosPublic";
import { axiosSecure } from "./useAxiosSecure";
import { toast } from "react-toastify";

export interface MutationParams<TData = any, TVariables = any> {
  url?: string;
  method?: "post" | "put" | "patch" | "delete";
  isPrivate?: boolean;
  mutationFn?: (variables: TVariables) => Promise<TData>;
  invalidateKeys?: any[][];
  successMessage?: string;
  redirectTo?: string;
  showToast?: boolean;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: any, variables: TVariables) => void | Promise<void>;
}

export interface MutationPayload {
  data?: any;
  config?: any;
}

/**
 * =============================================================================
 * useMutationClient
 * =============================================================================
 * Purpose:
 *   Universal TanStack Mutation hook supporting:
 *   1. Standard REST endpoints via Axios (url + method)
 *   2. Custom asynchronous mutation functions (e.g. Better-Auth SDK, file uploads)
 *
 * Usage with REST URL:
 *   const { mutate, isPending } = useMutationClient({
 *     url: "/appointments/book",
 *     method: "post",
 *     invalidateKeys: [["patient", "appointments"]],
 *     successMessage: "Appointment booked successfully!",
 *   });
 *
 * Usage with Custom mutationFn:
 *   const { mutate, isPending } = useMutationClient({
 *     mutationFn: async (params) => await signIn.email(params),
 *     successMessage: "Welcome back!",
 *   });
 * =============================================================================
 */
export function useMutationClient<TData = any, TVariables = any>({
  url,
  method = "post",
  isPrivate = true,
  mutationFn: customMutationFn,
  invalidateKeys = [],
  successMessage = "Action completed successfully!",
  redirectTo,
  showToast = true,
  onSuccess: customOnSuccess,
  onError: customOnError,
}: MutationParams<TData, TVariables>): UseMutationResult<TData, any, TVariables> {
  const queryClient = useQueryClient();
  const router = useRouter();
  const client = isPrivate ? axiosSecure : axiosPublic;

  return useMutation<TData, any, TVariables>({
    mutationFn: async (variables: TVariables) => {
      // 1. If custom async function is provided (e.g. Better-Auth SDK)
      if (customMutationFn) {
        return await customMutationFn(variables);
      }

      // 2. Default to REST API call via Axios
      if (!url) {
        throw new Error("useMutationClient requires either 'url' or 'mutationFn'.");
      }

      const payload = (variables as any) || {};
      const requestData = payload?.data !== undefined ? payload.data : payload;
      const requestConfig = payload?.config;

      if (method === "delete") {
        return (await client.delete(url, { data: requestData, ...requestConfig })) as TData;
      }
      return (await client[method](url, requestData, requestConfig)) as TData;
    },

    onSuccess: async (res, variables) => {
      if (showToast) {
        const msg = (res as any)?.message || (res as any)?.data?.message || successMessage;
        if (msg) toast.success(msg);
      }

      // Automatically invalidate related React Query caches
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Run optional custom success callback
      if (customOnSuccess) {
        await customOnSuccess(res, variables);
      }

      // Optional redirect
      if (redirectTo) {
        router.push(redirectTo);
      }
    },

    onError: async (error: any, variables) => {
      if (showToast) {
        const msg = error?.message || "An error occurred. Please try again.";
        toast.error(msg);
      }

      if (customOnError) {
        await customOnError(error, variables);
      }
    },
  });
}

export default useMutationClient;
