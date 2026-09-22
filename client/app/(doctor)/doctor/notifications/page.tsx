"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, UserPlus, ShieldCheck, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout";

const notifications = [
  {
    id: "dn-1",
    title: "New video consultation booked",
    description: "Setulal Chowhan booked a video consultation for today at 4:30 PM.",
    time: "15 minutes ago",
    icon: Calendar,
    unread: true,
    href: "/doctor/appointments",
  },
  {
    id: "dn-2",
    title: "New patient registered",
    description: "Maria Khan was added to your patient directory.",
    time: "1 hour ago",
    icon: UserPlus,
    unread: true,
    href: "/doctor/patients",
  },
  {
    id: "dn-3",
    title: "BMDC credential verified",
    description: "Your BMDC registration renewal was verified by the medical board.",
    time: "2 days ago",
    icon: ShieldCheck,
    unread: false,
    href: "/doctor-verification",
  },
];

export default function DoctorNotificationsPage() {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Activity"
        title="Notifications"
        meta={unreadCount > 0 ? `${unreadCount} unread` : undefined}
        description="Booking requests, patient activity and verification alerts."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="h-8 shrink-0 rounded-md px-3 text-xs font-semibold"
          >
            Mark all as read
          </Button>
        }
      />

      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">Recent activity</h2>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Bell className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              No notifications
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    className={`flex items-start gap-3 p-3.5 transition-colors ${
                      n.unread ? "bg-accent/60 hover:bg-accent" : "hover:bg-muted/50"
                    }`}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-[13px] font-semibold text-foreground">
                          {n.title}
                        </h3>
                        {n.unread && (
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            aria-label="Unread"
                          />
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-secondary-text">
                        {n.description}
                      </p>
                      <span className="block pt-0.5 text-[11px] text-muted-foreground">
                        {n.time}
                      </span>
                    </div>

                    <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
