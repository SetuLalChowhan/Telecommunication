import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/common/States";
import {
  useAppointments,
  useDeleteAppointment,
} from "@/features/appointments/api/appointments.queries";
import { AppointmentsTable } from "@/features/appointments/components/AppointmentsTable";
import { AppointmentDetailsDialog } from "@/features/appointments/components/AppointmentDetailsDialog";
import { EditAppointmentDialog } from "@/features/appointments/components/EditAppointmentDialog";
import type {
  AdminAppointment,
  AppointmentQueryParams,
  BookingStatus,
} from "@/features/appointments/types";

const PAGE_LIMIT = 10;

type StatusFilter = "all" | BookingStatus;

const Appointments = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [viewing, setViewing] = useState<AdminAppointment | null>(null);
  const [editing, setEditing] = useState<AdminAppointment | null>(null);
  const [deleting, setDeleting] = useState<AdminAppointment | null>(null);

  const removeAppointment = useDeleteAppointment();

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const params: AppointmentQueryParams = {
    page,
    limit: PAGE_LIMIT,
    status: status === "all" ? undefined : status,
  };

  const { data, isPending, isError, error, refetch, isFetching } = useAppointments(params);
  const appointments = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Appointments</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monitor all consultations, adjust status, or remove a booking.
        </p>
      </div>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader className="pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-bold">All appointments</CardTitle>
            <CardDescription className="text-xs">
              {data ? `${data.meta.total} booking(s) match the current filter.` : "Loading appointments…"}
            </CardDescription>
          </div>
          <Select value={status} onValueChange={(value) => handleStatusChange(value as StatusFilter)}>
            <SelectTrigger className="h-9 w-full text-xs sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="pt-0">
          {isError ? (
            <ErrorState error={error} onRetry={() => refetch()} title="Unable to load appointments" />
          ) : isPending ? (
            <TableSkeleton rows={5} columns={6} />
          ) : appointments.length === 0 ? (
            <EmptyState title="No appointments found" description="Try a different status filter." />
          ) : (
            <>
              <AppointmentsTable
                appointments={appointments}
                onView={setViewing}
                onEdit={setEditing}
                onDelete={setDeleting}
                isUpdating={removeAppointment.isPending}
              />
              {data && <Pagination meta={data.meta} onPageChange={setPage} isFetching={isFetching} />}
            </>
          )}
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointment={viewing}
        open={viewing !== null}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      />

      <EditAppointmentDialog
        appointment={editing}
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete this appointment?"
        description={
          deleting
            ? `The booking on ${new Date(deleting.slotStart).toLocaleString()} will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        isPending={removeAppointment.isPending}
        onConfirm={() => {
          if (!deleting) return;
          removeAppointment.mutate(deleting.id, { onSettled: () => setDeleting(null) });
        }}
      />
    </div>
  );
};

export default Appointments;
