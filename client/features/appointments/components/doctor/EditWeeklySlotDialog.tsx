"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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

const editSlotSchema = z
  .object({
    dayOfWeek: z.enum(DAYS_OF_WEEK),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    consultationDuration: z.string().min(1, "Duration is required"),
    isActive: z.boolean(),
  })
  .refine((data) => to24Hour(data.startTime) < to24Hour(data.endTime), {
    message: "End time must be later than start time",
    path: ["endTime"],
  });

type EditSlotFormValues = z.infer<typeof editSlotSchema>;

interface EditWeeklySlotDialogProps {
  slot: AvailabilitySlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSlot: (slot: AvailabilitySlot) => void;
  isLoading?: boolean;
}

export const EditWeeklySlotDialog: React.FC<EditWeeklySlotDialogProps> = ({
  slot,
  open,
  onOpenChange,
  onUpdateSlot,
  isLoading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditSlotFormValues>({
    resolver: zodResolver(editSlotSchema),
    defaultValues: {
      dayOfWeek: "MONDAY",
      startTime: "09:00",
      endTime: "13:00",
      consultationDuration: "30",
      isActive: true,
    },
  });

  useEffect(() => {
    if (slot) {
      reset({
        dayOfWeek: (slot.dayOfWeek as any) || "MONDAY",
        startTime: to24Hour(slot.startTime),
        endTime: to24Hour(slot.endTime),
        consultationDuration: String(slot.consultationDuration || 30),
        isActive: slot.isActive ?? true,
      });
    }
  }, [slot, reset]);

  const onSubmit = (data: EditSlotFormValues) => {
    if (!slot) return;

    const formattedStart = to24Hour(data.startTime);
    const formattedEnd = to24Hour(data.endTime);

    const updatedSlot: AvailabilitySlot = {
      ...slot,
      dayOfWeek: data.dayOfWeek,
      startTime: formattedStart,
      endTime: formattedEnd,
      consultationDuration: parseInt(data.consultationDuration, 10) || 30,
      isActive: data.isActive,
    };

    onUpdateSlot(updatedSlot);
  };

  const handleOpenChange = (val: boolean) => {
    if (!isLoading) {
      onOpenChange(val);
    }
  };

  if (!slot) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Edit availability window</DialogTitle>
          <DialogDescription>
            Update consultation hours for {slot.dayOfWeek.toLowerCase()}s.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <DialogBody>
          {/* Day of week */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-day-select">Day of week</Label>
            <Controller
              name="dayOfWeek"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="edit-day-select" className="h-9 rounded-md text-sm">
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
              <Label htmlFor="edit-start-time">Start time</Label>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger id="edit-start-time" className="h-9 rounded-md text-sm">
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
              <Label htmlFor="edit-end-time">End time</Label>
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
                      id="edit-end-time"
                      className={`h-9 rounded-md text-sm ${
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
            <p className="text-[11px] font-medium text-error">
              {errors.endTime.message}
            </p>
          )}

          {/* Slot duration */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-duration-select">Slot duration</Label>
            <Controller
              name="consultationDuration"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger id="edit-duration-select" className="h-9 rounded-md text-sm">
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

          {/* Active / inactive switch */}
          <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 p-3">
            <div className="space-y-0.5">
              <Label htmlFor="edit-is-active" className="cursor-pointer text-xs font-semibold text-foreground">
                Window status
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Disabled windows do not generate bookable patient slots.
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="edit-is-active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              )}
            />
          </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={() => handleOpenChange(false)}
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
                  <span>Saving…</span>
                </>
              ) : (
                "Update availability"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWeeklySlotDialog;
