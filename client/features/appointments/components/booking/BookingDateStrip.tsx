"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toDateInputValue, type BookingDayItem } from "@/lib/time";

/**
 * One day in the booking strip.
 *
 * Structurally identical to `BookingDayItem`, which the server builds with
 * `buildBookingDateStrip()` so both render passes agree exactly.
 */
export type DayItem = BookingDayItem;

interface BookingDateStripProps {
  days: DayItem[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  isCalendarOpen: boolean;
  onCalendarOpenChange: (open: boolean) => void;
  isDateDisabled?: (date: Date) => boolean;
}

export const BookingDateStrip: React.FC<BookingDateStripProps> = ({
  days,
  selectedDate,
  onSelectDate,
  isCalendarOpen,
  onCalendarOpenChange,
  isDateDisabled,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // App-timezone day key, so the comparison cannot drift between the server and
  // client passes (`getFullYear()`/`getDate()` use the host zone).
  const selectedDateStr = toDateInputValue(selectedDate);

  // Earliest selectable day is the first day of the server-built strip, which
  // keeps the calendar deterministic instead of re-reading the clock.
  const minDate = days[0]?.date ?? selectedDate;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Select date
        </label>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Popover open={isCalendarOpen} onOpenChange={onCalendarOpenChange}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs rounded-lg gap-1 border-border/80"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Pick date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0 rounded-xl">
              <Calendar
                selected={selectedDate}
                onSelect={(d) => {
                  if (d) {
                    onSelectDate(d);
                    onCalendarOpenChange(false);
                  }
                }}
                minDate={minDate}
                isDateDisabled={isDateDisabled}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x"
      >
        {days.map((item) => {
          const isSelected = item.dateString === selectedDateStr;
          const isDisabled = isDateDisabled ? isDateDisabled(item.date) : false;

          return (
            <button
              key={item.dateString}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(item.date)}
              className={`relative flex flex-col items-center justify-center min-w-[62px] py-2.5 px-2 rounded-lg border text-xs transition-colors snap-start shrink-0 ${
                isDisabled
                  ? "bg-muted/30 border-dashed border-border/60 text-muted-foreground/40 cursor-not-allowed pointer-events-none opacity-50"
                  : isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card hover:bg-muted/60 border-border text-foreground hover:border-primary/50 cursor-pointer"
              }`}
            >
              <span className={`text-[10px] font-semibold ${isSelected ? "text-primary-foreground/80" : isDisabled ? "text-muted-foreground/40" : "text-muted-foreground"}`}>
                {item.isToday ? "Today" : item.dayName}
              </span>
              <span className="text-base font-semibold my-0.5">{item.dayNum}</span>
              <span className={`text-[10px] ${isSelected ? "text-primary-foreground/80" : isDisabled ? "text-muted-foreground/40" : "text-muted-foreground"}`}>
                {item.monthName}
              </span>
              {!isDisabled && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
