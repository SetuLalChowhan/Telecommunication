"use client";

import React from "react";
import { FileText, ImageIcon } from "lucide-react";
import { MedicalReport } from "@/features/medical-reports/types";
import { RecordActions } from "./RecordActions";
import {
  formatRecordDate,
  getConsultationSummary,
  getFileKind,
  getRecordCategory,
  getRecordCategoryLabel,
} from "@/features/medical-reports/utils/record-meta";

interface RecordItemCardProps {
  report: MedicalReport;
  onDeleteClick: (id: string) => void;
  onOpenDetails: (report: MedicalReport) => void;
}

/**
 * Dense document row used on small screens, where a table would force
 * horizontal scrolling.
 */
export function RecordItemCard({
  report,
  onDeleteClick,
  onOpenDetails,
}: RecordItemCardProps) {
  const category = getRecordCategory(report);
  const kind = getFileKind(report.fileName);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpenDetails(report)}
          className="flex items-start gap-3 min-w-0 text-left cursor-pointer group"
        >
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
          <span className="min-w-0">
            <span className="block text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {report.fileName}
            </span>
            <span className="block text-xs text-secondary-text mt-0.5">
              {kind.label} · {getRecordCategoryLabel(report)}
            </span>
          </span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-secondary-text">
        <span>{formatRecordDate(report.uploadedAt)}</span>
        <span aria-hidden="true">·</span>
        <span className="truncate">{getConsultationSummary(report)}</span>
      </div>

      <RecordActions
        report={report}
        onDeleteClick={onDeleteClick}
        className="justify-start"
      />
    </div>
  );
}

export default RecordItemCard;
