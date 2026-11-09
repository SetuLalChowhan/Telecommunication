"use client";

import React from "react";
import {
  CreditCard,
  Calendar,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AvailableSlotItem } from "@/features/patients";
import { formatTime } from "@/lib/time";

interface BookingPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorName: string;
  specialty?: string;
  fee: number;
  selectedDate: Date;
  selectedSlot: AvailableSlotItem | null;
  phone: string;
  notes?: string;
  isSubmitting: boolean;
  onConfirmPayment: () => void;
}

export const BookingPaymentModal: React.FC<BookingPaymentModalProps> = ({
  open,
  onOpenChange,
  doctorName,
  specialty,
  fee,
  selectedDate,
  selectedSlot,
  phone,
  notes,
  isSubmitting,
  onConfirmPayment,
}) => {
  if (!selectedSlot) return null;

  const dateFormatted = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeFormatted = `${formatTime(selectedSlot.slotStart)} - ${formatTime(selectedSlot.slotEnd)}`;

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-xs">
            <CreditCard className="h-6 w-6 stroke-[2.2]" />
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Confirm Booking & Payment
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Review your appointment summary and confirm your consultation
            payment.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-6 py-5 text-xs">
          {/* Doctor & Slot Overview */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-3 shadow-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground text-sm">
                  {doctorName}
                </p>
                {specialty && (
                  <p className="text-[11px] text-muted-foreground">
                    {specialty}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                Video Visit
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-border/60 text-muted-foreground text-xs">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{dateFormatted}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{timeFormatted}</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Contact: {phone}</span>
              </div>
              {notes && (
                <div className="col-span-2 text-[11px] bg-background/80 p-2.5 rounded-lg border border-border/60 text-foreground">
                  <span className="font-medium text-muted-foreground">
                    Notes:{" "}
                  </span>
                  {notes}
                </div>
              )}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="rounded-xl border border-border/80 p-4 space-y-2.5 shadow-xs bg-card">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
              Payment Summary
            </h4>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Consultation Fee</span>
              <span className="font-medium text-foreground">
                BDT {fee.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Platform Processing Fee</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                FREE
              </span>
            </div>
            <div className="pt-2.5 border-t border-border flex items-center justify-between text-sm font-bold text-foreground">
              <span>Total Payable</span>
              <span className="text-primary text-base">
                BDT {fee.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Simulated Gateway Badge */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px] leading-relaxed">
              <p className="font-semibold text-foreground">
                Database-Backed Simulated Payment
              </p>
              <p className="text-muted-foreground">
                Sandbox Mode: This creates an official{" "}
                <code className="text-foreground font-semibold">PAID</code>{" "}
                payment transaction in the database. Prepared for bKash
                integration. No real money will be charged.
              </p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer border-border hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirmPayment}
            className="w-full sm:w-auto h-10 px-5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white gap-2 shadow-sm cursor-pointer active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <span>Confirm Payment (BDT {fee.toLocaleString()})</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
