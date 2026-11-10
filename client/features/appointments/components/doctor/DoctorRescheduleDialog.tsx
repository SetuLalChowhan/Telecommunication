"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCw,
  User,
  Bell,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAvailableSlots, AvailableSlotItem } from "@/features/patients";
import {
  useRescheduleDoctorBooking,
  useDoctorDetails,
  useMyDoctorSchedule,
  useMyDoctorDaysOff,
} from "@/features/doctors/api/queries";
import { toDateInputValue, formatTime, formatDate, buildBookingDateStrip } from "@/lib/time";
import { BookingDateStrip } from "@/features/appointments/components/booking/BookingDateStrip";
import { BookingSlotGrid } from "@/features/appointments/components/booking/BookingSlotGrid";
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
  const days = useMemo(() => buildBookingDateStrip(14), []);

  const { data: doctorProfile } = useDoctorDetails(doctorId);
  const { data: mySchedule } = useMyDoctorSchedule();
  const { data: myDaysOff } = useMyDoctorDaysOff();

  const DAY_NAMES = useMemo(
    () => ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
    []
  );

  const activeDaysSet = useMemo(() => {
    const list =
      mySchedule && mySchedule.length > 0
        ? mySchedule
        : doctorProfile?.availabilities || [];
    return new Set(
      list
        .filter((a: any) => a.isActive !== false)
        .map((a: any) => String(a.dayOfWeek).toUpperCase())
    );
  }, [mySchedule, doctorProfile?.availabilities]);

  const daysOffSet = useMemo(() => {
    const list =
      myDaysOff && myDaysOff.length > 0
        ? myDaysOff
        : doctorProfile?.daysOff || [];
    return new Set(
      list.map((d: any) =>
        typeof d.date === "string" ? d.date.slice(0, 10) : toDateInputValue(new Date(d.date))
      )
    );
  }, [myDaysOff, doctorProfile?.daysOff]);

  const isDateDisabled = useCallback(
    (date: Date) => {
      const dateStr = toDateInputValue(date);
      if (daysOffSet.has(dateStr)) return true;
      const dayName = DAY_NAMES[date.getDay()];
      if (activeDaysSet.size > 0 && !activeDaysSet.has(dayName)) return true;
      return false;
    },
    [daysOffSet, activeDaysSet, DAY_NAMES]
  );

  const firstAvailableDate = useMemo(() => {
    const first = days.find((d) => !isDateDisabled(d.date));
    return first?.date ?? days[0]?.date ?? new Date();
  }, [days, isDateDisabled]);

  const [selectedDateObj, setSelectedDateObj] = useState<Date>(firstAvailableDate);

  // Sync date when dialog opens or when availability loads
  useEffect(() => {
    if (open) {
      if (isDateDisabled(selectedDateObj)) {
        setSelectedDateObj(firstAvailableDate);
      }
      setSelectedSlot(null);
      setShowConfirm(false);
    }
  }, [open, firstAvailableDate, isDateDisabled]);

  const selectedDateStr = useMemo(
    () => toDateInputValue(selectedDateObj),
    [selectedDateObj]
  );

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotItem | null>(null);
  const [reason, setReason] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const rescheduleMutation = useRescheduleDoctorBooking();
  const { data: slotsData, isLoading: isSlotsLoading } = useAvailableSlots(
    doctorId,
    selectedDateStr
  );

  if (!appointment) return null;

  const handleSelectDate = (date: Date) => {
    setSelectedDateObj(date);
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

        <DialogBody className="space-y-4 px-6 py-5 text-xs">
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
                    <span className="truncate">{proposedFormattedTime}</span>
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
              {/* Identical Date Strip & Calendar Picker */}
              <div className="space-y-1 rounded-xl border border-border/70 p-3 bg-card shadow-xs">
                <BookingDateStrip
                  days={days}
                  selectedDate={selectedDateObj}
                  onSelectDate={handleSelectDate}
                  isCalendarOpen={isCalendarOpen}
                  onCalendarOpenChange={setIsCalendarOpen}
                  isDateDisabled={isDateDisabled}
                />
              </div>

              {/* Identical Slot Grid */}
              <div className="space-y-1 rounded-xl border border-border/70 p-3 bg-card shadow-xs">
                <BookingSlotGrid
                  slots={slotsData?.slots || []}
                  selectedSlot={selectedSlot}
                  onSelectSlot={handleSelectSlot}
                  isLoading={isSlotsLoading}
                  dayOffReason={
                    slotsData?.isDayOff
                      ? slotsData.reason || "Doctor is scheduled off on this date"
                      : undefined
                  }
                  unavailableMessage="No open consultation slots on this date. Please select another date above."
                />
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-foreground text-sm">Confirm Reschedule Details</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The appointment for <span className="font-semibold text-foreground">{appointment.patientName}</span> will be updated to:
                  </p>
                  <p className="font-bold text-primary text-sm pt-1">
                    {proposedFormattedTime}
                  </p>
                  {reason && (
                    <p className="text-xs text-muted-foreground pt-1">
                      <span className="font-semibold">Reason:</span> {reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-background/80 p-3 border border-primary/20 text-[11px] text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Automatic Patient Notification</span>
                </p>
                <p>
                  The patient will receive an instant notification in their dashboard with the updated consultation schedule.
                </p>
              </div>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="px-6 py-4 bg-muted/30 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          {!showConfirm ? (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={rescheduleMutation.isPending}
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer border-border hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!selectedSlot || isSlotsLoading}
                onClick={handleProceedToConfirm}
                className="w-full sm:w-auto h-10 px-5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white gap-2 shadow-sm cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                disabled={rescheduleMutation.isPending}
                onClick={() => setShowConfirm(false)}
                className="w-full sm:w-auto h-10 px-4 text-xs font-semibold rounded-xl cursor-pointer border-border hover:bg-muted"
              >
                Back to Slots
              </Button>
              <Button
                type="button"
                disabled={rescheduleMutation.isPending}
                onClick={handleExecuteReschedule}
                className="w-full sm:w-auto h-10 px-5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white gap-2 shadow-sm cursor-pointer"
              >
                {rescheduleMutation.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Rescheduling...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Confirm & Notify Patient</span>
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorRescheduleDialog;
