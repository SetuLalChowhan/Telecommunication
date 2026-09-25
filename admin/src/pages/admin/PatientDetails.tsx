import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorState, TableSkeleton } from "@/components/common/States";
import { isNotFound } from "@/lib/api/error";
import { useDeletePatient, usePatient } from "@/features/patients/api/patients.queries";
import { EditPatientDialog } from "@/features/patients/components/EditPatientDialog";
import { AppointmentStatusBadge } from "@/features/appointments/components/AppointmentStatusBadge";

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  const isEmpty = value === null || value === undefined || value === "";
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground">{isEmpty ? "—" : value}</span>
    </div>
  );
}

const PatientDetails = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isPending, isError, error, refetch } = usePatient(id);
  const removePatient = useDeletePatient();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const BackLink = (
    <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs cursor-pointer">
      <Link to="/dashboard/patients">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to patients
      </Link>
    </Button>
  );

  if (isError) {
    return (
      <div className="space-y-4">
        {BackLink}
        <ErrorState
          error={error}
          onRetry={() => refetch()}
          title={isNotFound(error) ? "Patient not found" : "Unable to load this patient"}
        />
      </div>
    );
  }

  if (isPending || !patient) {
    return (
      <div className="space-y-4">
        {BackLink}
        <Card className="border border-border/70 shadow-sm">
          <CardContent className="pt-6">
            <TableSkeleton rows={6} columns={3} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {BackLink}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              {patient.user.name ?? "Unnamed patient"}
            </h2>
            <p className="text-sm text-muted-foreground">{patient.user.email}</p>
            {patient.user.phone && (
              <p className="text-xs text-muted-foreground">{patient.user.phone}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold cursor-pointer"
              onClick={() => setEditing(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 text-xs font-semibold cursor-pointer"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Profile</CardTitle>
          <CardDescription className="text-xs">Account and health profile details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="Gender" value={patient.gender} />
          <InfoRow label="Blood group" value={patient.bloodGroup?.replace("_", " ")} />
          <InfoRow
            label="Date of birth"
            value={patient.user.dateOfBirth ? new Date(patient.user.dateOfBirth).toLocaleDateString() : null}
          />
          <InfoRow label="Address" value={patient.address} />
          <InfoRow label="Emergency contact" value={patient.emergencyContactName} />
          <InfoRow label="Emergency phone" value={patient.emergencyContactPhone} />
          <InfoRow label="Email verified" value={patient.user.emailVerified ? "Yes" : "No"} />
          <InfoRow
            label="Registered"
            value={new Date(patient.createdAt).toLocaleDateString()}
          />
        </CardContent>
      </Card>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Recent appointments</CardTitle>
          <CardDescription className="text-xs">
            Latest {patient.bookings.length} booking(s) for this patient.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {patient.bookings.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              This patient has no appointments.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {booking.doctor.user.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(booking.slotStart).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <AppointmentStatusBadge status={booking.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Medical reports</CardTitle>
          <CardDescription className="text-xs">
            Files uploaded by or for this patient.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {patient.medicalReports.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">No medical reports.</p>
          ) : (
            <ul className="divide-y">
              {patient.medicalReports.map((report) => (
                <li key={report.id} className="flex items-center justify-between py-2.5">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      {report.fileName ?? "Medical document"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.uploadedAt).toLocaleString()}
                    </span>
                  </div>
                  <Badge variant="secondary" className="gap-1 text-[10px] font-semibold shadow-none">
                    <ExternalLink className="h-3 w-3" />
                    PDF
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <EditPatientDialog
        patient={patient}
        open={editing}
        onOpenChange={setEditing}
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this patient?"
        description={`${patient.user.name ?? patient.user.email} and all of their bookings will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        isPending={removePatient.isPending}
        onConfirm={() =>
          removePatient.mutate(patient.id, {
            onSuccess: () => navigate("/dashboard/patients"),
          })
        }
      />
    </div>
  );
};

export default PatientDetails;
