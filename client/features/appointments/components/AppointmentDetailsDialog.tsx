"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

interface AppointmentDetailsDialogProps {
  appointment: DashboardAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelAppointment?: (id: string) => void;
  onConfirmAppointment?: (id: string) => void;
  onCompleteAppointment?: (id: string) => void;
  isDoctorView?: boolean;
  isCancelling?: boolean;
  isCompleting?: boolean;
  isConfirming?: boolean;
}

const statusChip: Record<string, string> = {
  CONFIRMED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PENDING:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  COMPLETED: "border-border bg-muted text-muted-foreground",
  CANCELLED: "border-border bg-muted text-muted-foreground",
};

export const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({
  appointment,
  open,
  onOpenChange,
  onCancelAppointment,
  onConfirmAppointment,
  onCompleteAppointment,
  isDoctorView = false,
  isCancelling = false,
  isCompleting = false,
  isConfirming = false,
}) => {
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!appointment) return null;

  const counterpartName = isDoctorView
    ? appointment.patientName
    : appointment.doctorName;
  const counterpartAvatar = isDoctorView
    ? appointment.patientAvatar
    : appointment.doctorAvatar;

  const handleCancel = () => {
    if (onCancelAppointment) {
      onCancelAppointment(appointment.id);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setConfirmCancel(false);
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "status-chip",
                statusChip[appointment.status] ?? statusChip.COMPLETED
              )}
            >
              {appointment.status}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              #{appointment.id.slice(-8)}
            </span>
          </div>
          <DialogTitle>Consultation details</DialogTitle>
          <DialogDescription>
            Schedule, notes and video visit credentials.
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {/* Counterpart banner */}
          <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={counterpartAvatar} alt={counterpartName} />
              <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                {counterpartName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">
                {counterpartName}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {isDoctorView
                  ? `Patient · ${appointment.patientAge || 30}y · ${
                      appointment.patientGender || "—"
                    }`
                  : appointment.doctorSpecialty}
              </p>
            </div>
          </div>

          {/* Schedule & fee */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1 rounded-md border border-border p-2.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Schedule
              </span>
              <p className="text-xs font-semibold tabular-nums text-foreground">
                {appointment.dateFormatted} · {appointment.timeFormatted}
              </p>
            </div>

            <div className="space-y-1 rounded-md border border-border p-2.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3 w-3" />
                Fee paid
              </span>
              <p className="text-xs font-semibold tabular-nums text-foreground">
                ৳{appointment.fee}
              </p>
            </div>
          </div>

          {/* Reported symptoms */}
          {appointment.symptoms && (
            <div className="space-y-1 rounded-md border border-border p-2.5">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3 w-3" />
                Reported symptoms
              </span>
              <p className="text-xs leading-relaxed text-foreground">
                {appointment.symptoms}
              </p>
            </div>
          )}

          {/* Cancellation prompt */}
          {confirmCancel && (
            <div className="space-y-2.5 rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Cancel this appointment?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-destructive/90">
                The slot is released and the patient is notified. This cannot be
                undone.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isCancelling}
                  onClick={handleCancel}
                  className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Cancelling…</span>
                    </>
                  ) : (
                    <span>Confirm cancel</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isCancelling}
                  onClick={() => setConfirmCancel(false)}
                  className="h-8 rounded-md px-3 text-xs"
                >
                  Keep
                </Button>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="sm:justify-between">
          <div>
            {appointment.status !== "CANCELLED" &&
              appointment.status !== "COMPLETED" &&
              !confirmCancel && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmCancel(true)}
                  className="h-8 rounded-md px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                >
                  Cancel visit
                </Button>
              )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 rounded-md px-3 text-xs"
            >
              Close
            </Button>

            {isDoctorView &&
              appointment.status === "PENDING" &&
              onConfirmAppointment && (
                <Button
                  size="sm"
                  disabled={isConfirming}
                  onClick={() => onConfirmAppointment(appointment.id)}
                  className="h-8 rounded-md px-3 text-xs font-semibold"
                >
                  {isConfirming ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>{isConfirming ? "Confirming…" : "Confirm"}</span>
                </Button>
              )}

            {isDoctorView &&
              appointment.status === "CONFIRMED" &&
              onCompleteAppointment && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isCompleting}
                  onClick={() => onCompleteAppointment(appointment.id)}
                  className="h-8 rounded-md px-3 text-xs font-semibold"
                >
                  {isCompleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>{isCompleting ? "Completing…" : "Mark complete"}</span>
                </Button>
              )}

            {appointment.meetLink && appointment.status === "CONFIRMED" && (
              <a
                href={appointment.meetLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="h-8 rounded-md px-3 text-xs font-semibold"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Join call</span>
                </Button>
              </a>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;
