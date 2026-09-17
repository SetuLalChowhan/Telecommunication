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
import { CalendarOff } from "lucide-react";

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
      <DialogContent className="sm:max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-1.5 pb-2">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1">
            <CalendarOff className="h-5 w-5" />
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">Schedule Day Off</DialogTitle>
          <DialogDescription className="text-xs text-secondary-text">
            Mark this date as unavailable for patient bookings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Selected Date</Label>
            <Input
              disabled
              value={formattedDate}
              className="h-10 text-xs sm:text-sm rounded-xl bg-muted/40 font-medium border-border/70"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Reason for Absence</Label>
            <Input
              placeholder="e.g. Clinical Conference, Vacation, Personal Leave"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-10 text-xs sm:text-sm rounded-xl"
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
            <Button type="submit" className="h-9.5 px-5 rounded-xl text-xs font-semibold shadow-xs">
              Confirm Day Off
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDayOffDialog;
