"use client";

import React, { useState, useRef } from "react";
import {
  ShieldCheck,
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  ExternalLink,
  AlertCircle,
  FileCheck,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { uploadDoctorDocument } from "@/features/doctors/api/client";
import { compressImageIfNeeded } from "@/lib/utils/image-compression";
import type { DoctorDocument } from "@/features/doctors/types";

interface DocumentSlotDef {
  type: "LICENSE" | "DEGREE_CERTIFICATE" | "NATIONAL_ID" | "OTHER";
  title: string;
  description: string;
  required: boolean;
}

const DOCUMENT_SLOTS: DocumentSlotDef[] = [
  {
    type: "LICENSE",
    title: "Medical License (BMDC Registration)",
    description: "Official certificate issued by Bangladesh Medical and Dental Council (BMDC).",
    required: true,
  },
  {
    type: "DEGREE_CERTIFICATE",
    title: "Degree Certificate (MBBS / MD / Spec.)",
    description: "Original MBBS graduation diploma or postgraduate specialist qualification.",
    required: true,
  },
  {
    type: "NATIONAL_ID",
    title: "National ID / Passport",
    description: "Government-issued National ID (NID) smart card or valid passport.",
    required: true,
  },
  {
    type: "OTHER",
    title: "Other Credentials / Certifications",
    description: "Fellowships, hospital appointment letters, or additional specialization diplomas.",
    required: false,
  },
];

interface DoctorDocumentsTabProps {
  documents: DoctorDocument[];
  isVerified: boolean;
  onRefresh: () => void;
}

export const DoctorDocumentsTab: React.FC<DoctorDocumentsTabProps> = ({
  documents,
  isVerified,
  onRefresh,
}) => {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [activeSlotType, setActiveSlotType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Map uploaded documents by docType
  const docsByType = React.useMemo(() => {
    const map = new Map<string, DoctorDocument>();
    for (const doc of documents) {
      const typeKey = (doc as any).docType || doc.type;
      if (typeKey && !map.has(typeKey)) {
        map.set(typeKey, doc);
      }
    }
    return map;
  }, [documents]);

  const uploadedCount = docsByType.size;

  const handleTriggerUpload = (type: string) => {
    setActiveSlotType(type);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSlotType) return;

    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
      : "";
    if (
      !allowedExtensions.includes(ext) &&
      !file.type.match(/^image\/(jpeg|png)|application\/pdf$/)
    ) {
      toast.error("Invalid file format. Allowed formats: PDF, JPG, PNG.");
      return;
    }

    const isPdf = file.type === "application/pdf" || ext === ".pdf";
    if (isPdf && file.size > 4 * 1024 * 1024) {
      toast.error(
        `PDF document is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Server upload limit is 4MB.`
      );
      return;
    }

    setSelectedFile(file);
    executeUpload(activeSlotType, file);
  };

  const executeUpload = async (docType: string, file: File) => {
    setUploadingType(docType);
    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");

    try {
      let uploadFile = file;
      if (!isPdf && file.type.startsWith("image/")) {
        try {
          uploadFile = await compressImageIfNeeded(file);
        } catch (e) {
          console.warn("Image compression skipped:", e);
        }
      }

      if (uploadFile.size > 4.2 * 1024 * 1024) {
        toast.error(
          `File is too large (${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed upload size is 4MB.`
        );
        return;
      }

      const data = new FormData();
      data.append("file", uploadFile);
      data.append("docType", docType);

      await uploadDoctorDocument(data);

      const slot = DOCUMENT_SLOTS.find((s) => s.type === docType);
      toast.success(
        `${slot?.title || "Document"} uploaded successfully (previous version replaced)`
      );
      onRefresh();
    } catch (err: any) {
      const errorMsg =
        err?.status === 413
          ? "File is too large for the server (limit: 4MB)."
          : err?.response?.data?.message || err?.message || "Failed to upload document";
      toast.error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    } finally {
      setUploadingType(null);
      setActiveSlotType(null);
      setSelectedFile(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Panel */}
      <div className="panel space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                Practicing License & Official Verification
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload your medical credentials across the 4 verified categories. Maximum 4 documents total.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {isVerified ? (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified Practitioner
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Clock className="h-3.5 w-3.5" />
                Verification In Progress
              </span>
            )}
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
              {uploadedCount} of 4 Complete
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground border-t border-border/80 pt-3 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>
            Uploading a new document for any category automatically replaces the previous version and removes the old file from secure storage.
          </span>
        </p>
      </div>

      {/* 4 Fixed Document Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOCUMENT_SLOTS.map((slot) => {
          const uploadedDoc = docsByType.get(slot.type);
          const isSlotUploading = uploadingType === slot.type;
          const status = uploadedDoc?.status;

          return (
            <div
              key={slot.type}
              className={`panel p-4 flex flex-col justify-between transition-all rounded-2xl border ${
                uploadedDoc
                  ? status === "APPROVED"
                    ? "border-emerald-500/30 bg-card shadow-xs"
                    : status === "REJECTED"
                    ? "border-red-500/30 bg-card shadow-xs"
                    : "border-border/90 bg-card shadow-xs"
                  : "border-dashed border-border/80 bg-muted/20"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        uploadedDoc
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {uploadedDoc ? (
                        <FileCheck className="h-4.5 w-4.5" />
                      ) : (
                        <FileText className="h-4.5 w-4.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                          {slot.title}
                        </h4>
                        {slot.required && (
                          <span className="text-[10px] font-bold text-destructive">
                            *Required
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                        {slot.description}
                      </p>
                    </div>
                  </div>

                  {uploadedDoc && (
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full font-bold text-[10px] tracking-wide border ${
                        status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                          : status === "REJECTED"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                      }`}
                    >
                      {status}
                    </span>
                  )}
                </div>

                {uploadedDoc && (
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-muted/40 rounded-xl px-3 py-2 border border-border/60">
                    <span className="truncate">
                      Uploaded on {new Date(uploadedDoc.uploadedAt).toLocaleDateString()}
                    </span>
                    {uploadedDoc.fileUrl && (
                      <a
                        href={uploadedDoc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline shrink-0 ml-2"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground font-mono">
                  PDF, JPG, PNG • Max 4 MB
                </span>

                <Button
                  type="button"
                  size="sm"
                  disabled={isSlotUploading}
                  onClick={() => handleTriggerUpload(slot.type)}
                  className={`h-9 px-3.5 rounded-xl font-semibold text-xs gap-1.5 cursor-pointer ${
                    uploadedDoc
                      ? "bg-muted hover:bg-muted/80 text-foreground border border-border shadow-xs"
                      : "bg-primary hover:bg-primary-dark text-white shadow-xs"
                  }`}
                >
                  {isSlotUploading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>{uploadedDoc ? "Replace Document" : "Upload Document"}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorDocumentsTab;
