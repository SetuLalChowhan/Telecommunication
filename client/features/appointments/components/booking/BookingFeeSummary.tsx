"use client";

import React from "react";
import { Video, ShieldCheck, FileText, ArrowRight, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { AvailableSlotItem } from "@/features/patients";

interface BookingFeeSummaryProps {
  fee: number;
  notes: string;
  onNotesChange: (val: string) => void;
  selectedSlot: AvailableSlotItem | null;
  isAuthenticated: boolean;
  isPatient: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const BookingFeeSummary: React.FC<BookingFeeSummaryProps> = ({
  fee,
  notes,
  onNotesChange,
  selectedSlot,
  isAuthenticated,
  isPatient,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <div className="space-y-4 pt-3 border-t border-border/80">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>Symptoms or Consultation Reason (Optional)</span>
        </label>
        <Textarea
          placeholder="Briefly describe your symptoms or reason for visit..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={2}
          className="rounded-xl resize-none text-xs"
        />
      </div>

      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-2 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Consultation Type</span>
          <span className="font-semibold text-foreground flex items-center gap-1">
            <Video className="h-3 w-3 text-primary" />
            Video Call (Google Meet)
          </span>
        </div>
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Consultation Fee</span>
          <span className="text-sm font-bold text-foreground">BDT {fee}</span>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="space-y-2">
          <Link href="/login">
            <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm shadow-primary/20">
              <LogIn className="h-4 w-4" />
              <span>Log in to Book Consultation</span>
            </Button>
          </Link>
          <p className="text-[11px] text-center text-muted-foreground">
            You must be logged in as a patient to schedule an appointment.
          </p>
        </div>
      ) : !isPatient ? (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 text-center font-medium">
          Only patients can schedule appointments with doctors.
        </div>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={!selectedSlot || isSubmitting}
          className="w-full h-11 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm shadow-primary/20 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Confirming Booking...</span>
            </>
          ) : (
            <>
              <span>Confirm & Book Appointment</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Verified Doctor · Secure Google Meet Video Link</span>
      </div>
    </div>
  );
};
