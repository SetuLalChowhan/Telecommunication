import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, X } from "lucide-react";
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
import { useDoctor, useUpdateDocumentStatus } from "@/features/doctors/api/doctors.queries";
import {
  DoctorStatusBadge,
  DocumentStatusBadge,
} from "@/features/doctors/components/DoctorStatusBadge";
import { useDoctorVerification } from "@/features/doctors/hooks/useDoctorVerification";
import type { DoctorDocument, DocumentStatus } from "@/features/doctors/types";

function BackLink() {
  return (
    <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs cursor-pointer">
      <Link to="/dashboard/doctors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to doctors
      </Link>
    </Button>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
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

const DoctorDetails = () => {
  const { id = "" } = useParams<{ id: string }>();
  const { data: doctor, isPending, isError, error, refetch } = useDoctor(id);
  const verification = useDoctorVerification();
  const documentStatus = useUpdateDocumentStatus();

  const isApprove = verification.pending?.type === "approve";

  const setDocumentStatus = (document: DoctorDocument, status: DocumentStatus) => {
    documentStatus.mutate({ documentId: document.id, status });
  };

  if (isError) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          error={error}
          onRetry={() => refetch()}
          title={isNotFound(error) ? "Doctor not found" : "Unable to load this doctor"}
        />
      </div>
    );
  }

  if (isPending || !doctor) {
    return (
      <div className="space-y-4">
        <BackLink />
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
        <BackLink />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                {doctor.user.name ?? "Unnamed doctor"}
              </h2>
              <DoctorStatusBadge verified={doctor.verified} />
            </div>
            <p className="text-sm text-muted-foreground">{doctor.user.email}</p>
            {doctor.user.phone && (
              <p className="text-xs text-muted-foreground">{doctor.user.phone}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold cursor-pointer"
              disabled={doctor.verified || verification.isPending}
              onClick={() => verification.requestApprove(doctor)}
            >
              <Check className="h-3.5 w-3.5" />
              Verify
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 text-xs font-semibold cursor-pointer"
              disabled={verification.isPending}
              onClick={() => verification.requestReject(doctor)}
            >
              <X className="h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
        </div>
      </div>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Professional profile</CardTitle>
          <CardDescription className="text-xs">
            Submitted registration details, as stored by the server.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="Designation" value={doctor.designation} />
          <InfoRow label="BMDC Number" value={doctor.bmdcNumber} />
          <InfoRow label="Experience" value={`${doctor.experienceYears} years`} />
          <InfoRow label="Consultation Fee" value={doctor.fee} />
          <InfoRow label="Hospital" value={doctor.hospitalAffiliation} />
          <InfoRow label="Clinic Address" value={doctor.clinicAddress} />
          <InfoRow label="Public Slug" value={doctor.slug} />
          <InfoRow label="Rating" value={`${doctor.rating} (${doctor.totalReviews} reviews)`} />
          <InfoRow label="Bookings" value={doctor._count.bookings} />
          <InfoRow
            label="Verified By"
            value={doctor.verifiedBy?.name ?? doctor.verifiedBy?.email}
          />
          <InfoRow
            label="Verified At"
            value={doctor.verifiedAt ? new Date(doctor.verifiedAt).toLocaleString() : null}
          />
          <InfoRow
            label="Registered"
            value={new Date(doctor.createdAt).toLocaleDateString()}
          />
        </CardContent>
      </Card>

      <Card className="border border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Specialties</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5">
          {doctor.specialties.length > 0 ? (
            doctor.specialties.map((link) => (
              <Badge key={link.specialtyId} variant="secondary" className="text-[10px] font-semibold shadow-none">
                {link.specialty.name}
                {link.isPrimary ? " · primary" : ""}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No specialties assigned.</span>
          )}
        </CardContent>
      </Card>

      {doctor.bio && (
        <Card className="border border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Biography</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{doctor.bio}</p>
          </CardContent>
        </Card>
      )}

      <Card className="border border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold">Verification documents</CardTitle>
          <CardDescription className="text-xs">
            Approve or reject each document individually.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {doctor.documents.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              This doctor has not uploaded any documents.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctor.documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="text-xs font-semibold text-foreground">
                      <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        {document.docType}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <DocumentStatusBadge status={document.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(document.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-semibold cursor-pointer"
                          disabled={document.status === "APPROVED" || documentStatus.isPending}
                          onClick={() => setDocumentStatus(document, "APPROVED")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 text-xs font-semibold cursor-pointer"
                          disabled={document.status === "REJECTED" || documentStatus.isPending}
                          onClick={() => setDocumentStatus(document, "REJECTED")}
                        >
                          Reject
                        </Button>
                      </div>
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
          <CardTitle className="text-base font-bold">Availability</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {doctor.availability.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted-foreground">
              No availability configured.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Slot length</TableHead>
                  <TableHead>Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctor.availability.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {slot.dayOfWeek}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {slot.startTime} – {slot.endTime}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {slot.consultationDuration} min
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {slot.isActive ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
              ? "They will be marked verified and all pending documents approved."
              : "They will be marked unverified and their documents rejected."
            : undefined
        }
        confirmLabel={isApprove ? "Approve" : "Reject"}
        destructive={!isApprove}
        isPending={verification.isPending}
        onConfirm={verification.confirm}
      />
    </div>
  );
};

export default DoctorDetails;
