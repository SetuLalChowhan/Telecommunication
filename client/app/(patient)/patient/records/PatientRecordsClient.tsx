"use client";

import React, { useState } from "react";
import { Loader2, FileText, Download, Trash2, ExternalLink, Plus } from "lucide-react";
import {
  useMyMedicalReports,
  useDeleteMedicalReport,
} from "@/features/medical-reports/api/queries";
import { RecordsHeader } from "@/features/medical-reports/components/records/RecordsHeader";
import { RecordsFilterTabs } from "@/features/medical-reports/components/records/RecordsFilterTabs";
import { RecordDeleteConfirmDialog } from "@/features/medical-reports/components/records/RecordDeleteConfirmDialog";
import { UploadReportModal } from "./UploadReportModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function PatientRecordsClient() {
  const [activeTab, setActiveTab] = useState<"diagnostic" | "prescription" | "all">("diagnostic");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: reportsData, isLoading } = useMyMedicalReports();
  const deleteMutation = useDeleteMedicalReport();

  const reports = reportsData?.data || [];

  const filteredReports = reports.filter((r) => {
    const isPrescription = r.fileName.toLowerCase().includes("prescription");
    if (activeTab === "diagnostic" && isPrescription) return false;
    if (activeTab === "prescription" && !isPrescription) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = r.fileName.toLowerCase().includes(q);
      const matchDoctor = r.booking?.doctor?.user?.name?.toLowerCase().includes(q);
      return matchName || matchDoctor;
    }

    return true;
  });

  const diagnosticCount = reports.filter((r) => !r.fileName.toLowerCase().includes("prescription")).length;
  const prescriptionCount = reports.filter((r) => r.fileName.toLowerCase().includes("prescription")).length;

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteMutation.mutate(deleteTargetId, {
        onSettled: () => setDeleteTargetId(null),
      });
    }
  };

  return (
    <div className="w-full space-y-5">
      <RecordsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onUploadClick={() => setUploadModalOpen(true)}
      />

      <RecordsFilterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        diagnosticCount={diagnosticCount}
        prescriptionCount={prescriptionCount}
        totalCount={reports.length}
      />

      {/* Main Clean Minimal Shadcn Table */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
        {isLoading && reports.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-11 w-11 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground mb-3">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No documents found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {searchQuery
                ? "No documents match your search query."
                : "You have not uploaded any documents in this category yet."}
            </p>
            <Button
              size="sm"
              onClick={() => setUploadModalOpen(true)}
              className="mt-4 h-8.5 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Upload Document</span>
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-border/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="py-2.5 px-5 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Document Title
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Category
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Uploaded Date
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Associated Doctor
                    </TableHead>
                    <TableHead className="py-2.5 px-5 text-right font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/40">
                  {filteredReports.map((report) => {
                    const isPrescription = report.fileName.toLowerCase().includes("prescription");
                    const dateFormatted = new Date(report.uploadedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const doctorName = report.booking?.doctor?.user?.name || "Self-Uploaded";

                    return (
                      <TableRow
                        key={report.id}
                        className="hover:bg-muted/40 transition-colors group"
                      >
                        {/* Title & File icon */}
                        <TableCell className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="h-8.5 w-8.5 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                                {report.fileName}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                Medical Record
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Category badge */}
                        <TableCell className="py-3 px-4">
                          <span
                            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
                              isPrescription
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            }`}
                          >
                            {isPrescription ? "Prescription" : "Diagnostic"}
                          </span>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="py-3 px-4 text-xs font-medium text-foreground">
                          {dateFormatted}
                        </TableCell>

                        {/* Associated Doctor */}
                        <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                          {doctorName}
                        </TableCell>

                        {/* Action Buttons */}
                        <TableCell className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {report.fileUrl && (
                              <a
                                href={report.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7.5 px-2.5 rounded-lg text-xs font-medium gap-1 border-border/80 hover:border-primary/50"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>View</span>
                                </Button>
                              </a>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTargetId(report.id)}
                              className="h-7.5 w-7.5 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Delete report"
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

            {/* Mobile Compact View */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredReports.map((report) => {
                const isPrescription = report.fileName.toLowerCase().includes("prescription");
                const dateFormatted = new Date(report.uploadedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div key={report.id} className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-semibold text-foreground truncate">
                          {report.fileName}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase shrink-0 ${
                          isPrescription
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        }`}
                      >
                        {isPrescription ? "Prescription" : "Diagnostic"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                      <span className="text-[11px]">{dateFormatted}</span>
                      <div className="flex items-center gap-1.5">
                        {report.fileUrl && (
                          <a
                            href={report.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 px-2.5 rounded-lg text-xs font-medium border-border"
                            >
                              View
                            </Button>
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTargetId(report.id)}
                          className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <RecordDeleteConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
      />

      <UploadReportModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
      />
    </div>
  );
}

export default PatientRecordsClient;
