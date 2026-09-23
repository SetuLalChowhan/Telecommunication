import { buildQueryString, serverGetPage, ServerFetchOptions } from "@/lib/api/server";
import { CACHE } from "@/lib/cache/policy";
import {
  AppNotification,
  NotificationsQueryParams,
  NotificationsResponse,
} from "../types";

/**
 * Server-side notifications list for SSR hydration.
 *
 * Cookie forwarding is handled once by the canonical server client.
 */
export async function getNotificationsServer(
  params?: NotificationsQueryParams,
  options?: ServerFetchOptions
): Promise<NotificationsResponse> {
  try {
    const page = await serverGetPage<AppNotification>(
      `/notifications${buildQueryString(params)}`,
      { ...CACHE.notifications.server, ...options }
    );

    return {
      ...page,
      unreadCount: page.data.filter((n) => !n.isRead).length,
    };
  } catch (error) {
    console.error("Failed to fetch notifications on server:", error);
    return {
      data: [],
      unreadCount: 0,
      meta: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0,
        totalPages: 1,
      },
    };
  }
}
