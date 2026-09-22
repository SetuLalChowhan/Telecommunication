"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Download,
  ExternalLink,
  FileQuestion,
  FileText,
  ImageIcon,
  Loader2,
  Stethoscope,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getReportFileUrl } from "@/features/medical-reports/api/client";
import { MedicalReport } from "@/features/medical-reports/types";
import {
  formatBookingStatus,
  formatRecordDate,
  getFileKind,
  getRecordCategory,
  getRelatedConsultation,
  RecordFileKind,
} from "@/features/medical-reports/utils/record-meta";

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-2.5 border-b border-border/50 last:border-0">
      <dt className="text-xs text-secondary-text">{label}</dt>
      <dd className="text-sm text-foreground min-w-0 break-words">{children}</dd>
    </div>
  );
}

function PreviewUnavailable({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 gap-2 py-10">
      <FileQuestion className="h-7 w-7 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-secondary-text max-w-xs">{description}</p>
    </div>
  );
}

function NoPreviewPanel({ kind }: { kind: RecordFileKind }) {
  return (
    <div className="h-[180px] rounded-lg border border-dashed border-border bg-card flex flex-col items-center justify-center text-center px-6 gap-2">
      <ImageIcon className="h-7 w-7 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">
        In-app preview isn&apos;t available
      </p>
      <p className="text-xs text-secondary-text max-w-xs">
        {kind.label}s open in a new tab or download directly.
      </p>
    </div>
  );
}

/**
 * Renders the document inline. Mount with `key={report.id}` so switching
 * documents resets the loading state without a state-syncing effect.
 *
 * PDFs are fetched and shown from a same-origin blob URL: the API sends
 * `X-Frame-Options: SAMEORIGIN` (helmet), which blocks framing the file
 * endpoint directly from another origin.
 */
function DocumentPreview({ report }: { report: MedicalReport }) {
  const kind = getFileKind(report.fileName);
  const viewUrl = getReportFileUrl(report.id, "view");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!kind.isPdf) return;

    let cancelled = false;
    let createdUrl: string | null = null;

    const load = async () => {
      try {
        const response = await fetch(viewUrl);
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const blob = await response.blob();
        if (cancelled) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [viewUrl, kind.isPdf]);

  if (!kind.canPreview) {
    return <NoPreviewPanel kind={kind} />;
  }

  const hasFailed = status === "error";

  return (
    <div className="relative h-[280px] sm:h-[360px] rounded-lg border border-border bg-card overflow-hidden">
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="sr-only">Loading preview</span>
        </div>
      )}

      {hasFailed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <PreviewUnavailable
            title="Preview unavailable"
            description="This document could not be rendered here. Open it in a new tab or download it instead."
          />
        </div>
      )}

      {!hasFailed && kind.isPdf && blobUrl && (
        <iframe src={blobUrl} title={report.fileName} className="h-full w-full" />
      )}

      {!hasFailed && kind.isImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={viewUrl}
          alt={report.fileName}
          className="h-full w-full object-contain"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
        />
      )}
    </div>
  );
}

interface RecordDetailsDialogProps {
  report: MedicalReport | null;
  onOpenChange: (open: boolean) => void;
  onDeleteClick: (id: string) => void;
}

export function RecordDetailsDialog({
  report,
  onOpenChange,
  onDeleteClick,
}: RecordDetailsDialogProps) {
  if (!report) return null;

  const category = getRecordCategory(report);
  const related = getRelatedConsultation(report);
  const kind = getFileKind(report.fileName);
  const viewUrl = getReportFileUrl(report.id, "view");
  const downloadUrl = getReportFileUrl(report.id, "download");

  const handleDelete = () => {
    onDeleteClick(report.id);
    onOpenChange(false);
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span
              className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                category === "prescription"
                  ? "bg-secondary/10 text-secondary"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-sm font-semibold leading-snug break-words">
                {report.fileName}
              </DialogTitle>
              <DialogDescription>
                {kind.label} · Uploaded {formatRecordDate(report.uploadedAt)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="p-0">
          <div className="bg-muted/30 px-5 py-4">
            <DocumentPreview key={report.id} report={report} />
          </div>

          <div className="border-t border-border px-5 py-4">
          <dl>
            <DetailRow label="Category">
              <Badge
                variant="outline"
                className={`rounded-md font-medium ${
                  category === "prescription"
                    ? "border-secondary/20 bg-secondary/10 text-secondary"
                    : "border-primary/20 bg-primary/10 text-primary"
                }`}
              >
                {category === "prescription" ? "Prescription" : "Diagnostic report"}
              </Badge>
            </DetailRow>

            <DetailRow label="File type">{kind.label}</DetailRow>

            <DetailRow label="Uploaded">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                {formatRecordDate(report.uploadedAt)}
              </span>
            </DetailRow>

            <DetailRow label="Consultation">
              {related ? (
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Stethoscope className="h-3.5 w-3.5 text-primary" />
                    {related.doctorName}
                  </span>
                  {(related.specialty || related.designation) && (
                    <p className="text-xs text-secondary-text">
                      {[related.specialty, related.designation]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  {related.hospital && (
                    <p className="text-xs text-secondary-text">{related.hospital}</p>
                  )}
                  {related.slotStart && (
                    <p className="text-xs text-secondary-text">
                      {formatRecordDate(related.slotStart)}
                      {related.status
                        ? ` · ${formatBookingStatus(related.status)}`
                        : ""}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-secondary-text">
                  Not linked to a consultation — uploaded by you
                </span>
              )}
            </DetailRow>
            </dl>
          </div>
        </DialogBody>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 gap-1.5 rounded-md px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold"
            >
              <a href={viewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open in new tab</span>
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold"
            >
              <a href={downloadUrl} download>
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecordDetailsDialog;
