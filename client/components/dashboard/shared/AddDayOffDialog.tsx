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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddDayOffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  onAddDayOff: (dateStr: string, reason: string) => void;
}

export const AddDayOffDialog: React.FC<AddDayOffDialogProps> = ({
  open,
  onOpenChange,
  selectedDate,
  onAddDayOff,
}) => {
  const [reason, setReason] = useState("");

  const formattedDate =
    selectedDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) || "Selected Date";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDayOff(formattedDate, reason.trim() || "Personal Leave");
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] p-6 sm:p-7">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-lg font-bold text-foreground">
            Schedule Day Off
          </DialogTitle>
          <DialogDescription className="text-xs text-secondary-text mt-1">
            Mark this date as unavailable for patient bookings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="day-off-date">Selected Date</Label>
            <Input
              id="day-off-date"
              disabled
              value={formattedDate}
              className="h-10 text-xs sm:text-sm bg-muted/40 font-medium rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="day-off-reason">Reason for Absence</Label>
            <Input
              id="day-off-reason"
              placeholder="e.g. Clinical Conference, Vacation, Personal Leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 text-xs sm:text-sm rounded-xl"
            />
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-5 text-xs font-semibold rounded-xl shadow-xs"
            >
              Confirm Day Off
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDayOffDialog;
