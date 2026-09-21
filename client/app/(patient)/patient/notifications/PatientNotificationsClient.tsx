"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  FileText,
  Bell,
  AlertCircle,
  Clock,
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
import { AppNotification } from "@/features/notifications/types";

function getNotificationIcon(type: string) {
  switch (type) {
    case "BOOKING_CONFIRMED":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    case "BOOKING_CANCELLED":
      return <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
    case "APPOINTMENT_REMINDER":
      return <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case "REPORT_UPLOADED":
      return <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    default:
      return <Bell className="h-4 w-4 text-primary" />;
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
    <div className="w-full space-y-6 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-secondary-text">
            Stay informed on appointment requests, confirmations, medical reports, and clinical updates.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0 || markAllMutation.isPending}
          className="h-9 px-3.5 text-xs font-semibold rounded-xl gap-1.5 self-start sm:self-auto shrink-0"
        >
          {markAllMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCheck className="h-3.5 w-3.5 text-primary" />
          )}
          <span>Mark all as read</span>
        </Button>
      </div>

      {/* Loading Indicator */}
      {isFetching && (
        <div className="flex items-center gap-2 text-xs text-primary font-medium">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Updating notifications...</span>
        </div>
      )}

      {/* Notifications List */}
      {isLoading && notifications.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-border/70 bg-card flex items-start gap-4 animate-pulse"
            >
              <div className="h-9 w-9 rounded-xl bg-muted shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/3 bg-muted rounded" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-card/40">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Bell className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No Notifications Yet
          </h3>
          <p className="text-xs sm:text-sm text-secondary-text max-w-sm mx-auto">
            You will receive notices here when doctors confirm appointments, send meeting links, or upload digital prescriptions.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const timeRelative = formatRelativeTime(n.createdAt);

            return (
              <div
                key={n.id}
                onClick={() => handleMarkAsRead(n.id, n.isRead)}
                className={`p-4 sm:p-5 rounded-2xl border flex items-start justify-between gap-4 transition-all cursor-pointer ${
                  !n.isRead
                    ? "bg-primary/[0.03] border-primary/30 shadow-xs ring-1 ring-primary/10"
                    : "bg-card border-border/70 hover:border-border"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="p-2.5 rounded-xl bg-muted/60 shrink-0 mt-0.5 border border-border/50">
                    {getNotificationIcon(n.type)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-xs sm:text-sm font-bold truncate ${
                        !n.isRead ? "text-foreground" : "text-foreground/90"
                      }`}>
                        {n.title}
                      </h3>
                      {!n.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-secondary-text leading-relaxed">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                      <span>{timeRelative}</span>
                      {n.relatedBookingId && (
                        <Link
                          href="/patient/appointments"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(n.id, n.isRead);
                          }}
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          <span>View Appointment</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(n.id, false);
                    }}
                    className="h-8 px-2 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-primary shrink-0"
                    title="Mark as read"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
