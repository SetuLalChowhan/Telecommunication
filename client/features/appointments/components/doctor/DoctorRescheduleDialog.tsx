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
  DialogBody,
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
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-xs">
            <RefreshCw className="h-5 w-5 stroke-[2.2]" />
          </div>
          <DialogTitle className="text-center text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Reschedule Consultation
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Move patient <span className="font-semibold text-foreground">{appointment.patientName}</span> to an alternative available time slot.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5 px-6 py-5 text-xs">
          {/* Comparison Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-border/80 bg-muted/40 p-4 shadow-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Current Time
              </span>
              <p className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span>{appointment.time}</span>
              </p>
              <div className="pt-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                  Status: {appointment.status}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-border/80 sm:pl-4">
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">
                Proposed New Time
              </span>
              {selectedSlot ? (
                <>
                  <p className="font-semibold text-primary text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{proposedFormattedTime}</span>
                  </p>
                  <div className="pt-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      Selected Slot
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-1.5 py-1 text-muted-foreground text-xs italic">
                  <Calendar className="h-3.5 w-3.5 shrink-0 opacity-60" />
                  <span>Select date & slot below</span>
                </div>
              )}
            </div>
          </div>

          {!showConfirm ? (
            <>
              {/* Date Selector */}
              <div className="space-y-2">
                <Label htmlFor="reschedule-date" className="text-xs font-semibold text-foreground flex items-center gap-1">
                  <span>Select Reschedule Date</span>
                  <span className="text-destructive font-bold">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="reschedule-date"
                    type="date"
                    min={toDateInputValue(new Date())}
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="h-11 rounded-xl text-xs sm:text-sm font-medium border-border/80 bg-background px-3.5 shadow-xs focus-visible:ring-2 focus-visible:ring-primary/20 cursor-pointer"
                  />
                </div>
              </div>

              {/* Slots Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <span>Available Time Slots</span>
                    <span className="text-destructive font-bold">*</span>
                  </Label>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    {availableSlots.length} slot(s) open
                  </span>
                </div>

                {isSlotsLoading ? (
                  <div className="flex flex-col items-center justify-center p-8 border rounded-xl bg-card gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-[11px] text-muted-foreground">Checking doctor availability...</span>
                  </div>
                ) : slotsData?.isDayOff ? (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center text-xs text-amber-700 dark:text-amber-300">
                    {slotsData.reason || "This date is marked as a scheduled day off."}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center">
                    <Clock className="h-6 w-6 text-muted-foreground/50 mb-2" />
                    <p className="text-xs font-semibold text-foreground">No open consultation slots</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Please choose another date from the calendar</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.slotStart === slot.slotStart;
                      return (
                        <button
                          key={slot.slotStart}
                          type="button"
                          onClick={() => handleSelectSlot(slot)}
                          className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                            isSelected
                              ? "bg-primary text-white border-primary shadow-sm ring-2 ring-primary/20 font-bold"
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
              <div className="space-y-2">
                <Label htmlFor="reschedule-reason" className="text-xs font-semibold text-foreground">
                  Reason for Rescheduling (Optional)
                </Label>
                <Textarea
                  id="reschedule-reason"
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Schedule adjustment due to urgent clinical emergency..."
                  className="rounded-xl text-xs resize-none border-border/80 bg-background p-3 focus-visible:ring-2 focus-visible:ring-primary/20 shadow-xs"
                />
              </div>
            </>
          ) : (
            /* Confirmation step */
            <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-xs sm:text-sm">
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
        </DialogBody>

        <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          {showConfirm ? (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={rescheduleMutation.isPending}
                onClick={() => setShowConfirm(false)}
                className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer border-border hover:bg-muted"
              >
                Back to Edit
              </Button>
              <Button
                type="button"
                disabled={rescheduleMutation.isPending}
                onClick={handleExecuteReschedule}
                className="w-full sm:w-auto h-10 px-5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
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
                className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer border-border hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!selectedSlot}
                onClick={handleProceedToConfirm}
                className="w-full sm:w-auto h-10 px-5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white gap-2 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
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
