import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import type { AdminAppointment } from "../types";

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="text-right text-xs text-foreground">{value || "—"}</span>
    </div>
  );
}

export function AppointmentDetailsDialog({
  appointment,
  open,
  onOpenChange,
}: {
  appointment: AdminAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Appointment
            {appointment && <AppointmentStatusBadge status={appointment.status} />}
          </DialogTitle>
          <DialogDescription>Full booking record stored by the server.</DialogDescription>
        </DialogHeader>

        {appointment && (
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Patient
              </p>
              <Row label="Name" value={appointment.patient.user.name} />
              <Row label="Email" value={appointment.patient.user.email} />
              <Row label="Phone" value={appointment.patient.user.phone} />
            </div>
            <Separator />
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Doctor
              </p>
              <Row label="Name" value={appointment.doctor.user.name} />
              <Row label="Email" value={appointment.doctor.user.email} />
            </div>
            <Separator />
            <div>
              <Row label="Start" value={new Date(appointment.slotStart).toLocaleString()} />
              <Row label="End" value={new Date(appointment.slotEnd).toLocaleString()} />
              <Row label="Notes" value={appointment.notes} />
              <Row label="Meet link" value={appointment.meetLink} />
              <Row
                label="Review"
                value={appointment.review ? `${appointment.review.rating}/5` : "None"}
              />
              <Row label="Reports" value={String(appointment.reports.length)} />
            </div>

            {appointment.reports.length > 0 && (
              <>
                <Separator />
                <ul className="space-y-1.5">
                  {appointment.reports.map((report) => (
                    <li key={report.id}>
                      <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        {report.fileName ?? "Medical document"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentDetailsDialog;
