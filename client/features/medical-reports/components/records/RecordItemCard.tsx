"use client";

import React from "react";
import { FileText, Download, ExternalLink, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReportFileUrl } from "@/features/medical-reports/api/client";

interface RecordItemCardProps {
  report: {
    id: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
    booking?: {
      slotStart?: string;
      doctor?: {
        user?: { name?: string | null };
        designation?: string | null;
      };
    } | null;
  };
  onDeleteClick: (id: string) => void;
}

export const RecordItemCard: React.FC<RecordItemCardProps> = ({
  report,
  onDeleteClick,
}) => {
  const isPrescription = report.fileName.toLowerCase().includes("prescription");
  const streamViewUrl = getReportFileUrl(report.id, "view");
  const streamDownloadUrl = getReportFileUrl(report.id, "download");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/30 transition-all gap-4 shadow-xs">
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
            isPrescription ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
          }`}
        >
          <FileText className="h-5 w-5" />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-foreground truncate max-w-[280px] sm:max-w-md">
              {report.fileName}
            </h4>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isPrescription
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-primary/10 text-primary border border-primary/20"
              }`}
            >
              {isPrescription ? "Prescription" : "Report"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Uploaded: {new Date(report.uploadedAt).toLocaleDateString()}</span>
            {report.booking?.doctor?.user?.name && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <User className="h-3 w-3 text-primary" />
                {report.booking.doctor.user.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <a
          href={streamViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <Button variant="outline" size="sm" className="h-8.5 px-3 rounded-xl gap-1 text-xs">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View</span>
          </Button>
        </a>

        <a href={streamDownloadUrl} download className="inline-flex">
          <Button variant="outline" size="sm" className="h-8.5 px-3 rounded-xl gap-1 text-xs">
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </Button>
        </a>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteClick(report.id)}
          className="h-8.5 w-8.5 text-destructive hover:bg-destructive/10 rounded-xl"
          aria-label="Delete report"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
