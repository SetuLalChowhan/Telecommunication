"use client";

import React from "react";
import { Link2, Check, X, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSlugAvailability } from "@/features/doctors/api/queries";

interface DoctorSlugFieldProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

/**
 * Public profile URL with real-time availability feedback.
 *
 * The check runs against the API (debounced) as the doctor types, so a taken
 * URL is caught before saving instead of failing the whole profile submit.
 */
export const DoctorSlugField: React.FC<DoctorSlugFieldProps> = ({
  value,
  disabled,
  onChange,
}) => {
  const { data, isFetching, isError } = useSlugAvailability(value);

  const trimmed = value.trim();
  const tooShort = trimmed.length < 2;

  const isAvailable = Boolean(data?.available) && !isFetching;
  const isTaken = data?.reason === "TAKEN" && !isFetching;
  const isInvalid = data?.reason === "INVALID" && !isFetching;

  return (
    <div className="space-y-2 md:col-span-2">
      <Label className="text-xs font-semibold text-foreground">
        Public Profile URL
      </Label>

      <div className="flex items-stretch gap-0">
        <span className="flex items-center rounded-l-xl border border-r-0 border-input bg-muted/60 px-3 text-xs font-medium text-muted-foreground">
          /doctors/
        </span>
        <div className="relative flex-1">
          <Link2 className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            placeholder="dr-your-name"
            aria-invalid={isTaken || isInvalid}
            className="pl-10 h-10 rounded-l-none rounded-r-none"
          />
        </div>
        <span className="flex w-11 items-center justify-center rounded-r-xl border border-l-0 border-input bg-muted/60">
          {isFetching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isAvailable ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : isTaken || isInvalid ? (
            <X className="h-4 w-4 text-destructive" />
          ) : null}
        </span>
      </div>

      {tooShort ? (
        <p className="text-[11px] text-muted-foreground">
          This is the link you share. Leave it blank and we keep it in sync with
          your name.
        </p>
      ) : isFetching ? (
        <p className="text-[11px] text-muted-foreground">
          Checking availability…
        </p>
      ) : isError ? (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>Could not check that URL right now — you can still save it.</span>
        </p>
      ) : isInvalid ? (
        <p className="text-[11px] font-medium text-destructive">
          Use at least one letter or number.
        </p>
      ) : isTaken ? (
        <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-destructive">
          <X className="h-3 w-3 shrink-0" />
          <span>Already taken.</span>
          {data?.suggestion && (
            <button
              type="button"
              onClick={() => onChange(data.suggestion)}
              className="font-semibold text-primary underline underline-offset-2 hover:text-primary-dark"
            >
              Use {data.suggestion}
            </button>
          )}
        </p>
      ) : isAvailable ? (
        <p className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
          <Check className="h-3 w-3 shrink-0" />
          <span>Available — /doctors/{data?.slug}</span>
        </p>
      ) : null}
    </div>
  );
};

export default DoctorSlugField;
