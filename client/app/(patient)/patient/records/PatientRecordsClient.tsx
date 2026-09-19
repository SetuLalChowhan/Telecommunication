"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Upload,
  ExternalLink,
  Trash2,
  FileCheck2,
  Search,
  Loader2,
  Image as ImageIcon,
  User,
  Plus,
} from "lucide-react";
import PatientLayout from "@/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useMyMedicalReports,
  useDeleteMedicalReport,
} from "@/features/medical-reports/api/queries";
import { getReportFileUrl } from "@/features/medical-reports/api/client";
import { UploadReportModal } from "./UploadReportModal";

export function PatientRecordsClient() {
  const [activeTab, setActiveTab] = useState<"diagnostic" | "prescription" | "all">("diagnostic");

  const resolveDownloadFilename = (fileName: string, fileUrl: string) => {
    const isPdf =
      fileUrl.toLowerCase().endsWith(".pdf") ||
      fileName.toLowerCase().endsWith(".pdf");
    const urlExt = fileUrl.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/)?.[1]?.toLowerCase();
    const ext = isPdf ? "pdf" : urlExt || "pdf";

    if (!fileName.toLowerCase().endsWith(`.${ext}`)) {
      return `${fileName}.${ext}`;
    }
    return fileName;
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: reportsData, isLoading, isFetching } = useMyMedicalReports();
  const deleteMutation = useDeleteMedicalReport();

  const reports = reportsData?.data || [];

  // Filter by Tab and Search
  const filteredReports = reports.filter((r) => {
    const isPrescription = r.fileName.toLowerCase().includes("prescription");

    if (activeTab === "diagnostic" && isPrescription) return false;
    if (activeTab === "prescription" && !isPrescription) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.fileName.toLowerCase().includes(q);
      const matchDoctor = r.booking?.doctor?.user?.name
        ?.toLowerCase()
        .includes(q);
      return matchName || matchDoctor;
    }

    return true;
  });

  const diagnosticCount = reports.filter(
    (r) => !r.fileName.toLowerCase().includes("prescription")
  ).length;

  const prescriptionCount = reports.filter((r) =>
    r.fileName.toLowerCase().includes("prescription")
  ).length;

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId, {
        onSettled: () => setDeleteTargetId(null),
      });
    }
  };

  const isDeleting = deleteMutation.isPending;

  return (
    <PatientLayout>
      <div className="w-full space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Medical Records & Prescriptions
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
              Manage your diagnostic test reports and physician digital prescriptions.
            </p>
          </div>

          <Button
            onClick={() => setUploadModalOpen(true)}
            size="sm"
            className="h-9 px-4 rounded-xl gap-1.5 text-xs font-semibold shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>

        {/* Tab Selection & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/60 self-start sm:self-auto overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("diagnostic")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "diagnostic"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-secondary-text hover:text-foreground"
              }`}
            >
              Diagnostic Reports ({diagnosticCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("prescription")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "prescription"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-secondary-text hover:text-foreground"
              }`}
            >
              Doctor Prescriptions ({prescriptionCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-secondary-text hover:text-foreground"
              }`}
            >
              All Records ({reports.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search by name or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-xs rounded-xl pl-8"
            />
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Syncing Indicator */}
        {isFetching && (
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Updating list...</span>
          </div>
        )}

        {/* Humanized Table Container */}
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
          {isLoading && reports.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
              <p className="text-xs text-secondary-text">Loading documents...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {searchQuery
                    ? "No matching documents found"
                    : activeTab === "prescription"
                    ? "No Prescriptions on File"
                    : "No Medical Reports Uploaded"}
                </h3>
                <p className="text-xs text-secondary-text max-w-sm mx-auto mt-1">
                  {searchQuery
                    ? "Try adjusting your search terms."
                    : activeTab === "prescription"
                    ? "Prescriptions issued by your consulting physicians will appear here."
                    : "Upload laboratory or imaging records to share with your doctors."}
                </p>
              </div>
              {activeTab !== "prescription" && (
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  size="sm"
                  className="h-8.5 px-3.5 rounded-lg text-xs font-semibold gap-1.5 mt-2"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload Document</span>
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-border/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-3 px-5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Document
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Category
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Consultation / Doctor
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Uploaded Date
                      </TableHead>
                      <TableHead className="py-3 px-5 text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/40">
                    {filteredReports.map((report) => {
                      const isPrescription =
                        report.fileName.toLowerCase().includes("prescription");
                      const isPdf =
                        report.fileUrl.toLowerCase().endsWith(".pdf") ||
                        report.fileName.toLowerCase().endsWith(".pdf");

                      const uploadDateFormatted = new Date(
                        report.uploadedAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      const docName = report.booking?.doctor?.user?.name;
                      const docSpecialty =
                        report.booking?.doctor?.specialties?.[0]?.specialty?.name;

                      return (
                        <TableRow
                          key={report.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                        >
                          {/* Document Name & Type */}
                          <TableCell className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                                  isPrescription
                                    ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                                    : isPdf
                                    ? "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                    : "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                                }`}
                              >
                                {isPrescription ? (
                                  <FileCheck2 className="h-4 w-4" />
                                ) : isPdf ? (
                                  <FileText className="h-4 w-4" />
                                ) : (
                                  <ImageIcon className="h-4 w-4" />
                                )}
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <p
                                  className="font-semibold text-foreground text-xs sm:text-sm truncate"
                                  title={report.fileName}
                                >
                                  {report.fileName}
                                </p>
                                <span className="text-[11px] text-muted-foreground uppercase font-mono font-medium">
                                  {isPdf ? "PDF Document" : "Image File"}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Category Badge */}
                          <TableCell className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                isPrescription
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-border/60"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isPrescription ? "bg-emerald-500" : "bg-primary"
                                }`}
                              />
                              {isPrescription ? "Prescription" : "Diagnostic Report"}
                            </span>
                          </TableCell>

                          {/* Consultation / Doctor */}
                          <TableCell className="py-3.5 px-4 text-xs">
                            {docName ? (
                              <div>
                                <p className="font-semibold text-foreground">
                                  {docName}
                                </p>
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {docSpecialty || "Consultation"}
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                General Record
                              </span>
                            )}
                          </TableCell>

                          {/* Upload Date */}
                          <TableCell className="py-3.5 px-4 text-xs text-secondary-text font-medium">
                            {uploadDateFormatted}
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    getReportFileUrl(report.id, "view"),
                                    "_blank"
                                  )
                                }
                                className="h-7.5 px-2.5 rounded-lg text-xs font-medium gap-1 hover:border-primary hover:text-primary"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span>View</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const a = document.createElement("a");
                                  a.href = getReportFileUrl(report.id, "download");
                                  a.download = resolveDownloadFilename(report.fileName, report.fileUrl);
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                }}
                                className="h-7.5 w-7.5 rounded-lg text-muted-foreground hover:text-foreground"
                                title="Download"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteTargetId(report.id)}
                                className="h-7.5 w-7.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-border/40">
                {filteredReports.map((report) => {
                  const isPrescription =
                    report.fileName.toLowerCase().includes("prescription");
                  const uploadDateFormatted = new Date(
                    report.uploadedAt
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const docName = report.booking?.doctor?.user?.name;

                  return (
                    <div key={report.id} className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isPrescription
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-rose-100 text-rose-600"
                            }`}
                          >
                            {isPrescription ? (
                              <FileCheck2 className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-foreground truncate">
                              {report.fileName}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {uploadDateFormatted} {docName && `&bull; ${docName}`}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isPrescription
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {isPrescription ? "Prescription" : "Report"}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              getReportFileUrl(report.id, "view"),
                              "_blank"
                            )
                          }
                          className="h-7 px-2 text-[11px] font-medium gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = getReportFileUrl(report.id, "download");
                            a.download = resolveDownloadFilename(report.fileName, report.fileUrl);
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                          className="h-7 w-7 rounded-lg text-muted-foreground"
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTargetId(report.id)}
                          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Alert */}
        <AlertDialog
          open={Boolean(deleteTargetId)}
          onOpenChange={(open) => !open && setDeleteTargetId(null)}
        >
          <AlertDialogContent className="p-5 rounded-2xl border-border bg-card max-w-[400px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-sm font-bold text-foreground">
                Delete Document?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground">
                Are you sure you want to remove this document? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-2 gap-2">
              <AlertDialogCancel
                disabled={isDeleting}
                className="h-8 px-3 rounded-lg text-xs font-medium"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="h-8 px-3.5 rounded-lg text-xs font-semibold bg-destructive hover:bg-destructive/90 text-white"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Minimal Upload Modal */}
        <UploadReportModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
        />
      </div>
    </PatientLayout>
  );
}
