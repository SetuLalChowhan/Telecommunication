"use client";

import React from "react";
import { Trash2, Edit2, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvailabilitySlot } from "@/lib/doctor-mock-data";

interface DoctorAvailabilityTableProps {
  slots: AvailabilitySlot[];
  onToggleSlot: (id: string) => void;
  onDeleteSlot: (id: string) => void;
  onEditSlot?: (slot: AvailabilitySlot) => void;
  onOpenAddModal?: () => void;
}

export const DoctorAvailabilityTable: React.FC<DoctorAvailabilityTableProps> = ({
  slots,
  onToggleSlot,
  onDeleteSlot,
  onEditSlot,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Weekly Recurring Schedule
          </h2>
          <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
            Patients can only book consultations during your active days and hours.
          </p>
        </div>

        {onOpenAddModal && (
          <Button
            size="sm"
            onClick={onOpenAddModal}
            className="h-9 px-3.5 rounded-xl text-xs sm:text-sm font-semibold gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Slot</span>
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-slate-50/70 dark:bg-slate-900/50">
            <TableRow>
              <TableHead className="py-3.5 px-5 font-semibold text-xs sm:text-sm">Day of Week</TableHead>
              <TableHead className="py-3.5 px-4 font-semibold text-xs sm:text-sm">Consultation Hours</TableHead>
              <TableHead className="py-3.5 px-4 font-semibold text-xs sm:text-sm">Slot Length</TableHead>
              <TableHead className="py-3.5 px-4 font-semibold text-xs sm:text-sm">Availability Status</TableHead>
              <TableHead className="py-3.5 px-5 text-right font-semibold text-xs sm:text-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot) => (
              <TableRow
                key={slot.id}
                className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30 ${
                  !slot.isActive ? "opacity-60 bg-muted/20" : ""
                }`}
              >
                <TableCell className="py-4 px-5 font-bold text-sm text-foreground">
                  <span className="text-primary font-bold">{slot.dayOfWeek}</span>
                </TableCell>

                <TableCell className="py-4 px-4 font-semibold text-sm text-foreground">
                  {slot.startTime} – {slot.endTime}
                </TableCell>

                <TableCell className="py-4 px-4 text-xs sm:text-sm text-secondary-text">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {slot.consultationDuration} mins / visit
                  </span>
                </TableCell>

                <TableCell className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={slot.isActive}
                      onCheckedChange={() => onToggleSlot(slot.id)}
                      aria-label={`Toggle availability for ${slot.dayOfWeek}`}
                    />
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border uppercase ${
                        slot.isActive
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {slot.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onEditSlot && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditSlot(slot)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        aria-label={`Edit slot for ${slot.dayOfWeek}`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSlot(slot.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      aria-label={`Delete slot for ${slot.dayOfWeek}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorAvailabilityTable;
