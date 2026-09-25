import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import type { AdminAppointment } from "../types";

interface AppointmentsTableProps {
  appointments: AdminAppointment[];
  onView: (appointment: AdminAppointment) => void;
  onEdit: (appointment: AdminAppointment) => void;
  onDelete: (appointment: AdminAppointment) => void;
  isUpdating?: boolean;
}

function formatSlot(start: string, end: string): string {
  const from = new Date(start);
  const to = new Date(end);
  const date = from.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  const time = `${from.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} – ${to.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
  return `${date} · ${time}`;
}

export function AppointmentsTable({
  appointments,
  onView,
  onEdit,
  onDelete,
  isUpdating = false,
}: AppointmentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Slot</TableHead>
          <TableHead>Reports</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">
                  {appointment.patient.user.name ?? "Unnamed"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {appointment.patient.user.email}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">
                  {appointment.doctor.user.name ?? "Unnamed"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {appointment.doctor.user.email}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {formatSlot(appointment.slotStart, appointment.slotEnd)}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {appointment.reports.length}
            </TableCell>
            <TableCell>
              <AppointmentStatusBadge status={appointment.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs cursor-pointer"
                  onClick={() => onView(appointment)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                  disabled={isUpdating}
                  onClick={() => onEdit(appointment)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold cursor-pointer"
                  disabled={isUpdating}
                  onClick={() => onDelete(appointment)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AppointmentsTable;
