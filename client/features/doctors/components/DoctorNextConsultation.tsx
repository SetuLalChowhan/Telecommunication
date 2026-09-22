"use client";

import React from "react";
import { Calendar, Video, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoctorScheduleItem } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

interface DoctorNextConsultationProps {
  appointment?: DoctorScheduleItem;
  onMarkComplete: (id: string) => void;
  onConfirm?: (id: string) => void;
  actionLoadingId?: string | null;
}

const statusChip: Record<string, string> = {
  CONFIRMED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PENDING:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  COMPLETED: "border-border bg-muted text-muted-foreground",
  CANCELLED: "border-border bg-muted text-muted-foreground",
};

export const DoctorNextConsultation: React.FC<DoctorNextConsultationProps> = ({
  appointment,
  onMarkComplete,
  onConfirm,
  actionLoadingId = null,
}) => {
  const isLoadingThis = appointment ? actionLoadingId === appointment.id : false;

  if (!appointment) {
    return (
      <section className="panel flex items-center gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Calendar className="h-4 w-4" />
        </div>
        <div>
          <p className="panel-title">No pending consultation</p>
          <p className="text-xs text-muted-foreground">
            Your clinical schedule is clear for the rest of today.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">Next patient</h2>
        <span className="text-xs font-medium tabular-nums text-muted-foreground">
          Today · {appointment.time}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarImage
              src={appointment.patientAvatar}
              alt={appointment.patientName}
            />
            <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
              {appointment.patientName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-foreground">
                {appointment.patientName}
              </h3>
              <span className="text-xs text-muted-foreground">
                {appointment.patientAge}y · {appointment.patientGender}
              </span>
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
                {appointment.consultationType}
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Calendar className="h-3 w-3" />
                {appointment.time}
              </span>
              <span aria-hidden>·</span>
              <span>Fee ৳{appointment.fee}</span>
            </div>

            {appointment.symptoms && (
              <p className="truncate text-[11px] text-muted-foreground">
                <span className="font-medium text-secondary-text">Notes: </span>
                {appointment.symptoms}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:justify-end">
          {appointment.status === "PENDING" && onConfirm && (
            <Button
              size="sm"
              disabled={isLoadingThis}
              onClick={() => onConfirm(appointment.id)}
              className="h-8 rounded-md px-3 text-xs font-semibold"
            >
              {isLoadingThis ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              <span>{isLoadingThis ? "Confirming…" : "Confirm"}</span>
            </Button>
          )}

          {appointment.meetLink && appointment.status === "CONFIRMED" && (
            <a
              href={appointment.meetLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" className="h-8 rounded-md px-3 text-xs font-semibold">
                <Video className="h-3.5 w-3.5" />
                <span>Start call</span>
              </Button>
            </a>
          )}

          {appointment.status === "CONFIRMED" && (
            <Button
              variant="outline"
              size="sm"
              disabled={isLoadingThis}
              onClick={() => onMarkComplete(appointment.id)}
              className="h-8 rounded-md px-3 text-xs font-semibold"
            >
              {isLoadingThis ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              <span>{isLoadingThis ? "Completing…" : "Mark complete"}</span>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorNextConsultation;
