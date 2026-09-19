export type NotificationType =
  | "GENERAL"
  | "BOOKING_PENDING"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "APPOINTMENT_REMINDER"
  | "REPORT_UPLOADED"
  | string;

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  relatedBookingId?: string | null;
  createdAt: string;
}

export interface NotificationsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface NotificationsResponse {
  data: AppNotification[];
  unreadCount?: number;
  meta: NotificationsMeta;
}

export interface NotificationsQueryParams {
  page?: number;
  limit?: number;
}

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (params?: NotificationsQueryParams) =>
    [
      ...notificationKeys.all,
      "list",
      params?.page || 1,
      params?.limit || 10,
    ] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};
