"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
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

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const addSlotSchema = z
  .object({
    dayOfWeek: z.enum(DAYS_OF_WEEK),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    consultationDuration: z.string().min(1, "Duration is required"),
  })
  .refine((data) => to24Hour(data.startTime) < to24Hour(data.endTime), {
    message: "End time must be later than start time",
    path: ["endTime"],
  });

type AddSlotFormValues = z.infer<typeof addSlotSchema>;

interface AddWeeklySlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSlot: (slot: AvailabilitySlot) => void;
  isLoading?: boolean;
}

export const AddWeeklySlotDialog: React.FC<AddWeeklySlotDialogProps> = ({
  open,
  onOpenChange,
  onAddSlot,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddSlotFormValues>({
    resolver: zodResolver(addSlotSchema),
    defaultValues: {
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "13:00",
      consultationDuration: "30",
    },
  });

  const onSubmit = (data: AddSlotFormValues) => {
    const formattedStart = to24Hour(data.startTime);
    const formattedEnd = to24Hour(data.endTime);

    const newSlot: AvailabilitySlot = {
      id: `slot-${Date.now()}`,
      dayOfWeek: data.dayOfWeek,
      startTime: formattedStart,
      endTime: formattedEnd,
      consultationDuration: parseInt(data.consultationDuration, 10) || 30,
      isActive: true,
    };

    onAddSlot(newSlot);
  };

  const handleOpenChange = (val: boolean) => {
    if (!isLoading) {
      if (!val) reset();
      onOpenChange(val);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px] p-6 sm:p-7">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-foreground">
            Add Availability Window
          </DialogTitle>
          <DialogDescription className="text-xs text-secondary-text mt-1">
            Set your recurring consultation hours for a specific day of the week.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Day of Week */}
          <div className="space-y-1.5">
            <Label htmlFor="day-select">Day of Week</Label>
            <Controller
              name="dayOfWeek"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
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
              )}
            />
          </div>

          {/* Start & End Times */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="start-time">Start Time</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
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
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end-time">End Time</Label>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="end-time"
                      className={`h-10 text-xs sm:text-sm rounded-xl ${
                        errors.endTime ? "border-error focus:ring-error" : ""
                      }`}
                    >
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
                )}
              />
            </div>
          </div>
          {errors.endTime && (
            <p className="text-xs text-error font-medium">{errors.endTime.message}</p>
          )}

          {/* Consultation Duration */}
          <div className="space-y-1.5">
            <Label htmlFor="duration-select">Slot Duration</Label>
            <Controller
              name="consultationDuration"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="duration-select" className="h-10 text-xs sm:text-sm rounded-xl">
                    <SelectValue placeholder="Slot duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15" className="text-xs">15 minutes / patient</SelectItem>
                    <SelectItem value="20" className="text-xs">20 minutes / patient</SelectItem>
                    <SelectItem value="30" className="text-xs">30 minutes / patient</SelectItem>
                    <SelectItem value="45" className="text-xs">45 minutes / patient</SelectItem>
                    <SelectItem value="60" className="text-xs">60 minutes / patient</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <DialogFooter className="mt-6 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleOpenChange(false)}
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
                  <span>Adding Slot...</span>
                </>
              ) : (
                "Save Availability"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWeeklySlotDialog;
