"use client";

import React from "react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { Bell, Calendar, UserPlus, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorNotificationsPage() {
  const notifications = [
    {
      id: "dn-1",
      title: "New Video Consultation Booked",
      description: "Setulal Chowhan booked a video consultation for today at 4:30 PM.",
      time: "15 minutes ago",
      icon: Calendar,
      unread: true,
    },
    {
      id: "dn-2",
      title: "New Patient Registered",
      description: "Maria Khan was registered to your cardiology patient directory.",
      time: "1 hour ago",
      icon: UserPlus,
      unread: true,
    },
    {
      id: "dn-3",
      title: "BMDC Credential Verified",
      description: "Your BMDC registration license renewal has been verified by the medical board.",
      time: "2 days ago",
      icon: ShieldCheck,
      unread: false,
    },
  ];

  return (
    <DoctorLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Clinical Notifications
            </h1>
            <p className="text-xs text-muted-foreground">
              Patient booking updates, consultation requests, and verification alerts.
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-8 text-xs rounded-xl">
            Mark all as read
          </Button>
        </div>

        <div className="space-y-2.5">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-colors ${
                  n.unread
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border/70"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">
                      {n.title}
                    </h3>
                    <p className="text-xs text-secondary-text leading-relaxed">
                      {n.description}
                    </p>
                    <span className="text-[11px] text-muted-foreground block pt-1">
                      {n.time}
                    </span>
                  </div>
                </div>

                {n.unread && (
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DoctorLayout>
  );
}
