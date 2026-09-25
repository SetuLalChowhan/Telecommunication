import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAppointment } from "../api/appointments.queries";
import type { AdminAppointment, BookingStatus, UpdateAppointmentPayload } from "../types";

const STATUSES: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

/** Mounted with `key={appointment.id}` so a new booking resets the form without an effect. */
function AppointmentForm({
  appointment,
  onClose,
}: {
  appointment: AdminAppointment;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<BookingStatus>(appointment.status);
  const [notes, setNotes] = useState(appointment.notes ?? "");
  const [meetLink, setMeetLink] = useState(appointment.meetLink ?? "");
  const updateAppointment = useUpdateAppointment();

  const handleSubmit = () => {
    const payload: UpdateAppointmentPayload = {
      status,
      notes: notes.trim() || undefined,
      meetLink: meetLink.trim() || undefined,
    };

    updateAppointment.mutate({ id: appointment.id, payload }, { onSuccess: onClose });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as BookingStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="appointment-meet-link">Meeting link</Label>
          <Input
            id="appointment-meet-link"
            value={meetLink}
            placeholder="https://meet.google.com/…"
            onChange={(event) => setMeetLink(event.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="appointment-notes">Notes</Label>
          <Textarea
            id="appointment-notes"
            rows={4}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-2">
        <Button variant="outline" className="cursor-pointer" onClick={onClose}>
          Cancel
        </Button>
        <Button className="cursor-pointer" disabled={updateAppointment.isPending} onClick={handleSubmit}>
          {updateAppointment.isPending ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </>
  );
}

interface EditAppointmentDialogProps {
  appointment: AdminAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAppointmentDialog({
  appointment,
  open,
  onOpenChange,
}: EditAppointmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit appointment</DialogTitle>
          <DialogDescription>
            {appointment
              ? `${appointment.patient.user.name ?? "Patient"} with ${appointment.doctor.user.name ?? "doctor"}`
              : "Update the appointment status and details."}
          </DialogDescription>
        </DialogHeader>

        {appointment && (
          <AppointmentForm
            key={appointment.id}
            appointment={appointment}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditAppointmentDialog;
