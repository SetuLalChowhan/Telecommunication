"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Loader2 } from "lucide-react";

const addDayOffSchema = z.object({
  reason: z.string().min(2, "Please enter a valid reason for absence"),
});

type AddDayOffFormValues = z.infer<typeof addDayOffSchema>;

interface AddDayOffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  onAddDayOff: (dateStr: string, reason: string) => void;
  isLoading?: boolean;
}

export const AddDayOffDialog: React.FC<AddDayOffDialogProps> = ({
  open,
  onOpenChange,
  selectedDate,
  onAddDayOff,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDayOffFormValues>({
    resolver: zodResolver(addDayOffSchema),
    defaultValues: {
      reason: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ reason: "" });
    }
  }, [open, reset]);

  const formattedDisplayDate =
    selectedDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) || "Selected Date";

  const onSubmit = (data: AddDayOffFormValues) => {
    const targetDate = selectedDate || new Date();
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const isoDate = `${year}-${month}-${day}`;

    onAddDayOff(isoDate, data.reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && onOpenChange(val)}>
      <DialogContent className="max-w-[440px] p-6 sm:p-7">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-lg font-bold text-foreground">
            Schedule Day Off
          </DialogTitle>
          <DialogDescription className="text-xs text-secondary-text mt-1">
            Mark this date as unavailable for patient bookings.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="day-off-date">Selected Date</Label>
            <Input
              id="day-off-date"
              disabled
              value={formattedDisplayDate}
              className="h-10 text-xs sm:text-sm bg-muted/40 font-medium rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="day-off-reason">Reason for Absence</Label>
            <Input
              id="day-off-reason"
              placeholder="e.g. Clinical Conference, Vacation, Personal Leave"
              disabled={isLoading}
              className={`h-10 text-xs sm:text-sm rounded-xl ${
                errors.reason ? "border-error focus-visible:ring-error" : ""
              }`}
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-xs text-error font-medium">{errors.reason.message}</p>
            )}
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
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
                  <span>Scheduling...</span>
                </>
              ) : (
                "Confirm Day Off"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDayOffDialog;
