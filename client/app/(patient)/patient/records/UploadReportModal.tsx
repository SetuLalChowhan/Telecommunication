"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Upload,
  FileText,
  Loader2,
  X,
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
import { toast } from "react-toastify";

const uploadReportSchema = z.object({
  fileName: z.string().min(2, "Document title must be at least 2 characters"),
  bookingId: z.string().optional(),
});

type UploadReportFormValues = z.infer<typeof uploadReportSchema>;

interface UploadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadReportModal({ open, onOpenChange }: UploadReportModalProps) {
  const { data: bookingsData } = usePatientBookings({ limit: 50 });
  const uploadMutation = useUploadMedicalReport();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const bookings = bookingsData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<UploadReportFormValues>({
    resolver: zodResolver(uploadReportSchema),
    defaultValues: {
      fileName: "",
      bookingId: "none",
    },
  });

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }
    setSelectedFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, "");
    setValue("fileName", cleanName, { shouldValidate: true });
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

  const onSubmit = (data: UploadReportFormValues) => {
    if (!selectedFile) {
      toast.error("Please select a document file to upload");
      return;
    }

    const extMatch = selectedFile.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = extMatch ? `.${extMatch[1]}` : "";
    let finalTitle = data.fileName.trim() || selectedFile.name;
    if (ext && !finalTitle.toLowerCase().endsWith(ext.toLowerCase())) {
      finalTitle = `${finalTitle}${ext}`;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileName", finalTitle);
    if (data.bookingId && data.bookingId !== "none") {
      formData.append("bookingId", data.bookingId);
    }

    uploadMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Medical document uploaded successfully");
        setSelectedFile(null);
        reset();
        onOpenChange(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || "Failed to upload report");
      },
    });
  };

  const handleClose = (val: boolean) => {
    if (!uploadMutation.isPending) {
      if (!val) {
        setSelectedFile(null);
        reset();
      }
      onOpenChange(val);
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-xl gap-0">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-base font-semibold text-foreground">
            Upload Medical Document
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Attach a lab test, prescription, or clinical report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* File Upload Drop Area */}
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
              placeholder="e.g. Blood Test, Chest X-Ray"
              disabled={isUploading}
              className={`h-9 text-xs rounded-lg ${
                errors.fileName ? "border-error focus-visible:ring-error" : "border-border/80"
              }`}
              {...register("fileName")}
            />
            {errors.fileName && (
              <p className="text-xs text-error font-medium">{errors.fileName.message}</p>
            )}
          </div>

          {/* Link Consultation (Optional) */}
          <div className="space-y-1.5">
            <Label htmlFor="bookingSelect" className="text-xs font-medium text-foreground">
              Associated Consultation <span className="text-muted-foreground text-[11px] font-normal">(Optional)</span>
            </Label>
            <Controller
              name="bookingId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={field.onChange}
                  disabled={isUploading}
                >
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
              )}
            />
          </div>

          {/* Clean Footer Buttons */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleClose(false)}
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
