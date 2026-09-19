"use client";

import React, { useState } from "react";
import {
  Upload,
  FileText,
  Loader2,
  X,
  FileSpreadsheet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatientBookings } from "@/features/patients/api/queries";
import { useUploadMedicalReport } from "@/features/medical-reports/api/queries";

interface UploadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadReportModal({ open, onOpenChange }: UploadReportModalProps) {
  const { data: bookingsData } = usePatientBookings({ limit: 50 });
  const uploadMutation = useUploadMedicalReport();

  const [bookingId, setBookingId] = useState<string>("none");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const bookings = bookingsData?.data || [];

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit");
      return;
    }
    setSelectedFile(file);
    if (!fileName.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setFileName(cleanName);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileName", fileName.trim() || selectedFile.name);
    if (bookingId && bookingId !== "none") {
      formData.append("bookingId", bookingId);
    }

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        setSelectedFile(null);
        setFileName("");
        setBookingId("none");
        onOpenChange(false);
      },
    });
  };

  const isUploading = uploadMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xl gap-0">
        {/* Simple, Humanized Header */}
        <DialogHeader className="pb-4">
          <DialogTitle className="text-base font-semibold text-foreground">
            Upload Medical Document
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Attach a lab test, prescription, or clinical report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Drop Area - Minimal & Compact */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Document File <span className="text-destructive">*</span>
            </Label>

            {selectedFile ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-muted/30">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative border border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border/80 hover:border-primary/60 bg-muted/20"
                }`}
              >
                <input
                  type="file"
                  required
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                    <Upload className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xs text-foreground">
                    <span className="font-semibold text-primary">Choose file</span> or drag and drop
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Document Title */}
          <div className="space-y-1.5">
            <Label htmlFor="fileName" className="text-xs font-medium text-foreground">
              Document Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fileName"
              type="text"
              required
              placeholder="e.g. Blood Test, Chest X-Ray"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="h-9 text-xs rounded-lg border-border/80 focus-visible:ring-1 focus-visible:ring-primary/50"
            />
          </div>

          {/* Link Consultation (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="bookingSelect" className="text-xs font-medium text-foreground">
              Associated Consultation <span className="text-muted-foreground text-[11px] font-normal">(Optional)</span>
            </Label>
            <Select value={bookingId} onValueChange={setBookingId}>
              <SelectTrigger id="bookingSelect" className="h-9 text-xs rounded-lg border-border/80 focus:ring-1 focus:ring-primary/50">
                <SelectValue placeholder="General Record (No Consultation)" />
              </SelectTrigger>
              <SelectContent className="max-h-56 rounded-xl">
                <SelectItem value="none" className="text-xs">
                  None (General Record)
                </SelectItem>
                {bookings.map((b) => {
                  const docName = b.doctor?.user?.name || "Doctor";
                  const dateStr = new Date(b.slotStart).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <SelectItem key={b.id} value={b.id} className="text-xs">
                      {dateStr} &bull; {docName} ({b.status.toLowerCase()})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Clean Footer Buttons */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
              className="h-8.5 px-3 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedFile || isUploading}
              className="h-8.5 px-3.5 rounded-lg text-xs font-semibold gap-1.5 shadow-xs"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload Document</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
