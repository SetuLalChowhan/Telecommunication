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
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState, ErrorState, TableSkeleton } from "@/components/common/States";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { usePatients, useDeletePatient } from "@/features/patients/api/patients.queries";
import { PatientsTable } from "@/features/patients/components/PatientsTable";
import { EditPatientDialog } from "@/features/patients/components/EditPatientDialog";
import type { AdminPatient, PatientQueryParams } from "@/features/patients/types";

const PAGE_LIMIT = 10;

const Patients = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<AdminPatient | null>(null);
  const [deleting, setDeleting] = useState<AdminPatient | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);
  const removePatient = useDeletePatient();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const params: PatientQueryParams = {
    page,
    limit: PAGE_LIMIT,
    search: debouncedSearch.trim() || undefined,
  };

  const { data, isPending, isError, error, refetch, isFetching } = usePatients(params);
  const patients = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Patients</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Browse patient accounts, edit their details, or remove an account.
        </p>
      </div>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader className="pb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-bold">All patients</CardTitle>
            <CardDescription className="text-xs">
              {data ? `${data.meta.total} patient(s) registered.` : "Loading patients…"}
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by name…"
              className="h-9 w-full pl-9 text-xs sm:w-60"
            />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {isError ? (
            <ErrorState error={error} onRetry={() => refetch()} title="Unable to load patients" />
          ) : isPending ? (
            <TableSkeleton rows={5} columns={6} />
          ) : patients.length === 0 ? (
            <EmptyState
              title="No patients found"
              description="Try adjusting the search term."
            />
          ) : (
            <>
              <PatientsTable
                patients={patients}
                onEdit={setEditing}
                onDelete={setDeleting}
                isUpdating={removePatient.isPending}
              />
              {data && <Pagination meta={data.meta} onPageChange={setPage} isFetching={isFetching} />}
            </>
          )}
        </CardContent>
      </Card>

      <EditPatientDialog
        patient={editing}
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
        title="Delete this patient?"
        description={
          deleting
            ? `${deleting.user.name ?? deleting.user.email} and all of their bookings will be permanently removed.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        isPending={removePatient.isPending}
        onConfirm={() => {
          if (!deleting) return;
          removePatient.mutate(deleting.id, { onSettled: () => setDeleting(null) });
        }}
      />
    </div>
  );
};

export default Patients;
