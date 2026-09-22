"use client";

import React, { useState } from "react";
import { CalendarOff, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { AddDayOffDialog } from "@/features/appointments/components/doctor/AddDayOffDialog";
import { DeleteDayOffDialog } from "@/features/appointments/components/doctor/DeleteDayOffDialog";

export interface DayOffItem {
  id: string;
  date: string;
  formatted: string;
  reason: string;
}

interface DoctorDaysOffCalendarProps {
  daysOff: DayOffItem[];
  isAddingDayOff?: boolean;
  deletingDayOffId?: string | null;
  onAddDayOff: (dateStr: string, reason: string, onSuccess?: () => void) => void;
  onRemoveDayOff: (id: string) => void;
}

export const DoctorDaysOffCalendar: React.FC<DoctorDaysOffCalendarProps> = ({
  daysOff,
  isAddingDayOff = false,
  deletingDayOffId = null,
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

  const handleAddSubmit = (dateStr: string, reason: string) => {
    onAddDayOff(dateStr, reason, () => {
      setAddDialogOpen(false);
    });
  };

  return (
    <section className="space-y-3.5 pt-2">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Planned days off & vacation
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Picker Panel */}
        <div className="lg:col-span-6 rounded-xl border border-border bg-card p-5 flex flex-col items-center justify-center">
          <Calendar
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
            className="w-full max-w-sm"
          />
          <div className="w-full pt-4 mt-2 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-semibold text-foreground">
              Selected:{" "}
              {selectedDate?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }) || "None"}
            </span>
            <Button
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              className="h-9 px-3.5 rounded-lg text-xs font-semibold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Mark date as day off</span>
            </Button>
          </div>
        </div>

        {/* Existing Days Off List */}
        <div className="lg:col-span-6 rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <CalendarOff className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-foreground">
                Scheduled days off
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {daysOff.length} planned
            </span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {daysOff.length > 0 ? (
              daysOff.map((day) => {
                const isDeleting = deletingDayOffId === day.id;

                return (
                  <div
                    key={day.id}
                    className="p-3.5 rounded-lg border border-border bg-muted/40 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        {day.formatted}
                      </p>
                      <p className="text-xs text-muted-foreground">{day.reason}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => setDayOffToDelete(day)}
                      className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 font-medium gap-1"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span>Remove</span>
                    </Button>
                  </div>
                );
              })
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
        onAddDayOff={handleAddSubmit}
        isLoading={isAddingDayOff}
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
