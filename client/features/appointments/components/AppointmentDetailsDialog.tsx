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
} from "lucide-react";
import { DashboardAppointment } from "@/features/appointments/types";
import { MedicalReport } from "@/features/medical-reports/types";
import { useBookingMedicalReports } from "@/features/medical-reports/api/queries";
import { fetchReportBlob, getReportFileUrl } from "@/features/medical-reports/api/client";
import { RecordDetailsDialog } from "@/features/medical-reports/components/records/RecordDetailsDialog";
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
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null);

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
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                {reports.length} report{reports.length === 1 ? "" : "s"}
              </span>
            </div>

            {reports.length === 0 ? (
              <p className="text-[11px] text-muted-foreground italic">
                {isDoctorView
                  ? "No medical reports attached to this visit."
                  : "No medical reports uploaded for this visit."}
              </p>
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
  </>
  );
};

export default AppointmentDetailsDialog;
