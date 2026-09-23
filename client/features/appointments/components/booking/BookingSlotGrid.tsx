"use client";

import React from "react";
import { Clock, Loader2, AlertCircle, CalendarOff } from "lucide-react";
import { AvailableSlotItem } from "@/features/patients";

function format12Hour(timeStr: string): string {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  const h = Number(hStr);
  const m = Number(mStr) || 0;
  if (isNaN(h)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

const REASON_LABEL: Record<string, string> = {
  PAST: "Time has passed",
  BOOKED: "Already booked",
};

interface BookingSlotGridProps {
  slots: AvailableSlotItem[];
  selectedSlot: AvailableSlotItem | null;
  onSelectSlot: (slot: AvailableSlotItem) => void;
  isLoading: boolean;
  /** Set when the doctor is off, so the empty state can say so. */
  dayOffReason?: string;
  /** Set when the selected day has no schedule at all. */
  unavailableMessage?: string;
}

export const BookingSlotGrid: React.FC<BookingSlotGridProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading,
  dayOffReason,
  unavailableMessage,
}) => {
  // The API returns the full day, so availability has to be counted, not
  // inferred from the length of the list.
  const availableCount = slots.filter((slot) => slot.isAvailable).length;

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center justify-between">
        <span>Available time slots</span>
        {!isLoading && slots.length > 0 && (
          <span className="text-[11px] font-semibold text-primary lowercase">
            {availableCount} of {slots.length} free
          </span>
        )}
      </label>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 rounded-lg bg-muted/40 border border-border">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground ml-2 font-medium">
            Fetching available slots...
          </span>
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center rounded-lg bg-muted/40 border border-border">
          <CalendarOff className="h-5 w-5 text-muted-foreground/80 mb-1.5" />
          <p className="text-xs font-semibold text-foreground">
            {dayOffReason ? "Doctor is unavailable" : "No slots on this date"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {dayOffReason ||
              unavailableMessage ||
              "Please select another date from the calendar above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-[190px] overflow-y-auto pr-1">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.slotStart === slot.slotStart;
            const isDisabled = !slot.isAvailable;

            if (isDisabled) {
              return (
                <button
                  key={slot.slotStart}
                  type="button"
                  disabled
                  aria-disabled="true"
                  // Native `disabled` blocks pointer events; the title still
                  // explains why the slot is greyed out.
                  title={REASON_LABEL[slot.reason ?? ""] ?? "Unavailable"}
                  className="relative flex items-center justify-center py-2 px-1.5 rounded-lg border border-dashed border-border/70 bg-muted/40 text-xs font-semibold text-muted-foreground/70 cursor-not-allowed line-through decoration-muted-foreground/50"
                >
                  <Clock className="h-3 w-3 mr-1 opacity-40" />
                  <span>{format12Hour(slot.startTime)}</span>
                </button>
              );
            }

            return (
              <button
                key={slot.slotStart}
                type="button"
                onClick={() => onSelectSlot(slot)}
                className={`flex items-center justify-center py-2 px-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-muted/60 border-border text-foreground"
                }`}
              >
                <Clock className="h-3 w-3 mr-1 opacity-70" />
                <span>{format12Hour(slot.startTime)}</span>
              </button>
            );
          })}
        </div>
      )}

      {!isLoading && slots.length > 0 && availableCount < slots.length && (
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>
            Struck-through times are unavailable
            {slots.some((slot) => slot.reason === "BOOKED") && " or already booked"}.
          </span>
        </p>
      )}
    </div>
  );
};
