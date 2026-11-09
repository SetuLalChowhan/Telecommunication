"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAvailableSlots, AvailableSlotItem } from "@/features/patients";
import { useRescheduleDoctorBooking } from "@/features/doctors/api/queries";
import { toDateInputValue, formatTime, formatDate } from "@/lib/time";
import { DoctorScheduleItem } from "@/features/appointments/types";
import { toast } from "react-toastify";

interface DoctorRescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: DoctorScheduleItem | null;
  doctorId: string;
}

export const DoctorRescheduleDialog: React.FC<DoctorRescheduleDialogProps> = ({
  open,
  onOpenChange,
  appointment,
  doctorId,
}) => {
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(() =>
    toDateInputValue(tomorrow)
  );
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotItem | null>(null);
  const [reason, setReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const rescheduleMutation = useRescheduleDoctorBooking();
  const { data: slotsData, isLoading: isSlotsLoading } = useAvailableSlots(
    doctorId,
    selectedDate
  );

  const availableSlots = useMemo(() => {
    return (slotsData?.slots || []).filter((s) => s.isAvailable);
  }, [slotsData]);

  if (!appointment) return null;

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    setSelectedSlot(null);
    setShowConfirm(false);
  };

  const handleSelectSlot = (slot: AvailableSlotItem) => {
    setSelectedSlot(slot);
    setShowConfirm(false);
  };

  const handleProceedToConfirm = () => {
    if (!selectedSlot) {
      toast.error("Please select a new time slot to reschedule this consultation");
      return;
    }
    setShowConfirm(true);
  };

  const handleExecuteReschedule = async () => {
    if (!selectedSlot) return;

    rescheduleMutation.mutate(
      {
        bookingId: appointment.id,
        newSlotStart: selectedSlot.slotStart,
        newSlotEnd: selectedSlot.slotEnd,
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setShowConfirm(false);
          setSelectedSlot(null);
          setReason("");
        },
      }
    );
  };

  const proposedFormattedTime = selectedSlot
    ? `${formatDate(selectedSlot.slotStart, "short")} · ${formatTime(selectedSlot.slotStart)} - ${formatTime(selectedSlot.slotEnd)}`
    : "";

  return (
    <Dialog open={open} onOpenChange={rescheduleMutation.isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
            <RefreshCw className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center text-lg font-bold">
            Reschedule Consultation
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground">
            Move patient <span className="font-semibold text-foreground">{appointment.patientName}</span> to an alternative available time slot.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Comparison Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-border bg-muted/20 p-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Current Time
              </span>
              <p className="font-semibold text-foreground text-xs">{appointment.time}</p>
              <p className="text-[11px] text-muted-foreground">Status: {appointment.status}</p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-border sm:pl-3">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                Proposed New Time
              </span>
              {selectedSlot ? (
                <p className="font-semibold text-primary text-xs">{proposedFormattedTime}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground italic">
                  Select date & slot below
                </p>
              )}
            </div>
          </div>

          {!showConfirm ? (
            <>
              {/* Date Selector */}
              <div className="space-y-1.5">
                <Label htmlFor="reschedule-date" className="text-xs font-semibold text-foreground">
                  Select Reschedule Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reschedule-date"
                  type="date"
                  min={toDateInputValue(new Date())}
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="h-9 rounded-lg text-xs"
                />
              </div>

              {/* Slots Grid */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">
                    Available Time Slots <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[10px] text-muted-foreground">
                    {availableSlots.length} slot(s) open
                  </span>
                </div>

                {isSlotsLoading ? (
                  <div className="flex items-center justify-center p-6 border rounded-lg bg-card">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : slotsData?.isDayOff ? (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center text-xs text-amber-700 dark:text-amber-300">
                    {slotsData.reason || "This date is marked as a scheduled day off."}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="rounded-lg border border-border bg-card p-4 text-center text-xs text-muted-foreground">
                    No available consultation slots for this date. Please choose another day.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.slotStart === slot.slotStart;
                      return (
                        <button
                          key={slot.slotStart}
                          type="button"
                          onClick={() => handleSelectSlot(slot)}
                          className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-center ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-xs"
                              : "bg-card hover:bg-muted/80 border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          {formatTime(slot.slotStart)}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Optional Reason */}
              <div className="space-y-1.5">
                <Label htmlFor="reschedule-reason" className="text-xs font-semibold text-foreground">
                  Reason for Rescheduling (Optional)
                </Label>
                <Textarea
                  id="reschedule-reason"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Schedule adjustment due to urgent surgery..."
                  className="rounded-lg text-xs resize-none"
                />
              </div>
            </>
          ) : (
            /* Confirmation step */
            <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-xs">
                    Please confirm this reschedule action
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    The appointment status will transition to{" "}
                    <code className="text-primary font-bold">RESCHEDULED</code>, the original slot will be immediately freed for other patients, and the patient will be notified with their updated consultation details.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          {showConfirm ? (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={rescheduleMutation.isPending}
                onClick={() => setShowConfirm(false)}
                className="w-full sm:w-auto h-9 text-xs font-semibold cursor-pointer"
              >
                Back to Edit
              </Button>
              <Button
                type="button"
                disabled={rescheduleMutation.isPending}
                onClick={handleExecuteReschedule}
                className="w-full sm:w-auto h-9 text-xs font-semibold bg-primary hover:bg-primary-dark text-white gap-2 cursor-pointer shadow-sm"
              >
                {rescheduleMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Confirm Reschedule</span>
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto h-9 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!selectedSlot}
                onClick={handleProceedToConfirm}
                className="w-full sm:w-auto h-9 text-xs font-semibold bg-primary hover:bg-primary-dark text-white gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

