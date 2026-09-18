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
import { Switch } from "@/components/ui/switch";
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

interface EditWeeklySlotFormProps {
  slot: AvailabilitySlot;
  onUpdateSlot: (slot: AvailabilitySlot) => void;
  onCancel: () => void;
}

const EditWeeklySlotForm: React.FC<EditWeeklySlotFormProps> = ({
  slot,
  onUpdateSlot,
  onCancel,
}) => {
  const [day, setDay] = useState(slot.dayOfWeek);
  const [startTime, setStartTime] = useState(slot.startTime);
  const [endTime, setEndTime] = useState(slot.endTime);
  const [duration, setDuration] = useState(String(slot.consultationDuration || 30));
  const [isActive, setIsActive] = useState(slot.isActive ?? true);

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
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day of Week */}
          <div>
            <Label htmlFor="edit-day-select">Day of Week</Label>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger id="edit-day-select" className="h-10 text-xs sm:text-sm rounded-xl">
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
              <Label htmlFor="edit-start-time">Start Time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="edit-start-time" className="h-10 text-xs sm:text-sm rounded-xl">
                  <SelectValue placeholder="Start Time" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-end-time">End Time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="edit-end-time" className="h-10 text-xs sm:text-sm rounded-xl">
                  <SelectValue placeholder="End Time" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="edit-duration-select">Duration per Patient</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="edit-duration-select" className="h-10 text-xs sm:text-sm rounded-xl">
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

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-xl border border-border/80 p-3 bg-muted/20">
            <div>
              <p className="text-xs font-semibold text-foreground">Active for bookings</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Patients can schedule visits during this slot.
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={setIsActive}
              aria-label="Toggle slot active status"
            />
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="h-9 px-4 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-5 text-xs font-semibold rounded-xl shadow-xs"
            >
              Update Slot
            </Button>
          </DialogFooter>
        </form>
  );
};

export const EditWeeklySlotDialog: React.FC<EditWeeklySlotDialogProps> = ({
  slot,
  open,
  onOpenChange,
  onUpdateSlot,
}) => {
  if (!slot) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px] p-6 sm:p-7">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-lg font-bold text-foreground">
            Edit Weekly Slot
          </DialogTitle>
          <DialogDescription className="text-xs text-secondary-text mt-1">
            Update regular consultation hours and visit length.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <EditWeeklySlotForm
            key={slot.id}
            slot={slot}
            onUpdateSlot={onUpdateSlot}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditWeeklySlotDialog;
