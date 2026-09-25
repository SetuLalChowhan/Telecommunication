import { useState } from "react";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useDeleteDoctor, useDoctors } from "@/features/doctors/api/doctors.queries";
import { DoctorsTable } from "@/features/doctors/components/DoctorsTable";
import { EditDoctorDialog } from "@/features/doctors/components/EditDoctorDialog";
import { useDoctorVerification } from "@/features/doctors/hooks/useDoctorVerification";
import type { AdminDoctor, DoctorQueryParams } from "@/features/doctors/types";

const PAGE_LIMIT = 10;

type StatusFilter = "all" | "verified" | "pending";

const Doctors = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  // Debounced so typing does not fire a request per keystroke.
  const debouncedSearch = useDebouncedValue(search, 400);

  // Changing a filter returns the user to page 1. Done in the handlers rather
  // than an effect so there is no cascading render.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  // One endpoint (`GET /admin/doctors`) serves search, filter and pagination.
  const params: DoctorQueryParams = {
    page,
    limit: PAGE_LIMIT,
    search: debouncedSearch.trim() || undefined,
    verified: status === "all" ? undefined : status === "verified",
  };

  const { data, isPending, isError, error, refetch, isFetching } = useDoctors(params);
  const verification = useDoctorVerification();
  const removeDoctor = useDeleteDoctor();
  const [editing, setEditing] = useState<AdminDoctor | null>(null);
  const [deleting, setDeleting] = useState<AdminDoctor | null>(null);

  const doctors = data?.data ?? [];
  const isApprove = verification.pending?.type === "approve";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Doctors</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review registrations and verify practitioner credentials.
        </p>
      </div>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader className="pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-bold">Verification queue</CardTitle>
            <CardDescription className="text-xs">
              {data
                ? `${data.meta.total} doctor(s) match the current filters.`
                : "Loading doctors…"}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search by name…"
                className="h-9 w-full pl-9 text-xs sm:w-60"
              />
            </div>
            <Select value={status} onValueChange={(value) => handleStatusChange(value as StatusFilter)}>
              <SelectTrigger className="h-9 w-full text-xs sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isError ? (
            <ErrorState error={error} onRetry={() => refetch()} title="Unable to load doctors" />
          ) : isPending ? (
            <TableSkeleton rows={5} columns={6} />
          ) : doctors.length === 0 ? (
            <EmptyState
              title="No doctors found"
              description="Try adjusting the search term or the status filter."
            />
          ) : (
            <>
              <DoctorsTable
                doctors={doctors}
                onApprove={verification.requestApprove}
                onReject={verification.requestReject}
                onEdit={setEditing}
                onDelete={setDeleting}
                isUpdating={verification.isPending || removeDoctor.isPending}
              />
              {data && (
                <Pagination meta={data.meta} onPageChange={setPage} isFetching={isFetching} />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={verification.pending !== null}
        onOpenChange={(open) => {
          if (!open) verification.cancel();
        }}
        title={isApprove ? "Approve this doctor?" : "Reject this doctor?"}
        description={
          verification.pending
            ? isApprove
              ? `${verification.pending.doctor.user.name ?? "This doctor"} will be marked verified and all pending documents approved.`
              : `${verification.pending.doctor.user.name ?? "This doctor"} will be marked unverified and their documents rejected.`
            : undefined
        }
        confirmLabel={isApprove ? "Approve" : "Reject"}
        destructive={!isApprove}
        isPending={verification.isPending}
        onConfirm={verification.confirm}
      />

      <EditDoctorDialog
        doctor={editing}
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
        title="Delete this doctor?"
        description={
          deleting
            ? `${deleting.user.name ?? deleting.user.email} and all of their appointments will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        isPending={removeDoctor.isPending}
        onConfirm={() => {
          if (!deleting) return;
          removeDoctor.mutate(deleting.id, { onSettled: () => setDeleting(null) });
        }}
      />
    </div>
  );
};

export default Doctors;
