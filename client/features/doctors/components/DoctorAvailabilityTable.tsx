"use client";

import React from "react";
import { Trash2, Edit2, Clock, Plus, Loader2 } from "lucide-react";
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
import { to12Hour } from "@/lib/time";

interface DoctorAvailabilityTableProps {
  slots: AvailabilitySlot[];
  isLoading?: boolean;
  updatingSlotId?: string | null;
  deletingSlotId?: string | null;
  onToggleSlot: (id: string) => void;
  onDeleteSlot: (id: string) => void;
  onEditSlot?: (slot: AvailabilitySlot) => void;
  onOpenAddModal?: () => void;
}

export const DoctorAvailabilityTable: React.FC<DoctorAvailabilityTableProps> = ({
  slots,
  isLoading = false,
  updatingSlotId = null,
  deletingSlotId = null,
  onToggleSlot,
  onDeleteSlot,
  onEditSlot,
  onOpenAddModal,
}) => {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          Weekly recurring schedule
        </h2>

        {onOpenAddModal && (
          <Button
            size="sm"
            onClick={onOpenAddModal}
            className="h-9 px-3.5 rounded-lg text-xs font-semibold gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add slot</span>
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-muted/40 border-b border-border/60">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-3 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Day of Week
                </TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Consultation Hours
                </TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Slot Length
                </TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Availability Status
                </TableHead>
                <TableHead className="py-3 px-6 text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell className="py-4 px-6">
                      <div className="h-4 w-24 bg-muted rounded" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="h-4 w-32 bg-muted rounded" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="h-4 w-28 bg-muted rounded" />
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="h-5 w-20 bg-muted rounded-full" />
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <div className="h-8 w-16 bg-muted rounded-lg ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : slots.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-xs sm:text-sm text-secondary-text"
                  >
                    No recurring availability slots configured yet. Click &quot;Add Slot&quot; above to set your hours.
                  </TableCell>
                </TableRow>
              ) : (
                slots.map((slot) => {
                  const isUpdatingThis = updatingSlotId === slot.id;
                  const isDeletingThis = deletingSlotId === slot.id;

                  return (
                    <TableRow
                      key={slot.id}
                      className={`transition-colors hover:bg-muted/40 ${
                        !slot.isActive ? "opacity-60 bg-muted/20" : ""
                      }`}
                    >
                      <TableCell className="py-3.5 px-6 font-bold text-sm text-foreground">
                        <span className="text-primary font-semibold">{slot.dayOfWeek}</span>
                      </TableCell>

                      <TableCell className="py-3.5 px-4 font-semibold text-sm text-foreground">
                        {to12Hour(slot.startTime)} – {to12Hour(slot.endTime)}
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
                            disabled={isUpdatingThis || isDeletingThis}
                            onCheckedChange={() => onToggleSlot(slot.id)}
                            aria-label={`Toggle availability for ${slot.dayOfWeek}`}
                          />
                          {isUpdatingThis ? (
                            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-primary animate-pulse">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Saving...</span>
                            </span>
                          ) : (
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase ${
                                slot.isActive
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}
                            >
                              {slot.isActive ? "Active" : "Disabled"}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onEditSlot && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isUpdatingThis || isDeletingThis}
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
                            disabled={isUpdatingThis || isDeletingThis}
                            onClick={() => onDeleteSlot(slot.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            aria-label={`Delete slot for ${slot.dayOfWeek}`}
                          >
                            {isDeletingThis ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-destructive" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Responsive Stacked Cards */}
        <div className="md:hidden divide-y divide-border/60">
          {slots.map((slot) => {
            const isUpdatingThis = updatingSlotId === slot.id;
            const isDeletingThis = deletingSlotId === slot.id;

            return (
              <div
                key={slot.id}
                className={`p-4 space-y-3 transition-colors ${
                  !slot.isActive ? "opacity-60 bg-muted/20" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-primary font-semibold text-sm block">
                      {slot.dayOfWeek}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {to12Hour(slot.startTime)} – {to12Hour(slot.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={slot.isActive}
                      disabled={isUpdatingThis || isDeletingThis}
                      onCheckedChange={() => onToggleSlot(slot.id)}
                      aria-label={`Toggle availability for ${slot.dayOfWeek}`}
                    />
                    {isUpdatingThis ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-primary">
                        <Loader2 className="h-3 w-3 animate-spin" />
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
                          slot.isActive
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {slot.isActive ? "Active" : "Off"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs text-secondary-text">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {slot.consultationDuration} mins / visit
                  </span>

                  <div className="flex items-center gap-1">
                    {onEditSlot && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isUpdatingThis || isDeletingThis}
                        onClick={() => onEditSlot(slot)}
                        className="h-8 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Edit2 className="h-3.5 w-3.5 mr-1" />
                        <span>Edit</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isUpdatingThis || isDeletingThis}
                      onClick={() => onDeleteSlot(slot.id)}
                      className="h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      {isDeletingThis ? (
                        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin text-destructive" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                      )}
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailabilityTable;
