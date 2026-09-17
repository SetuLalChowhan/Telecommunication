"use client";

import React, { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Edit2 } from "lucide-react";
import { AvailabilitySlot } from "@/lib/doctor-mock-data";

interface EditWeeklySlotDialogProps {
  slot: AvailabilitySlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSlot: (slot: AvailabilitySlot) => void;
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

const TIME_OPTIONS = [
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
  "08:30 PM",
  "09:00 PM",
];

export const EditWeeklySlotDialog: React.FC<EditWeeklySlotDialogProps> = ({
  slot,
  open,
  onOpenChange,
  onUpdateSlot,
}) => {
  const [day, setDay] = useState("MONDAY");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("01:00 PM");
  const [duration, setDuration] = useState("30");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (slot) {
      setDay(slot.dayOfWeek);
      setStartTime(slot.startTime);
      setEndTime(slot.endTime);
      setDuration(String(slot.consultationDuration || 30));
      setIsActive(slot.isActive ?? true);
    }
  }, [slot, open]);

  if (!slot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSlot: AvailabilitySlot = {
      ...slot,
      dayOfWeek: day,
      startTime,
      endTime,
      consultationDuration: parseInt(duration, 10) || 30,
      isActive,
    };
    onUpdateSlot(updatedSlot);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-1.5 pb-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1">
            <Edit2 className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Edit Weekly Slot
          </DialogTitle>
          <DialogDescription className="text-xs text-secondary-text">
            Update regular consultation hours and patient duration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Day of Week */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Day of Week
            </Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {DAYS_OF_WEEK.map((d) => (
                  <SelectItem key={d} value={d} className="text-xs font-medium">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start & End Times */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Start Time
              </Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Start Time" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs font-medium">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                End Time
              </Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="End Time" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs font-medium">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Duration per Patient (mins)
            </Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {["15", "20", "30", "45", "60"].map((mins) => (
                  <SelectItem key={mins} value={mins} className="text-xs font-medium">
                    {mins} mins per visit
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-xl border border-border/80 p-3 bg-muted/20">
            <div>
              <p className="text-xs font-semibold text-foreground">Slot Active Status</p>
              <p className="text-[11px] text-muted-foreground">
                When enabled, patients can book this time slot online.
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="Toggle slot active status"
            />
          </div>

          <DialogFooter className="pt-3 gap-2 flex items-center justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9.5 px-4 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-9.5 px-5 rounded-xl text-xs font-semibold shadow-xs"
            >
              Update Slot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWeeklySlotDialog;
