"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Camera, User } from "lucide-react";

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

  const hasRealImage = Boolean(
    previewUrl ||
      (currentImageUrl &&
        currentImageUrl !== "/images/doctor-placeholder.jpg" &&
        !currentImageUrl.includes("doctor-placeholder"))
  );

  const activeSrc = previewUrl || (hasRealImage ? currentImageUrl! : "");
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    setLoadError(false);
  }, [previewUrl, currentImageUrl]);

  return (
    <div className="panel flex flex-col items-center gap-4 p-4 sm:flex-row">
      <div className="group relative">
        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/60 shadow-xs">
          {hasRealImage && !loadError ? (
            <Image
              src={activeSrc}
              alt={doctorName || "Doctor Profile"}
              fill
              className="object-cover"
              sizes="96px"
              unoptimized={Boolean(previewUrl)}
              onError={() => setLoadError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-1 text-muted-foreground w-full h-full bg-muted/70">
              <User className="h-8 w-8 opacity-60 mb-0.5" />
              <span className="text-[9px] font-medium leading-none opacity-80">No image</span>
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform hover:scale-105 disabled:opacity-50 cursor-pointer"
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
        {previewUrl ? (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ New photo selected (click Save Changes to apply)
          </span>
        ) : !hasRealImage ? (
          <span className="inline-flex items-center text-[11px] font-medium text-amber-600 dark:text-amber-400">
            No profile photo uploaded. Add a photo to build trust with patients.
          </span>
        ) : null}
      </div>
    </div>
  );
};
