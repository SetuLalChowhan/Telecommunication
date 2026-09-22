"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
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
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Schedule a day off</DialogTitle>
          <DialogDescription>
            Mark this date as unavailable for patient bookings.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <DialogBody>
          <div className="space-y-1.5">
            <Label htmlFor="day-off-date">Selected date</Label>
            <Input
              id="day-off-date"
              disabled
              value={formattedDisplayDate}
              className="h-9 rounded-md bg-muted/50 text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="day-off-reason">Reason for absence</Label>
            <Input
              id="day-off-reason"
              placeholder="e.g. Clinical conference, vacation"
              disabled={isLoading}
              aria-invalid={Boolean(errors.reason)}
              className={`h-9 rounded-md text-sm ${
                errors.reason ? "border-error focus-visible:ring-error" : ""
              }`}
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-[11px] font-medium text-error">
                {errors.reason.message}
              </p>
            )}
          </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
              className="h-8 rounded-md px-3 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="h-8 rounded-md px-3 text-xs font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Scheduling…</span>
                </>
              ) : (
                "Confirm day off"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDayOffDialog;
