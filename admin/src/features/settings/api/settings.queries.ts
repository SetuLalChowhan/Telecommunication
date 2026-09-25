import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { describeApiError } from "@/lib/api/error";
import { CACHE } from "@/lib/query/policy";
import { authKeys } from "@/features/auth/types";
import { settingsKeys } from "../types";
import type { UpdateProfilePayload, UpdateUserSettingsPayload } from "../types";
import { getSettings, updateProfile, updateSettings } from "./settings.api";

export const settingsQueryOptions = () =>
  queryOptions({
    queryKey: settingsKeys.me(),
    queryFn: getSettings,
    staleTime: CACHE.settings.staleTime,
  });

export function useSettings() {
  return useQuery(settingsQueryOptions());
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserSettingsPayload) => updateSettings(payload),
    onSuccess: (data) => {
      toast.success("Settings saved.");
      queryClient.setQueryData(settingsKeys.me(), data);
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, image }: { payload: UpdateProfilePayload; image?: File | null }) =>
      updateProfile(payload, image),
    onSuccess: () => {
      toast.success("Profile updated successfully.");
      // `/users/me` is the source of truth for the header/avatar, so refresh it.
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (error) => {
      toast.error(describeApiError(error));
    },
  });
}
