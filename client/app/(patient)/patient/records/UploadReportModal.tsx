"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, ImageIcon, Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
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
import { formatRecordDate, getFileKind } from "@/features/medical-reports/utils/record-meta";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds the 10 MB limit");
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
        setSelectedFile(null);
        reset();
        onOpenChange(false);
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
  const fileKind = selectedFile ? getFileKind(selectedFile.name) : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload medical document</DialogTitle>
          <DialogDescription>
            Add a lab result, scan or prescription. You can link it to one of your
            consultations.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <DialogBody>
          {/* File picker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              Document file <span className="text-destructive">*</span>
            </Label>

            {selectedFile ? (
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    {fileKind?.isImage ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-secondary-text">
                      {fileKind?.label} ·{" "}
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                  className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-foreground"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove selected file</span>
                </Button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`relative rounded-lg border border-dashed p-5 text-center transition-colors ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/20 hover:border-primary/50"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  aria-label="Choose a document file"
                />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <span className="h-9 w-9 rounded-lg bg-card border border-border flex items-center justify-center text-primary">
                    <Upload className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-foreground">
                    <span className="font-medium text-primary">Choose a file</span>{" "}
                    or drag it here
                  </span>
                  <span className="text-xs text-secondary-text">
                    PDF, JPG or PNG · up to 10 MB
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Document title */}
          <div className="space-y-1.5">
            <Label htmlFor="fileName" className="text-xs font-semibold">
              Document name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="fileName"
              type="text"
              placeholder="e.g. Complete blood count, Chest X-Ray"
              disabled={isUploading}
              aria-invalid={Boolean(errors.fileName)}
              aria-describedby={errors.fileName ? "fileName-error" : undefined}
              {...register("fileName")}
            />
            {errors.fileName ? (
              <p id="fileName-error" className="text-xs text-error font-medium">
                {errors.fileName.message}
              </p>
            ) : (
              <p className="text-xs text-secondary-text">
                This is how the document appears in your records.
              </p>
            )}
          </div>

          {/* Link to a consultation */}
          <div className="space-y-1.5">
            <Label htmlFor="bookingSelect" className="text-xs font-semibold">
              Related consultation{" "}
              <span className="text-xs font-normal text-secondary-text">
                (optional)
              </span>
            </Label>
            <Controller
              name="bookingId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={field.onChange}
                  disabled={isUploading || bookings.length === 0}
                >
                  <SelectTrigger id="bookingSelect" className="h-9 rounded-md text-sm">
                    <SelectValue placeholder="Not linked to a consultation" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    <SelectItem value="none">Not linked to a consultation</SelectItem>
                    {bookings.map((b) => {
                      const docName = b.doctor?.user?.name || "Doctor";
                      return (
                        <SelectItem key={b.id} value={b.id}>
                          {formatRecordDate(b.slotStart)} · {docName} ·{" "}
                          {b.status.toLowerCase()}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-secondary-text">
              {bookings.length === 0
                ? "You have no consultations yet, so this document will be saved as a general record."
                : "Link the document to the appointment it belongs to, or leave it as a general record."}
            </p>
          </div>

          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleClose(false)}
              disabled={isUploading}
              className="h-8 rounded-md px-3 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedFile || isUploading}
              className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading…</span>
                </>
              ) : (
                <span>Upload document</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadReportModal;
