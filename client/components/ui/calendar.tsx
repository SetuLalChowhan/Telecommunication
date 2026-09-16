"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  selected,
  onSelect,
  minDate = new Date(),
  className,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date()
  );

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const startDayOfWeek = startOfMonth.getDay(); // 0 = Sun, 1 = Mon, ...
  const daysInMonth = endOfMonth.getDate();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Normalize minDate to start of day for accurate comparison
  const normalizedMinDate = new Date(minDate);
  normalizedMinDate.setHours(0, 0, 0, 0);

  return (
    <div className={cn("p-2 space-y-3 w-64 select-none", className)}>
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-bold text-foreground">{monthLabel}</h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="h-7 w-7 rounded-lg border border-border hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
            aria-label="Previous Month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="h-7 w-7 rounded-lg border border-border hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
            aria-label="Next Month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((d) => (
          <span key={d} className="text-[11px] font-semibold text-secondary-text">
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Leading blanks */}
        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <span key={`blank-${i}`} className="h-7 w-7" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            dayNum
          );
          dayDate.setHours(0, 0, 0, 0);

          const isPast = dayDate < normalizedMinDate;
          const isSelected =
            selected &&
            selected.getFullYear() === dayDate.getFullYear() &&
            selected.getMonth() === dayDate.getMonth() &&
            selected.getDate() === dayDate.getDate();

          const isToday =
            new Date().toDateString() === dayDate.toDateString();

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              disabled={isPast}
              onClick={() => onSelect?.(dayDate)}
              className={cn(
                "h-7 w-7 rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer",
                isPast && "text-muted-foreground/40 cursor-not-allowed pointer-events-none",
                !isPast && !isSelected && "hover:bg-primary/10 hover:text-primary text-foreground",
                isSelected && "bg-primary text-white font-bold shadow-xs",
                isToday && !isSelected && "border border-primary/40 font-bold text-primary"
              )}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
