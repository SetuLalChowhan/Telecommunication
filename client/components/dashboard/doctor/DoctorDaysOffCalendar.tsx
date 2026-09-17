"use client";

import React, { useState } from "react";
import { CalendarOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { AddDayOffDialog } from "@/components/dashboard/shared/AddDayOffDialog";
import { DeleteDayOffDialog } from "@/components/dashboard/shared/DeleteDayOffDialog";

export interface DayOffItem {
  id: string;
  date: string;
  formatted: string;
  reason: string;
}

interface DoctorDaysOffCalendarProps {
  daysOff: DayOffItem[];
  onAddDayOff: (dateStr: string, reason: string) => void;
  onRemoveDayOff: (id: string) => void;
}

export const DoctorDaysOffCalendar: React.FC<DoctorDaysOffCalendarProps> = ({
  daysOff,
  onAddDayOff,
  onRemoveDayOff,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dayOffToDelete, setDayOffToDelete] = useState<DayOffItem | null>(null);

  const handleConfirmDelete = () => {
    if (!dayOffToDelete) return;
    onRemoveDayOff(dayOffToDelete.id);
    setDayOffToDelete(null);
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          Planned Days Off & Vacation
        </h2>
        <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
          Select any future date on the calendar to mark yourself as unavailable.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Picker Panel */}
        <div className="lg:col-span-6 rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col items-center justify-center">
          <Calendar
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            className="w-full max-w-sm"
          />
          <div className="w-full pt-4 mt-2 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-semibold text-foreground">
              Selected: {selectedDate?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) || "None"}
            </span>
            <Button
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="h-8.5 px-3 rounded-lg text-xs font-semibold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Mark Date as Day Off</span>
            </Button>
          </div>
        </div>

        {/* Existing Days Off List */}
        <div className="lg:col-span-6 rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <CalendarOff className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-bold text-foreground">
                Scheduled Days Off
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">{daysOff.length} planned</span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {daysOff.length > 0 ? (
              daysOff.map((day) => (
                <div
                  key={day.id}
                  className="p-3.5 rounded-xl border border-border/60 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-foreground">{day.formatted}</p>
                    <p className="text-xs text-muted-foreground">{day.reason}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDayOffToDelete(day)}
                    className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 font-medium gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No upcoming days off scheduled.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Day Off Dialog */}
      <AddDayOffDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        selectedDate={selectedDate}
        onAddDayOff={onAddDayOff}
      />

      {/* Remove Day Off Alert Dialog */}
      <DeleteDayOffDialog
        open={!!dayOffToDelete}
        onOpenChange={(open) => !open && setDayOffToDelete(null)}
        dayOffDate={dayOffToDelete?.formatted}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
};

export default DoctorDaysOffCalendar;
