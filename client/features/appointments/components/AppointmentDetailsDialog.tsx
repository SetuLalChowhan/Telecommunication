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
  Phone,
  Eye,
  Download,
  Plus,
  Star,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { DashboardAppointment } from "@/features/appointments/types";
import { MedicalReport } from "@/features/medical-reports/types";
import { useBookingMedicalReports } from "@/features/medical-reports/api/queries";
import { fetchReportBlob, getReportFileUrl } from "@/features/medical-reports/api/client";
import { RecordDetailsDialog } from "@/features/medical-reports/components/records/RecordDetailsDialog";
import { UploadReportModal } from "@/features/medical-reports";
import { cn } from "@/lib/utils";

interface AppointmentDetailsDialogProps {
  appointment: DashboardAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelAppointment?: (id: string) => void;
  onConfirmAppointment?: (id: string) => void;
  onCompleteAppointment?: (id: string) => void;
  onRescheduleAppointment?: (appointment: DashboardAppointment) => void;
  onRateAppointment?: (appointment: DashboardAppointment) => void;
  isDoctorView?: boolean;
  isCancelling?: boolean;
  isCompleting?: boolean;
  isConfirming?: boolean;
}

const statusChip: Record<string, string> = {
  CONFIRMED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  RESCHEDULED:
    "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  PENDING:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  COMPLETED: "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400",
  CANCELLED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export const AppointmentDetailsDialog: React.FC<AppointmentDetailsDialogProps> = ({
  appointment,
  open,
  onOpenChange,
  onCancelAppointment,
  onConfirmAppointment,
  onCompleteAppointment,
  onRescheduleAppointment,
  onRateAppointment,
  isDoctorView = false,
  isCancelling = false,
  isCompleting = false,
  isConfirming = false,
}) => {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { data: bookingReports = [] } = useBookingMedicalReports(
    open && appointment ? appointment.id : null
  );

  if (!appointment) return null;

  const reports: MedicalReport[] =
    bookingReports.length > 0 ? bookingReports : appointment.reports || [];

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
    <>
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
              {(isDoctorView ? appointment.patientPhone : appointment.doctorPhone) && (
                <a
                  href={`tel:${isDoctorView ? appointment.patientPhone : appointment.doctorPhone}`}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  <span>{isDoctorView ? appointment.patientPhone : appointment.doctorPhone}</span>
                </a>
              )}
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

          {/* Rescheduled Notice */}
          {appointment.status === "RESCHEDULED" && (
            <div className="flex items-start gap-2.5 rounded-md border border-blue-500/20 bg-blue-500/5 p-2.5 text-xs">
              <RefreshCw className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  Rescheduled Appointment
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  This consultation has been moved to a new time slot. All consultation details have been updated.
                </p>
              </div>
            </div>
          )}

          {/* Cancelled & Refund Notice */}
          {appointment.status === "CANCELLED" && (
            <div className="flex items-start gap-2.5 rounded-md border border-destructive/20 bg-destructive/5 p-2.5 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-destructive">
                  Appointment Cancelled
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  This appointment has been cancelled and the time slot was released.
                  {appointment.fee > 0 && " Payment refund has been recorded as Refund Pending / Initiated."}
                </p>
              </div>
            </div>
          )}

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

          {/* Medical Reports Section */}
          <div className="space-y-2 rounded-md border border-border p-2.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3 w-3 text-primary" />
                Medical Reports &amp; Documents
              </span>
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  {reports.length} report{reports.length === 1 ? "" : "s"}
                </span>
                {!isDoctorView && appointment.status !== "CANCELLED" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadModalOpen(true)}
                    className="h-6 gap-1 px-2 text-[10px] font-semibold text-primary hover:text-primary"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    <span>Upload</span>
                  </Button>
                )}
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="py-2 text-center space-y-1.5">
                <p className="text-[11px] text-muted-foreground italic">
                  {isDoctorView
                    ? "No medical reports attached to this visit."
                    : "No medical reports uploaded for this visit."}
                </p>
                {!isDoctorView && appointment.status !== "CANCELLED" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setUploadModalOpen(true)}
                    className="h-7 px-2.5 text-xs font-medium gap-1 text-primary mx-auto"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Attach medical report</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between gap-2 rounded border border-border bg-card p-2 text-xs hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate font-medium text-foreground">
                        {report.fileName || "Medical Document"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                        className="h-6 px-2 text-[11px] font-medium gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={downloadingReportId === report.id}
                        onClick={async () => {
                          setDownloadingReportId(report.id);
                          try {
                            const blob = await fetchReportBlob(report.id, "download");
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = report.fileName || "medical-report";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            setTimeout(() => URL.revokeObjectURL(url), 1000);
                          } catch {
                            window.location.href = getReportFileUrl(report.id, "download");
                          } finally {
                            setDownloadingReportId(null);
                          }
                        }}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        title="Download report"
                      >
                        {downloadingReportId === report.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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
            {!isDoctorView && appointment.status === "COMPLETED" && onRateAppointment && (
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onRateAppointment(appointment);
                }}
                className="h-8 rounded-md px-3 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white gap-1.5 shadow-xs cursor-pointer"
              >
                <Star className="h-3.5 w-3.5 fill-amber-300" />
                <span>Rate Doctor</span>
              </Button>
            )}

            {isDoctorView &&
              (appointment.status === "PENDING" || appointment.status === "CONFIRMED" || appointment.status === "RESCHEDULED") &&
              onRescheduleAppointment && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onRescheduleAppointment(appointment);
                  }}
                  className="h-8 rounded-md px-3 text-xs font-semibold gap-1.5 text-primary border-primary/30 hover:bg-primary/10 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Reschedule</span>
                </Button>
              )}

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

    <RecordDetailsDialog
      report={selectedReport}
      onOpenChange={(val) => !val && setSelectedReport(null)}
    />

    <UploadReportModal
      open={uploadModalOpen}
      onOpenChange={setUploadModalOpen}
      defaultBookingId={appointment.id}
    />
  </>
  );
};

export default AppointmentDetailsDialog;
