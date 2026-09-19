import { serverFetch, ServerFetchOptions } from "@/lib/api/server-fetch";
import { cookies } from "next/headers";
import {
  NotificationsQueryParams,
  NotificationsResponse,
} from "../types";

/**
 * Server-Side fetcher for user notifications
 */
export async function getNotificationsServer(
  params?: NotificationsQueryParams,
  options?: ServerFetchOptions
): Promise<NotificationsResponse> {
  try {
    let cookieHeader = "";
    try {
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch {}

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.limit) queryParams.set("limit", String(params.limit));

    const queryStr = queryParams.toString();
    const endpoint = queryStr ? `/notifications?${queryStr}` : "/notifications";

    const response = await serverFetch<NotificationsResponse>(endpoint, {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
      ...options,
    });

    return {
      data: response.data || [],
      unreadCount: response.unreadCount || 0,
      meta: response.meta || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data?.length || 0,
        totalPages: 1,
      },
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
