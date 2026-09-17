"use client";

import React from "react";
import PatientLayout from "@/layouts/PatientLayout";
import { Bell, Calendar, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientNotificationsPage() {
  const notifications = [
    {
      id: "n-1",
      title: "Upcoming Video Consultation",
      description: "Your video consultation with Dr. Sarah Ahmed starts today at 4:30 PM.",
      time: "25 minutes ago",
      icon: Calendar,
      unread: true,
      type: "primary",
    },
    {
      id: "n-2",
      title: "Diagnostic Report Uploaded",
      description: "Complete Blood Count (CBC) report from DMCH is now available in your medical records.",
      time: "2 days ago",
      icon: FileText,
      unread: false,
      type: "success",
    },
    {
      id: "n-3",
      title: "Booking Confirmation",
      description: "Your appointment request with Dr. Farhana Rahman has been received and is pending confirmation.",
      time: "3 days ago",
      icon: CheckCircle2,
      unread: false,
      type: "info",
    },
  ];

  return (
    <PatientLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        <div className="flex items-center justify-between pb-4 border-b border-border/70">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-secondary-text">
              Stay updated on consultations, medical report uploads, and doctor notices.
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-9 px-3.5 text-xs font-semibold rounded-xl">
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
    </PatientLayout>
  );
}
