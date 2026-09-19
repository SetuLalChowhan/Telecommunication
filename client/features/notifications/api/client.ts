import { apiClient } from "@/lib/api/axios";
import {
  AppNotification,
  NotificationsQueryParams,
  NotificationsResponse,
} from "../types";

/**
 * Fetch notifications with pagination and normalized response extraction
 */
export async function fetchNotifications(
  params?: NotificationsQueryParams
): Promise<NotificationsResponse> {
  const response = await apiClient.get<any>("/notifications", { params });
  const body = response.data;

  const data: AppNotification[] = Array.isArray(body?.data)
    ? body.data
    : Array.isArray(body)
    ? body
    : [];

  const unreadCount: number =
    typeof body?.unreadCount === "number"
      ? body.unreadCount
      : typeof body?.data?.unreadCount === "number"
      ? body.data.unreadCount
      : data.filter((n) => !n.isRead).length;

  return {
    data,
    unreadCount,
    meta: body?.meta || {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: data.length,
      totalPages: 1,
    },
  };
}

/**
 * Fetch unread notifications count
 */
export async function fetchUnreadCount(): Promise<number> {
  try {
    const response = await apiClient.get<any>("/notifications/unread-count");
    const body = response.data;
    if (typeof body?.data?.unreadCount === "number") {
      return body.data.unreadCount;
    }
    if (typeof body?.unreadCount === "number") {
      return body.unreadCount;
    }
    if (typeof body?.data === "number") {
      return body.data;
    }
    return 0;
  } catch (err) {
    return 0;
  }
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<AppNotification> {
  const response = await apiClient.patch<{ data: AppNotification }>(
    `/notifications/${notificationId}/read`
  );
  return response.data.data;
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>(
    "/notifications/read-all"
  );
  return response.data;
}
