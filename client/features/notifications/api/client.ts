import { http } from "@/lib/api/client";
import {
  AppNotification,
  NotificationsQueryParams,
  NotificationsResponse,
} from "../types";

/**
 * Fetch notifications with pagination.
 *
 * The envelope is unwrapped once by the canonical `http` client, so this
 * function only maps the API payload to the feature's domain shape.
 */
export async function fetchNotifications(
  params?: NotificationsQueryParams
): Promise<NotificationsResponse> {
  const page = await http.getPage<AppNotification>("/notifications", { params });

  return {
    ...page,
    unreadCount: page.data.filter((n) => !n.isRead).length,
  };
}

/**
 * Fetch the unread notification count for the header badge.
 * A badge is optional decoration, so a failure degrades to 0.
 */
export async function fetchUnreadCount(): Promise<number> {
  try {
    const { unreadCount } = await http.get<{ unreadCount: number }>(
      "/notifications/unread-count"
    );
    return unreadCount ?? 0;
  } catch {
    return 0;
  }
}

/** Mark a single notification as read. */
export async function markNotificationAsRead(
  notificationId: string
): Promise<AppNotification> {
  return http.patch<AppNotification>(`/notifications/${notificationId}/read`);
}

/** Mark all notifications as read. */
export async function markAllNotificationsAsRead(): Promise<{ message: string }> {
  return http.patch<{ message: string }>("/notifications/read-all");
}
