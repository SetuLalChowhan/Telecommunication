"use client";

import React, { useState } from "react";
import { Loader2, FileText } from "lucide-react";
import {
  useMyMedicalReports,
  useDeleteMedicalReport,
} from "@/features/medical-reports/api/queries";
import { RecordsHeader } from "@/features/medical-reports/components/records/RecordsHeader";
import { RecordsFilterTabs } from "@/features/medical-reports/components/records/RecordsFilterTabs";
import { RecordItemCard } from "@/features/medical-reports/components/records/RecordItemCard";
import { RecordDeleteConfirmDialog } from "@/features/medical-reports/components/records/RecordDeleteConfirmDialog";
import { UploadReportModal } from "./UploadReportModal";

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
    <div className="max-w-5xl mx-auto space-y-6">
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-card border border-border">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No documents found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {searchQuery
              ? "No files match your search query. Try adjusting your search term."
              : "You have not uploaded any documents in this category yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <RecordItemCard
              key={report.id}
              report={report}
              onDeleteClick={(id) => setDeleteTargetId(id)}
            />
          ))}
        </div>
      )}

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
