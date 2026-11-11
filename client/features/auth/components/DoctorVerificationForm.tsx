"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, UploadCloud, ChevronRight, X, Loader2, ExternalLink, FileText } from "lucide-react";
import BrandLogo from "@/components/common/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/api/queries";
import {
  useUploadDoctorDocument,
  useDoctorDocuments,
  useDeleteDoctorDocument,
} from "@/features/doctors/api/queries";
import { toast } from "react-toastify";
import { compressImageIfNeeded } from "@/lib/utils/image-compression";

interface DocumentRequirement {
  type: "LICENSE" | "DEGREE_CERTIFICATE" | "NATIONAL_ID" | "OTHER";
  title: string;
  description: string;
  example: string;
  badge: "Required" | "Optional";
}

const REQUIRED_DOCUMENTS: DocumentRequirement[] = [
  {
    type: "LICENSE",
    title: "Medical License",
    description: "BMDC registration certificate",
    example: "Official BMDC permanent or provisional registration certificate showing valid BMDC number.",
    badge: "Required",
  },
  {
    type: "DEGREE_CERTIFICATE",
    title: "Degree Certificate",
    description: "MBBS, MD, or postgraduate qualification",
    example: "MBBS / BDS graduation certificate or highest postgraduate medical degree diploma.",
    badge: "Required",
  },
  {
    type: "NATIONAL_ID",
    title: "National ID or Passport",
    description: "Government-issued photo identification",
    example: "Clear photo or scan of Smart NID (front & back) or international passport biodata page.",
    badge: "Required",
  },
  {
    type: "OTHER",
    title: "Other Credentials",
    description: "Hospital appointment or specialized training",
    example: "Hospital appointment letter, clinical fellowship, or specialty training certificate.",
    badge: "Optional",
  },
];

export const DoctorVerificationForm: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, isAuthLoading } = useAuth();
  const [activeUploadType, setActiveUploadType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: serverDocs, isLoading: isDocsLoading } = useDoctorDocuments();
  const uploadDocMutation = useUploadDoctorDocument();
  const deleteDocMutation = useDeleteDoctorDocument();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirectTo=/doctor-verification");
      return;
    }

    if (user && user.emailVerified === false) {
      toast.info("Please verify your email address before uploading verification documents.");
      router.replace(
        `/verify-email?email=${encodeURIComponent(user.email)}&role=DOCTOR`
      );
      return;
    }
  }, [user, isAuthenticated, isAuthLoading, router]);

  const isPending = uploadDocMutation.isPending;

  const triggerFileSelect = (docType: string) => {
    setActiveUploadType(docType);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file || !activeUploadType) return;

    // Validate file extension and MIME type
    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png"];
    const allowedMimes = ["application/pdf", "image/jpeg", "image/png", "image/pjpeg"];
    const ext = file.name.includes(".")
      ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
      : "";

    if (!allowedExtensions.includes(ext) && !allowedMimes.includes(file.type.toLowerCase())) {
      toast.error("Invalid file format. Only PDF, JPG, and PNG documents are allowed.");
      return;
    }

    if (file.size === 0) {
      toast.error("The selected file is empty. Please choose a valid document.");
      return;
    }

    const isPdf = file.type === "application/pdf" || ext === ".pdf";

    // For PDFs: Vercel serverless functions enforce a strict 4.5MB request limit
    if (isPdf && file.size > 3.5 * 1024 * 1024) {
      toast.error(
        `PDF document is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Server upload limit is 3.5 MB. Please compress your PDF before uploading.`
      );
      return;
    }

    // For Images: Automatically optimize/compress in browser so 4MB+ photos shrink safely below 1.5MB
    if (!isPdf && file.type.startsWith("image/")) {
      try {
        file = await compressImageIfNeeded(file);
      } catch (e) {
        console.warn("Image compression skipped:", e);
      }
    }

    if (file.size > 3.8 * 1024 * 1024) {
      toast.error(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed upload size is 3.5 MB.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", activeUploadType);

    try {
      await uploadDocMutation.mutateAsync(formData);
      toast.success("Verification document uploaded successfully!");
    } catch (err: any) {
      const serverMsg =
        err?.status === 413
          ? "File is too large for the server (limit: 3.5 MB). Please compress the document and try again."
          : err?.details?.message ||
            err?.response?.data?.message ||
            err?.message ||
            "Failed to upload document. Please check your connection and try again.";
      toast.error(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
    } finally {
      setActiveUploadType(null);
    }
  };

  const handleDeleteDocument = async (id: string, title: string) => {
    try {
      await deleteDocMutation.mutateAsync(id);
      toast.success(`${title} removed successfully`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove document");
    }
  };

  const requiredCount = REQUIRED_DOCUMENTS.filter(
    (d) => d.badge === "Required"
  ).length;

  const uploadedRequiredCount = REQUIRED_DOCUMENTS.filter(
    (d) =>
      d.badge === "Required" &&
      Boolean((serverDocs || []).find((doc) => doc.docType === d.type))
  ).length;

  if (isAuthLoading || !isAuthenticated || (user && user.emailVerified === false)) {
    return (
      <main className="min-h-dvh w-full bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Verifying account status...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh w-full bg-background flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 antialiased selection:bg-accent selection:text-primary">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />

      {/* Top Header */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between pb-4 sm:pb-5 border-b border-border">
        <BrandLogo iconSize={18} />
        <Link
          href="/doctor/dashboard"
          className="text-xs sm:text-sm font-medium text-secondary-text hover:text-foreground transition-colors inline-flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-muted"
        >
          <span>Go to Doctor Console</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
      </header>

      {/* Main Verification Card */}
      <div className="max-w-3xl w-full mx-auto my-auto py-4 sm:py-6 md:py-8">
        <div className="rounded-2xl bg-card p-5 sm:p-7 md:p-9 shadow-xs border border-border">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 mb-5 border-b border-border">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Doctor Verification
              </h1>
              <p className="text-xs sm:text-sm text-secondary-text mt-1">
                Upload your medical credentials to verify your profile and start accepting consultations.
              </p>
            </div>

            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-secondary-text w-fit shrink-0">
              {uploadedRequiredCount} of {requiredCount} required uploaded
            </div>
          </div>

          {/* Document Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const serverDoc = (serverDocs || []).find((d) => d.docType === doc.type);
              const isUploadingThis = isPending && activeUploadType === doc.type;
              const isDeletingThis = deleteDocMutation.isPending && deleteDocMutation.variables === serverDoc?.id;

              return (
                <div
                  key={doc.type}
                  className="rounded-xl border border-border bg-card p-3.5 sm:p-4 flex flex-col justify-between gap-3.5 transition-all hover:border-primary/40 shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm sm:text-base font-semibold text-foreground leading-snug">
                        {doc.title} {doc.badge === "Required" && <span className="text-destructive">*</span>}
                      </p>

                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                          doc.badge === "Required"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {doc.badge}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-foreground/90">
                      {doc.description}
                    </p>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {doc.example}
                    </p>

                    <div className="pt-1 flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      <span className="rounded bg-muted px-1.5 py-0.5 font-medium">Formats: PDF, JPG, PNG</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 font-medium">Max 3.5 MB</span>
                    </div>
                  </div>

                  {serverDoc ? (
                    <div className="flex flex-col gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-xs text-foreground">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate min-w-0 pr-1">
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                          <span className="font-semibold truncate text-foreground text-xs">
                            {doc.title}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0">
                            {serverDoc.status === "APPROVED" ? "Verified" : serverDoc.status === "REJECTED" ? "Rejected" : "Uploaded"}
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={deleteDocMutation.isPending}
                          onClick={() => handleDeleteDocument(serverDoc.id, doc.title)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                          aria-label={`Remove ${doc.title}`}
                          title="Delete document"
                        >
                          {isDeletingThis ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1.5 border-t border-emerald-500/15">
                        <span>Uploaded {new Date(serverDoc.uploadedAt).toLocaleDateString()}</span>
                        <a
                          href={serverDoc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                        >
                          <span>View document</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isPending || isDocsLoading}
                      onClick={() => triggerFileSelect(doc.type)}
                      className="w-full py-2.5 px-3 rounded-lg border border-dashed border-border hover:border-primary hover:bg-muted/40 text-secondary-text hover:text-primary text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isUploadingThis ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-3.5 w-3.5 text-muted-foreground" />
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
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
            <Link
              href="/doctor/dashboard"
              className="text-xs sm:text-sm font-medium text-secondary-text hover:text-foreground transition-colors py-2"
            >
              Skip and complete later
            </Link>

            <Button
              asChild
              disabled={uploadedRequiredCount < requiredCount}
              className={`w-full sm:w-auto h-10 px-6 font-semibold text-sm rounded-xl transition-all shadow-xs ${
                uploadedRequiredCount >= requiredCount
                  ? "bg-primary hover:bg-primary-dark text-white active:scale-[0.99] cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
              }`}
            >
              <Link
                href="/doctor/dashboard"
                onClick={() => {
                  if (uploadedRequiredCount >= requiredCount) {
                    toast.success("Credentials submitted for verification! Your clinical dashboard is being activated.");
                  }
                }}
              >
                Submit for verification
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <footer className="max-w-3xl w-full mx-auto text-center text-xs text-secondary-text/80 pt-4">
        Protected under national healthcare regulations and BMDC compliance standards.
      </footer>
    </main>
  );
};
