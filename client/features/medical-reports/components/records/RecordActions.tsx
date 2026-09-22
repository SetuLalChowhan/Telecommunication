"use client";

import React from "react";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getReportFileUrl } from "@/features/medical-reports/api/client";
import { MedicalReport } from "@/features/medical-reports/types";

interface RecordActionsProps {
  report: MedicalReport;
  onDeleteClick: (id: string) => void;
  /** Icon-only buttons for dense rows. */
  compact?: boolean;
  className?: string;
}

/**
 * View / Download / Delete for a single document.
 *
 * Both links point at the API's file proxy (`/medical-reports/:id/file`) rather
 * than the raw storage URL: uploaded reports live behind signed access, so the
 * storage URL 404s when opened directly.
 */
export function RecordActions({
  report,
  onDeleteClick,
  compact = false,
  className,
}: RecordActionsProps) {
  const viewUrl = getReportFileUrl(report.id, "view");
  const downloadUrl = getReportFileUrl(report.id, "download");
  const sizeClasses = compact ? "h-8 w-8 p-0" : "h-8 gap-1.5 px-2.5";

  return (
    <div className={cn("flex items-center justify-end gap-1.5", className)}>
      <Button
        asChild
        variant="outline"
        size="sm"
        className={sizeClasses}
        title={`Open ${report.fileName} in a new tab`}
      >
        <a href={viewUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-3.5 w-3.5" />
          {compact ? <span className="sr-only">View document</span> : <span>View</span>}
        </a>
      </Button>

      <Button
        asChild
        variant="outline"
        size="sm"
        className={sizeClasses}
        title={`Download ${report.fileName}`}
      >
        <a href={downloadUrl} download>
          <Download className="h-3.5 w-3.5" />
          {compact ? <span className="sr-only">Download document</span> : <span>Download</span>}
        </a>
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onDeleteClick(report.id)}
        className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        title={`Delete ${report.fileName}`}
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span className="sr-only">Delete document</span>
      </Button>
    </div>
  );
}

export default RecordActions;
