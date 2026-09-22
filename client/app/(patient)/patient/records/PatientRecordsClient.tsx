"use client";

import React, { useMemo, useState } from "react";
import { FileText, ImageIcon, Plus, SearchX } from "lucide-react";
import {
  useMyMedicalReports,
  useDeleteMedicalReport,
} from "@/features/medical-reports/api/queries";
import { MedicalReport } from "@/features/medical-reports/types";
import {
  formatRecordDate,
  getConsultationSummary,
  getFileKind,
  getRecordCategory,
  getRecordCategoryLabel,
} from "@/features/medical-reports/utils/record-meta";
import { RecordsHeader } from "@/features/medical-reports/components/records/RecordsHeader";
import {
  RecordsFilterTabs,
  RecordsCategoryFilter,
} from "@/features/medical-reports/components/records/RecordsFilterTabs";
import { RecordItemCard } from "@/features/medical-reports/components/records/RecordItemCard";
import { RecordActions } from "@/features/medical-reports/components/records/RecordActions";
import { RecordDetailsDialog } from "@/features/medical-reports/components/records/RecordDetailsDialog";
import { RecordDeleteConfirmDialog } from "@/features/medical-reports/components/records/RecordDeleteConfirmDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadReportModal } from "./UploadReportModal";

/**
 * Type and search are applied on the client, so a single wide page is fetched
 * instead of the API default of 10 (which silently hid older documents).
 */
const REPORTS_LIMIT = 100;

function CategoryBadge({ report }: { report: MedicalReport }) {
  const category = getRecordCategory(report);
  return (
    <Badge
      variant="outline"
      className={`rounded-md font-medium ${
        category === "prescription"
          ? "border-secondary/20 bg-secondary/10 text-secondary"
          : "border-primary/20 bg-primary/10 text-primary"
      }`}
    >
      {category === "prescription" ? "Prescription" : "Diagnostic"}
    </Badge>
  );
}

function DocumentIcon({ report }: { report: MedicalReport }) {
  const category = getRecordCategory(report);
  const kind = getFileKind(report.fileName);

  return (
    <span
      className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
        category === "prescription"
          ? "bg-secondary/10 text-secondary"
          : "bg-primary/10 text-primary"
      }`}
    >
      {kind.isImage ? (
        <ImageIcon className="h-4 w-4" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
    </span>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-secondary-text">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function ListSkeleton() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Consultation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3.5 w-40" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3.5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3.5 w-36" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-border md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-3 w-52" />
            <div className="flex gap-1.5">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function PatientRecordsClient() {
  const [activeTab, setActiveTab] = useState<RecordsCategoryFilter>("diagnostic");
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [detailsReport, setDetailsReport] = useState<MedicalReport | null>(null);

  const { data: reportsData, isLoading } = useMyMedicalReports({
    limit: REPORTS_LIMIT,
  });
  const deleteMutation = useDeleteMedicalReport();

  const reports = reportsData?.data || [];

  const { diagnosticCount, prescriptionCount } = useMemo(() => {
    const prescriptions = reports.filter(
      (r) => getRecordCategory(r) === "prescription"
    ).length;
    return {
      diagnosticCount: reports.length - prescriptions,
      prescriptionCount: prescriptions,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return reports.filter((report) => {
      const category = getRecordCategory(report);
      if (activeTab === "diagnostic" && category !== "diagnostic") return false;
      if (activeTab === "prescription" && category !== "prescription") return false;
      if (!query) return true;

      return (
        report.fileName.toLowerCase().includes(query) ||
        getConsultationSummary(report).toLowerCase().includes(query) ||
        getRecordCategoryLabel(report).toLowerCase().includes(query)
      );
    });
  }, [reports, activeTab, searchQuery]);

  const deleteTarget = reports.find((r) => r.id === deleteTargetId) || null;
  const hasAnyDocuments = reports.length > 0;
  const isFiltered = searchQuery.trim().length > 0 || activeTab !== "all";

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId, {
      onSettled: () => setDeleteTargetId(null),
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveTab("all");
  };

  const showSkeleton = isLoading && !hasAnyDocuments;

  return (
    <div className="w-full space-y-4 sm:space-y-5">
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

      <Card className="overflow-hidden">
        {showSkeleton ? (
          <ListSkeleton />
        ) : filteredReports.length === 0 ? (
          hasAnyDocuments ? (
            <EmptyState
              icon={<SearchX className="h-5 w-5" />}
              title="No documents match your filters"
              description={
                searchQuery.trim()
                  ? `Nothing matches “${searchQuery.trim()}” in this category. Try a different term or clear the filters.`
                  : "There are no documents in this category yet."
              }
              action={
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={<FileText className="h-5 w-5" />}
              title="No medical documents yet"
              description="Upload lab results, scans or prescriptions to keep your clinical history in one place. Documents you upload stay private to you and the doctors you share them with."
              action={
                <Button
                  size="sm"
                  onClick={() => setUploadModalOpen(true)}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Upload document</span>
                </Button>
              }
            />
          )
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Consultation</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="max-w-[320px]">
                        <div className="flex items-center gap-3">
                          <DocumentIcon report={report} />
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setDetailsReport(report)}
                              className="block max-w-full truncate text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                              title={report.fileName}
                            >
                              {report.fileName}
                            </button>
                            <span className="block text-xs text-secondary-text">
                              {getFileKind(report.fileName).label}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <CategoryBadge report={report} />
                      </TableCell>

                      <TableCell className="text-sm text-secondary-text whitespace-nowrap">
                        {formatRecordDate(report.uploadedAt)}
                      </TableCell>

                      <TableCell className="text-sm text-secondary-text">
                        <span className="block max-w-[220px] truncate" title={getConsultationSummary(report)}>
                          {getConsultationSummary(report)}
                        </span>
                      </TableCell>

                      <TableCell>
                        <RecordActions
                          report={report}
                          onDeleteClick={setDeleteTargetId}
                          compact
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile list */}
            <div className="divide-y divide-border md:hidden">
              {filteredReports.map((report) => (
                <RecordItemCard
                  key={report.id}
                  report={report}
                  onDeleteClick={setDeleteTargetId}
                  onOpenDetails={setDetailsReport}
                />
              ))}
            </div>
          </>
        )}
      </Card>

      <RecordDetailsDialog
        report={detailsReport}
        onOpenChange={(open) => !open && setDetailsReport(null)}
        onDeleteClick={setDeleteTargetId}
      />

      <RecordDeleteConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        isDeleting={deleteMutation.isPending}
        fileName={deleteTarget?.fileName}
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
