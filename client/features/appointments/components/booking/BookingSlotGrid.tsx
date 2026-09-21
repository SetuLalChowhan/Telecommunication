"use client";

import React from "react";
import { Clock, Loader2, AlertCircle } from "lucide-react";
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

interface BookingSlotGridProps {
  slots: AvailableSlotItem[];
  selectedSlot: AvailableSlotItem | null;
  onSelectSlot: (slot: AvailableSlotItem) => void;
  isLoading: boolean;
}

export const BookingSlotGrid: React.FC<BookingSlotGridProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading,
}) => {
  return (
    <div className="space-y-2.5">
      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
        <span>Available Time Slots</span>
        {!isLoading && slots.length > 0 && (
          <span className="text-[11px] font-semibold text-primary lowercase">
            {slots.length} available
          </span>
        )}
      </label>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 rounded-2xl bg-muted/40 border border-border/60">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground ml-2 font-medium">
            Fetching available slots...
          </span>
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 px-4 text-center rounded-2xl bg-muted/40 border border-border/60">
          <AlertCircle className="h-5 w-5 text-muted-foreground/80 mb-1.5" />
          <p className="text-xs font-semibold text-foreground">No slots available on this date</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            The doctor is off or all consultation slots are booked. Please select another date.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 max-h-[190px] overflow-y-auto pr-1">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.slotStart === slot.slotStart;
            return (
              <button
                key={slot.slotStart}
                type="button"
                onClick={() => onSelectSlot(slot)}
                className={`flex items-center justify-center py-2 px-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-card hover:bg-muted/60 border-border/80 text-foreground"
                }`}
              >
                <Clock className="h-3 w-3 mr-1 opacity-70" />
                <span>{format12Hour(slot.startTime)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
