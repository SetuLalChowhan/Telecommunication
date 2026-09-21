"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
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
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
                appointment.status === "CONFIRMED"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : appointment.status === "PENDING"
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : appointment.status === "COMPLETED"
                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              {appointment.status}
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              #{appointment.id}
            </span>
          </div>
          <DialogTitle>Consultation Details</DialogTitle>
          <DialogDescription>
            Appointment schedule, patient notes, and video visit credentials.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          {/* Doctor or Patient Profile Banner */}
          <div className="rounded-lg border border-border/70 p-3 flex items-center gap-3 bg-muted/20">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage
                src={isDoctorView ? appointment.patientAvatar : appointment.doctorAvatar}
                alt={isDoctorView ? appointment.patientName : appointment.doctorName}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {(isDoctorView ? appointment.patientName : appointment.doctorName).slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {isDoctorView ? appointment.patientName : appointment.doctorName}
              </p>
              <p className="text-[11px] text-primary font-medium">
                {isDoctorView
                  ? `Patient (${appointment.patientAge || 30}y, ${appointment.patientGender || "Male"})`
                  : appointment.doctorSpecialty}
              </p>
            </div>
          </div>

          {/* Timing & Fee Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-border/70 p-2.5 space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3 text-primary" />
                Schedule
              </span>
              <p className="font-semibold text-foreground text-xs">
                {appointment.dateFormatted} · {appointment.timeFormatted}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 p-2.5 space-y-1">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3 text-primary" />
                Fee Paid
              </span>
              <p className="font-semibold text-foreground text-xs">
                ৳{appointment.fee}
              </p>
            </div>
          </div>

          {/* Symptoms & Notes */}
          {appointment.symptoms && (
            <div className="rounded-lg border border-border/70 p-2.5 space-y-1 text-xs">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                <FileText className="h-3 w-3 text-primary" />
                Reason / Reported Symptoms
              </span>
              <p className="text-foreground text-xs leading-relaxed">
                {appointment.symptoms}
              </p>
            </div>
          )}

          {/* Cancel Confirmation Prompt */}
          {confirmCancel && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Confirm appointment cancellation?</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isCancelling}
                  onClick={handleCancel}
                  className="h-7.5 px-3 text-xs gap-1.5"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Confirm Cancel</span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isCancelling}
                  onClick={() => setConfirmCancel(false)}
                  className="h-7.5 px-3 text-xs"
                >
                  Keep
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && !confirmCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmCancel(true)}
                className="text-destructive hover:bg-destructive/10 text-xs h-8 px-2"
              >
                Cancel Visit
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8.5 px-3 text-xs"
            >
              Close
            </Button>

            {isDoctorView && appointment.status === "PENDING" && onConfirmAppointment && (
              <Button
                size="sm"
                disabled={isConfirming}
                onClick={() => {
                  onConfirmAppointment(appointment.id);
                }}
                className="h-8.5 px-3.5 text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
              >
                {isConfirming ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                <span>{isConfirming ? "Confirming..." : "Confirm Appointment"}</span>
              </Button>
            )}

            {isDoctorView && appointment.status === "CONFIRMED" && onCompleteAppointment && (
              <Button
                variant="outline"
                size="sm"
                disabled={isCompleting}
                onClick={() => {
                  onCompleteAppointment(appointment.id);
                }}
                className="h-8.5 px-3.5 text-xs font-semibold gap-1.5 border-border hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
              >
                {isCompleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span>{isCompleting ? "Completing..." : "Complete Consultation"}</span>
              </Button>
            )}

            {appointment.meetLink && appointment.status === "CONFIRMED" && (
              <a
                href={appointment.meetLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="h-8.5 px-3.5 text-xs font-medium gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Video className="h-3.5 w-3.5" />
                  <span>Join Call</span>
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
