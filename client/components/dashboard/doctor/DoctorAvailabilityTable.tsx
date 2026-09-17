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
    <div className="space-y-3.5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Weekly Recurring Schedule
        </h2>

        {onOpenAddModal && (
          <Button
            size="sm"
            onClick={onOpenAddModal}
            className="h-8.5 px-3.5 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Slot</span>
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-border/60">
            <TableRow className="hover:bg-transparent">
              <TableHead className="py-3 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Day of Week</TableHead>
              <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Consultation Hours</TableHead>
              <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Slot Length</TableHead>
              <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Availability Status</TableHead>
              <TableHead className="py-3 px-6 text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/40">
            {slots.map((slot) => (
              <TableRow
                key={slot.id}
                className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30 ${!slot.isActive ? "opacity-60 bg-muted/20" : ""
                  }`}
              >
                <TableCell className="py-3.5 px-6 font-bold text-sm text-foreground">
                  <span className="text-primary font-bold">{slot.dayOfWeek}</span>
                </TableCell>

                <TableCell className="py-3.5 px-4 font-semibold text-sm text-foreground">
                  {slot.startTime} – {slot.endTime}
                </TableCell>

                <TableCell className="py-3.5 px-4 text-xs sm:text-sm text-secondary-text">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {slot.consultationDuration} mins / visit
                  </span>
                </TableCell>

                <TableCell className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={slot.isActive}
                      onCheckedChange={() => onToggleSlot(slot.id)}
                      aria-label={`Toggle availability for ${slot.dayOfWeek}`}
                    />
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase ${slot.isActive
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-border"
                        }`}
                    >
                      {slot.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-3.5 px-6 text-right">
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
