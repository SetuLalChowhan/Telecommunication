"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Check, UploadCloud, ChevronRight, X, Loader2 } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import { useMutationClient } from "@/lib/api";
import { toast } from "react-toastify";

interface DocumentRequirement {
  type: "LICENSE" | "DEGREE_CERTIFICATE" | "NATIONAL_ID" | "OTHER";
  title: string;
  description: string;
  badge: "Required" | "Optional";
}

const REQUIRED_DOCUMENTS: DocumentRequirement[] = [
  {
    type: "LICENSE",
    title: "Medical License",
    description: "BMDC registration certificate",
    badge: "Required",
  },
  {
    type: "DEGREE_CERTIFICATE",
    title: "Degree Certificate",
    description: "MBBS, MD, or postgraduate qualification",
    badge: "Required",
  },
  {
    type: "NATIONAL_ID",
    title: "National ID or Passport",
    description: "Government-issued photo identification",
    badge: "Required",
  },
  {
    type: "OTHER",
    title: "Other Credentials",
    description: "Hospital appointment or specialized training",
    badge: "Optional",
  },
];

export default function DoctorVerificationPage() {
  const [uploadedDocs, setUploadedDocs] = useState<
    Record<string, { name: string; size: string }>
  >({});
  const [activeUploadType, setActiveUploadType] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // TanStack Mutation using unified useMutationClient
  const { mutateAsync: uploadDoc, isPending } = useMutationClient({
    url: "/doctors/me/documents",
    method: "post",
    isPrivate: true,
    successMessage: "Verification document uploaded successfully!",
  });

  const triggerFileSelect = (docType: string) => {
    setActiveUploadType(docType);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadType) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", activeUploadType);

    try {
      await uploadDoc({
        data: formData,
        config: {
          headers: { "Content-Type": "multipart/form-data" },
        },
      });

      setUploadedDocs((prev) => ({
        ...prev,
        [activeUploadType]: {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        },
      }));
    } catch {
      // Error handled automatically by useMutationClient toast
    } finally {
      setActiveUploadType(null);
    }
  };

  const removeDoc = (docType: string) => {
    setUploadedDocs((prev) => {
      const next = { ...prev };
      delete next[docType];
      return next;
    });
  };

  const requiredCount = REQUIRED_DOCUMENTS.filter(
    (d) => d.badge === "Required"
  ).length;
  const uploadedRequiredCount = REQUIRED_DOCUMENTS.filter(
    (d) => d.badge === "Required" && uploadedDocs[d.type]
  ).length;

  return (
    <main className="min-h-dvh w-full bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 antialiased selection:bg-accent selection:text-primary">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />

      {/* Top Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between pb-4 sm:pb-5 border-b border-slate-200/80">
        <BrandLogo iconSize={18} />
        <Link
          href="/dashboard"
          className="text-xs sm:text-sm font-medium text-secondary-text hover:text-foreground transition-colors inline-flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-slate-100"
        >
          <span>Skip to dashboard</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>
      </header>

      {/* Main Verification Card */}
      <div className="max-w-3xl w-full mx-auto my-auto py-4 sm:py-6 md:py-8">
        <div className="rounded-2xl bg-white p-5 sm:p-7 md:p-9 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.02)] border border-slate-200/80">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 mb-5 border-b border-slate-100">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Doctor Verification
              </h1>
              <p className="text-xs sm:text-sm text-secondary-text mt-1">
                Upload your medical credentials to verify your profile and start accepting consultations.
              </p>
            </div>

            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 w-fit shrink-0">
              {uploadedRequiredCount} of {requiredCount} required uploaded
            </div>
          </div>

          {/* Document Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const uploadedFile = uploadedDocs[doc.type];
              const isUploadingThis = isPending && activeUploadType === doc.type;

              return (
                <div
                  key={doc.type}
                  className="rounded-xl border border-slate-200/90 bg-white p-3.5 sm:p-4 flex flex-col justify-between gap-3 transition-all hover:border-slate-300"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                        {doc.title}
                      </p>

                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-md shrink-0 ${
                          doc.badge === "Required"
                            ? "bg-slate-100 text-slate-700 font-semibold"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        {doc.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  {/* Upload State / Attached File */}
                  {uploadedFile ? (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs text-foreground">
                      <div className="flex items-center gap-2 truncate min-w-0 pr-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                        <span className="font-medium truncate text-slate-800">
                          {uploadedFile.name}
                        </span>
                        <span className="text-slate-400 shrink-0">
                          ({uploadedFile.size})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDoc(doc.type)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors shrink-0"
                        aria-label={`Remove ${doc.title}`}
                        title="Remove file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => triggerFileSelect(doc.type)}
                      className="w-full py-2 px-3 rounded-lg border border-dashed border-slate-300 hover:border-primary hover:bg-slate-50/60 text-secondary-text hover:text-primary text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isUploadingThis ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-3.5 w-3.5 text-slate-400" />
                          <span>Select document</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard"
              className="text-xs sm:text-sm font-medium text-secondary-text hover:text-foreground transition-colors py-2"
            >
              Skip and complete later
            </Link>

            <Button
              asChild
              disabled={uploadedRequiredCount < requiredCount}
              className={`w-full sm:w-auto h-11 px-6 font-semibold text-sm rounded-xl transition-all shadow-sm ${
                uploadedRequiredCount >= requiredCount
                  ? "bg-primary hover:bg-primary-dark text-white shadow-[0_2px_10px_rgba(37,99,235,0.2)] active:scale-[0.99]"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
              }`}
            >
              <Link href="/dashboard">Submit for verification</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-3xl w-full mx-auto text-center text-xs text-secondary-text/80 pt-4">
        Protected under national healthcare regulations and BMDC compliance standards.
      </footer>
    </main>
  );
}
