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
 * Cookie forwarding is handled once by the canonical server client, and a
 * backend outage propagates to the route error boundary rather than rendering
 * as "no notifications".
 */
export async function getNotificationsServer(
  params?: NotificationsQueryParams,
  options?: ServerFetchOptions
): Promise<NotificationsResponse> {
  const page = await serverGetPage<AppNotification>(
    `/notifications${buildQueryString(params)}`,
    { ...CACHE.notifications.server, ...options }
  );

  return {
    ...page,
    unreadCount: page.data.filter((n) => !n.isRead).length,
  };
}
