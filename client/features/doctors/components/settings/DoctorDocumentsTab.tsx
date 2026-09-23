"use client";

import React, { useState, useRef } from "react";
import { ShieldCheck, FileCheck2, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { uploadDoctorDocument } from "@/features/doctors/api/client";

interface DoctorDocument {
  id: string;
  type: string;
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  uploadedAt: string;
}

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
  const [docType, setDocType] = useState("BMDC_CERTIFICATE");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) {
      toast.error("Please select a document file to upload");
      return;
    }

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", docFile);
      data.append("type", docType);

      await uploadDoctorDocument(data);

      toast.success("Document uploaded successfully for review");
      setDocFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="panel space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Practicing License & Verification</h3>
              <p className="text-xs text-muted-foreground">
                Upload your BMDC registration and medical degree certificates for official verification.
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isVerified
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}
          >
            {isVerified ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified Practitioner</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Pending Verification</span>
              </>
            )}
          </span>
        </div>

        <form onSubmit={handleUpload} className="pt-4 border-t border-border/60 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Document Type</Label>
              <Input
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                placeholder="e.g. BMDC_CERTIFICATE"
                className="h-10 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Document File (PDF/JPG/PNG)</Label>
              <Input
                ref={fileRef}
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                className="h-10 rounded-xl text-sm file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-primary/10 file:text-primary"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isUploading || !docFile}
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              <span>Upload Document</span>
            </Button>
          </div>
        </form>
      </div>

      {documents.length > 0 && (
        <div className="panel space-y-3 p-4">
          <h4 className="text-sm font-semibold text-foreground">Uploaded Documents</h4>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-semibold text-foreground truncate">{doc.type}</span>
                  <span className="text-muted-foreground">
                    Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                    doc.status === "APPROVED"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : doc.status === "REJECTED"
                      ? "bg-red-500/10 text-red-600"
                      : "bg-amber-500/10 text-amber-600"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
