"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  Droplet,
  ShieldAlert,
  Calendar,
  FileText,
  Eye,
  Download,
  Loader2,
  FileCheck2,
} from "lucide-react";
import { DoctorPatientRegistryItem } from "@/features/doctors/types";
import { MedicalReport } from "@/features/medical-reports/types";
import { usePatientMedicalReports } from "@/features/medical-reports/api/queries";
import { fetchReportBlob, getReportFileUrl } from "@/features/medical-reports/api/client";
import { RecordDetailsDialog } from "@/features/medical-reports/components/records/RecordDetailsDialog";
import { formatRecordDate, getFileKind } from "@/features/medical-reports/utils/record-meta";

interface DoctorPatientDetailDialogProps {
  patient: DoctorPatientRegistryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatBloodGroup = (value: string) =>
  value
    .replace("_POSITIVE", "+")
    .replace("_NEGATIVE", "-")
    .replace("_", " ");

export const DoctorPatientDetailDialog: React.FC<DoctorPatientDetailDialogProps> = ({
  patient,
  open,
  onOpenChange,
}) => {
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: queriedReports, isLoading: isLoadingReports } = usePatientMedicalReports(
    open && patient ? patient.patientId : null
  );

  if (!patient) return null;

  // Prefer fetched reports from API, fallback to reports from patient object
  const reports: MedicalReport[] = queriedReports || patient.medicalReports || [];

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const handleDownload = async (report: MedicalReport, e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingId(report.id);
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
      setDownloadingId(null);
    }
  };

  const stats = [
    {
      label: "Consultations",
      value: patient.consultationCount ?? 0,
      icon: Calendar,
    },
    {
      label: "Medical records",
      value: reports.length > 0 ? reports.length : (patient.reportsCount ?? 0),
      icon: FileText,
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[580px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 shrink-0 rounded-lg">
                <AvatarImage src={patient.image || undefined} alt={patient.name} />
                <AvatarFallback className="rounded-lg bg-muted text-sm font-semibold text-foreground">
                  {getInitials(patient.name || "P")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <DialogTitle className="truncate">{patient.name}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-1.5">
                  <span className="font-mono">
                    ID {patient.patientId.slice(-8)}
                  </span>
                  {patient.gender && (
                    <>
                      <span aria-hidden>·</span>
                      <span>{patient.gender}</span>
                    </>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogBody className="space-y-4">
            {/* Contact block */}
            <dl className="grid grid-cols-1 gap-x-4 gap-y-2.5 rounded-md border border-border bg-muted/40 p-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <dt className="shrink-0 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="sr-only">Phone</span>
                </dt>
                <dd className="truncate text-xs font-medium text-foreground">
                  {patient.phone || "No phone"}
                </dd>
              </div>

              <div className="flex items-center gap-2">
                <dt className="shrink-0 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="sr-only">Email</span>
                </dt>
                <dd className="truncate text-xs font-medium text-foreground">
                  {patient.email || "No email"}
                </dd>
              </div>

              {patient.bloodGroup && (
                <div className="flex items-center gap-2">
                  <dt className="shrink-0 text-muted-foreground">
                    <Droplet className="h-3.5 w-3.5" />
                    <span className="sr-only">Blood group</span>
                  </dt>
                  <dd className="text-xs font-medium text-foreground">
                    {formatBloodGroup(patient.bloodGroup)}
                  </dd>
                </div>
              )}

              {patient.address && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <dt className="shrink-0 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="sr-only">Address</span>
                  </dt>
                  <dd className="truncate text-xs font-medium text-foreground">
                    {patient.address}
                  </dd>
                </div>
              )}
            </dl>

            {patient.emergencyContactName && (
              <div className="space-y-1 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-200">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Emergency contact</span>
                </div>
                <p className="text-xs font-medium">
                  {patient.emergencyContactName}
                </p>
              </div>
            )}

            {/* Activity */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 rounded-md border border-border p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-sm font-semibold tabular-nums text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Medical Reports Section */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Patient Medical Reports
                  </h4>
                </div>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  {reports.length} report{reports.length === 1 ? "" : "s"}
                </span>
              </div>

              {isLoadingReports && reports.length === 0 ? (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-xs">Loading medical reports...</span>
                </div>
              ) : reports.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
                  <FileCheck2 className="mx-auto h-7 w-7 text-muted-foreground/60 mb-1.5" />
                  <p className="text-xs font-medium text-foreground">No medical reports found</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    This patient has not uploaded any medical reports or lab results yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {reports.map((report) => {
                    const kind = getFileKind(report.fileName);
                    const isDownloading = downloadingId === report.id;

                    return (
                      <div
                        key={report.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-2.5 transition-colors hover:bg-muted/40"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground truncate max-w-[220px] sm:max-w-[280px]">
                              {report.fileName || "Medical Document"}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Uploaded {formatRecordDate(report.uploadedAt)} · {kind.label}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReport(report)}
                            className="h-7 px-2.5 text-xs font-medium gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDownloading}
                            onClick={(e) => handleDownload(report, e)}
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Download report"
                          >
                            {isDownloading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>

      {/* Interactive Report View Dialog */}
      <RecordDetailsDialog
        report={selectedReport}
        onOpenChange={(isOpen) => !isOpen && setSelectedReport(null)}
      />
    </>
  );
};

export default DoctorPatientDetailDialog;
