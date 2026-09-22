"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Video, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

interface PatientNextConsultationProps {
  appointment?: DashboardAppointment | null;
  isLoading?: boolean;
  onOpenDetails: (appointment: DashboardAppointment) => void;
}

const statusChip: Record<string, string> = {
  CONFIRMED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  COMPLETED: "border-border bg-muted text-muted-foreground",
  CANCELLED: "border-border bg-muted text-muted-foreground",
};

export const PatientNextConsultation: React.FC<PatientNextConsultationProps> = ({
  appointment,
  isLoading = false,
  onOpenDetails,
}) => {
  if (isLoading) {
    return (
      <section className="panel overflow-hidden">
        <div className="panel-header">
          <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="h-3 w-56 animate-pulse rounded bg-muted/70" />
          </div>
          <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
        </div>
      </section>
    );
  }

  if (!appointment) {
    return (
      <section className="panel flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
          </div>
          <div>
            <p className="panel-title">No upcoming consultation</p>
            <p className="text-xs text-muted-foreground">
              Book a verified specialist when you need clinical guidance.
            </p>
          </div>
        </div>
        <Link href="/doctors" className="shrink-0">
          <Button size="sm" className="h-8 rounded-md px-3 text-xs font-semibold">
            Find a doctor
          </Button>
        </Link>
      </section>
    );
  }

  const canJoin =
    Boolean(appointment.meetLink) && appointment.status === "CONFIRMED";

  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">Next consultation</h2>
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          {appointment.dateFormatted} · {appointment.timeFormatted}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarImage
              src={appointment.doctorAvatar}
              alt={appointment.doctorName}
            />
            <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
              {appointment.doctorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {appointment.doctorName}
              </h3>
              <span
                className={cn(
                  "status-chip",
                  statusChip[appointment.status] ?? statusChip.COMPLETED
                )}
              >
                {appointment.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {appointment.doctorSpecialty}
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Calendar className="h-3 w-3" />
                {appointment.dateFormatted} · {appointment.timeFormatted}
              </span>
              <span aria-hidden>·</span>
              <span>{appointment.consultationType}</span>
            </div>

            {appointment.status === "PENDING" && (
              <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                Waiting for doctor confirmation — the video link activates once
                confirmed.
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:justify-end">
          {canJoin && (
            <a href={appointment.meetLink} target="_blank" rel="noopener noreferrer">
              <Button className="h-8 rounded-md px-3 text-xs font-semibold">
                <Video className="h-3.5 w-3.5" />
                <span>Join call</span>
              </Button>
            </a>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDetails(appointment)}
            className="h-8 rounded-md px-3 text-xs font-semibold"
          >
            Details
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PatientNextConsultation;
