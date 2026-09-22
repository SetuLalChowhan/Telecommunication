"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Bell,
  AlertCircle,
  Check,
  CheckCheck,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/features/notifications/api/queries";
import { PageHeader } from "@/components/layout";

function getNotificationIcon(type: string) {
  switch (type) {
    case "BOOKING_CONFIRMED":
      return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />;
    case "BOOKING_CANCELLED":
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
    case "APPOINTMENT_REMINDER":
      return <Calendar className="h-3.5 w-3.5 text-primary" />;
    case "REPORT_UPLOADED":
      return <FileText className="h-3.5 w-3.5 text-secondary-text" />;
    default:
      return <Bell className="h-3.5 w-3.5 text-muted-foreground" />;
  }
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PatientNotificationsClient() {
  const { data: notificationsData, isLoading, isFetching } = useNotifications();
  const markOneMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.data || [];
  const unreadCount =
    notificationsData?.unreadCount ??
    notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      markOneMutation.mutate(id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllMutation.mutate();
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Activity"
        title="Notifications"
        meta={unreadCount > 0 ? `${unreadCount} unread` : undefined}
        description="Appointment updates, report activity and account notices."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markAllMutation.isPending}
            className="h-8 shrink-0 gap-1.5 rounded-md px-3 text-xs font-semibold"
          >
            {markAllMutation.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CheckCheck className="h-3.5 w-3.5" />
            )}
            <span>Mark all as read</span>
          </Button>
        }
      />

      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">Recent activity</h2>
          {isFetching && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Updating
            </span>
          )}
        </div>

        {isLoading && notifications.length === 0 ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3.5">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-md bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Bell className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              No notifications
            </p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Appointment confirmations, meeting links and prescriptions will
              appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id}>
                <div
                  onClick={() => handleMarkAsRead(n.id, n.isRead)}
                  className={`flex cursor-pointer items-start gap-3 p-3.5 transition-colors ${
                    !n.isRead ? "bg-accent/60 hover:bg-accent" : "hover:bg-muted/50"
                  }`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                    {getNotificationIcon(n.type)}
                  </span>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[13px] font-semibold text-foreground">
                        {n.title}
                      </h3>
                      {!n.isRead && (
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                          aria-label="Unread"
                        />
                      )}
                    </div>

                    <p className="text-xs leading-relaxed text-secondary-text">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 pt-0.5 text-[11px] text-muted-foreground">
                      <span className="tabular-nums">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                      {n.relatedBookingId && (
                        <Link
                          href="/patient/appointments"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(n.id, n.isRead);
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          <span>View appointment</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(n.id, false);
                      }}
                      className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                      title="Mark as read"
                      aria-label="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default PatientNotificationsClient;
