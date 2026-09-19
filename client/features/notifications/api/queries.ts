"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./client";
import {
  NotificationsQueryParams,
  NotificationsResponse,
  notificationKeys,
} from "../types";

/**
 * Query hook to fetch notifications list with real-time polling
 */
export function useNotifications(params?: NotificationsQueryParams) {
  return useQuery<NotificationsResponse>({
    queryKey: notificationKeys.list(params),
    queryFn: () => fetchNotifications(params),
    refetchInterval: 1000 * 10, // Poll every 10 seconds in foreground
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider fresh data on page visit
  });
}

/**
 * Query hook to fetch unread notification count with fast real-time polling
 */
export function useUnreadNotificationCount() {
  return useQuery<number>({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
    refetchInterval: 1000 * 10, // Refresh every 10 seconds
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always check immediately on page load / mount
  });
}

/**
 * Mutation hook to mark a single notification as read with instant optimistic UI update
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onMutate: async (id: string) => {
      // Cancel outgoing queries to avoid race conditions
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // 1. Optimistically decrement unread count in header badge immediately
      queryClient.setQueryData<number>(
        notificationKeys.unreadCount(),
        (old = 0) => Math.max(0, old - 1)
      );

      // 2. Optimistically update notifications list item to isRead: true
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: notificationKeys.all },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { ...item, isRead: true } : item
            ),
            unreadCount: Math.max(0, (old.unreadCount ?? 1) - 1),
          };
        }
      );
    },
    onSettled: () => {
      // Refetch both unread count and list from server to ensure perfect sync
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Mutation hook to mark all notifications as read with instant optimistic UI update
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // 1. Instantly clear unread badge in header
      queryClient.setQueryData<number>(notificationKeys.unreadCount(), 0);

      // 2. Instantly mark all items as read in UI
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: notificationKeys.all },
        (old) => {
          if (!old || !Array.isArray(old.data)) return old;
          return {
            ...old,
            data: old.data.map((item) => ({ ...item, isRead: true })),
            unreadCount: 0,
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
