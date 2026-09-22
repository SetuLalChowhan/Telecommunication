"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, User, Loader2 } from "lucide-react";

interface DoctorAvatarUploaderProps {
  currentImageUrl?: string | null;
  previewUrl?: string | null;
  doctorName?: string | null;
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const DoctorAvatarUploader: React.FC<DoctorAvatarUploaderProps> = ({
  currentImageUrl,
  previewUrl,
  doctorName,
  onFileSelect,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      onFileSelect(file);
    }
  };

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className="panel flex flex-col items-center gap-4 p-4 sm:flex-row">
      <div className="group relative">
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={doctorName || "Doctor Profile"}
              fill
              className="object-cover"
              sizes="96px"
              unoptimized={Boolean(previewUrl)}
            />
          ) : (
            <User className="h-10 w-10 text-muted-foreground/60" />
          )}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform hover:scale-105 disabled:opacity-50"
          aria-label="Upload profile photo"
        >
          <Camera className="h-4 w-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="text-center sm:text-left space-y-1">
        <h4 className="text-sm font-semibold text-foreground">Profile Photograph</h4>
        <p className="text-xs text-muted-foreground">
          PNG, JPG or WebP up to 5MB. Professional headshot recommended for patient trust.
        </p>
        {previewUrl && (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ New photo selected (click Save Changes to apply)
          </span>
        )}
      </div>
    </div>
  );
};
