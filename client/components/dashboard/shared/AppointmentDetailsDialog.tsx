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
} from "lucide-react";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";

interface AppointmentDetailsDialogProps {
  appointment: DashboardAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelAppointment?: (id: string) => void;
  isDoctorView?: boolean;
}

export const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({
  appointment,
  open,
  onOpenChange,
  onCancelAppointment,
  isDoctorView = false,
}) => {
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!appointment) return null;

  const handleCancel = () => {
    if (onCancelAppointment) {
      onCancelAppointment(appointment.id);
    }
    setConfirmCancel(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setConfirmCancel(false);
      onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-6 space-y-4">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
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
            <span className="text-xs text-muted-foreground font-mono">
              ID: {appointment.id}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground pt-1">
            Consultation Details
          </DialogTitle>
          <DialogDescription className="text-xs">
            Review appointment timing, medical symptoms, and secure consultation credentials.
          </DialogDescription>
        </DialogHeader>

        {/* Doctor or Patient Profile Banner */}
        <div className="rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/30 p-4 flex items-center gap-3.5">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20 shrink-0">
            <AvatarImage
              src={isDoctorView ? appointment.patientAvatar : appointment.doctorAvatar}
              alt={isDoctorView ? appointment.patientName : appointment.doctorName}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {(isDoctorView ? appointment.patientName : appointment.doctorName).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-sm font-bold text-foreground truncate">
              {isDoctorView ? appointment.patientName : appointment.doctorName}
            </h3>
            <p className="text-xs text-primary font-medium">
              {isDoctorView ? `Patient (${appointment.patientAge || 30} yrs, ${appointment.patientGender || "Male"})` : appointment.doctorSpecialty}
            </p>
            {appointment.doctorHospital && !isDoctorView && (
              <p className="text-[11px] text-muted-foreground truncate">
                {appointment.doctorHospital}
              </p>
            )}
          </div>
        </div>

        {/* Timing & Fee Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-border p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Date & Time</span>
            </div>
            <p className="font-semibold text-foreground">
              {appointment.dateFormatted} · {appointment.timeFormatted}
            </p>
          </div>

          <div className="rounded-xl border border-border p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Consultation Fee</span>
            </div>
            <p className="font-semibold text-foreground">
              ৳{appointment.fee} (Paid)
            </p>
          </div>
        </div>

        {/* Symptoms & Medical Notes */}
        {appointment.symptoms && (
          <div className="rounded-xl border border-border p-3.5 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>Reported Symptoms / Reason:</span>
            </div>
            <p className="text-secondary-text leading-relaxed">
              {appointment.symptoms}
            </p>
          </div>
        )}

        {/* Cancel Confirmation Prompt */}
        {confirmCancel && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>Are you sure you want to cancel this appointment?</span>
            </div>
            <p className="text-secondary-text">
              Cancellation is permanent. If you paid online, our refund policy applies.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                className="h-8 px-3 text-xs"
              >
                Yes, Cancel Appointment
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmCancel(false)}
                className="h-8 px-3 text-xs"
              >
                Keep Appointment
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {appointment.status !== "CANCELLED" && appointment.status !== "COMPLETED" && !confirmCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmCancel(true)}
              className="text-destructive hover:bg-destructive/10 text-xs font-semibold h-9 px-3 self-start"
            >
              Cancel Appointment
            </Button>
          )}

          <div className="flex items-center gap-2 self-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 rounded-xl text-xs"
            >
              Close
            </Button>

            {appointment.meetLink && appointment.status === "CONFIRMED" && (
              <a
                href={appointment.meetLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
                  <Video className="h-3.5 w-3.5" />
                  <span>Join Consultation</span>
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
