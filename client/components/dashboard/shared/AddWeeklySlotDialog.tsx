"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { AvailabilitySlot } from "@/lib/doctor-mock-data";
import { TIME_OPTIONS, to24Hour } from "@/lib/time-utils";

interface AddWeeklySlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSlot: (slot: AvailabilitySlot) => void;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

interface AddWeeklySlotFormProps {
  onAddSlot: (slot: AvailabilitySlot) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddWeeklySlotForm: React.FC<AddWeeklySlotFormProps> = ({
  onAddSlot,
  onCancel,
  isLoading = false,
}) => {
  const [day, setDay] = useState("MONDAY");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");
  const [duration, setDuration] = useState("30");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedStart = to24Hour(startTime);
    const formattedEnd = to24Hour(endTime);

    if (formattedStart >= formattedEnd) {
      setError("End time must be later than start time.");
      return;
    }
    setError(null);

    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      dayOfWeek: day,
      startTime: formattedStart,
      endTime: formattedEnd,
      consultationDuration: parseInt(duration, 10) || 30,
      isActive: true,
    };

    onAddSlot(newSlot);
    // Note: Do NOT close dialog here. Parent closes dialog on mutation success!
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
          {error}
        </div>
      )}

      {/* Day of Week */}
      <div>
        <Label htmlFor="day-select">Day of Week</Label>
        <Select value={day} onValueChange={setDay} disabled={isLoading}>
          <SelectTrigger id="day-select" className="h-10 text-xs sm:text-sm rounded-xl">
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent className="max-h-56">
            {DAYS_OF_WEEK.map((d) => (
              <SelectItem key={d} value={d} className="text-xs">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Start & End Times */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <Label htmlFor="start-time">Start Time</Label>
          <Select
            value={startTime}
            onValueChange={(v) => {
              setStartTime(v);
              setError(null);
            }}
            disabled={isLoading}
          >
            <SelectTrigger id="start-time" className="h-10 text-xs sm:text-sm rounded-xl">
              <SelectValue placeholder="Start Time" />
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {TIME_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-xs">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="end-time">End Time</Label>
          <Select
            value={endTime}
            onValueChange={(v) => {
              setEndTime(v);
              setError(null);
            }}
            disabled={isLoading}
          >
            <SelectTrigger id="end-time" className="h-10 text-xs sm:text-sm rounded-xl">
              <SelectValue placeholder="End Time" />
            </SelectTrigger>
            <SelectContent className="max-h-56">
              {TIME_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-xs">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Duration */}
      <div>
        <Label htmlFor="duration-select">Duration per Patient</Label>
        <Select value={duration} onValueChange={setDuration} disabled={isLoading}>
          <SelectTrigger id="duration-select" className="h-10 text-xs sm:text-sm rounded-xl">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {["15", "20", "30", "45", "60"].map((mins) => (
              <SelectItem key={mins} value={mins} className="text-xs">
                {mins} mins per visit
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DialogFooter className="mt-6 pt-4 border-t border-border/60">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
          className="h-9 px-4 text-xs rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isLoading}
          className="h-9 px-5 text-xs font-semibold rounded-xl shadow-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            "Save Slot"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const AddWeeklySlotDialog: React.FC<AddWeeklySlotDialogProps> = ({
  open,
  onOpenChange,
  onAddSlot,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && onOpenChange(val)}>
      <DialogContent className="max-w-[450px] p-6 sm:p-7">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-lg font-bold text-foreground">
            Add Weekly Slot
          </DialogTitle>
          <DialogDescription className="text-xs text-secondary-text mt-1">
            Configure active hours for recurring patient consultations.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <AddWeeklySlotForm
            onAddSlot={onAddSlot}
            onCancel={() => onOpenChange(false)}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddWeeklySlotDialog;
