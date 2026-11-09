"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { AvailabilitySlot } from "@/features/doctors/types";
import { DoctorAvailabilityTable, DoctorDaysOffCalendar, DayOffItem } from "@/features/doctors";
import { AddWeeklySlotDialog, EditWeeklySlotDialog } from "@/features/appointments/components";
import {
  useDoctorDashboard,
  useToggleAvailabilityVisibility,
  useMyDoctorSchedule,
  useCreateAvailabilitySlot,
  useUpdateAvailabilitySlot,
  useDeleteAvailabilitySlot,
  useMyDoctorDaysOff,
  useCreateDoctorDayOff,
  useDeleteDoctorDayOff,
} from "@/features/doctors/api/queries";
import { DoctorDayOff } from "@/features/doctors/types";
import { to24Hour } from "@/lib/time";
import { toast } from "react-toastify";
import { PageHeader } from "@/components/layout";
import { formatDateOnly } from "@/lib/time";

function adaptDayOff(d: DoctorDayOff): DayOffItem {
  // App-timezone, because day-off rows are server-rendered from hydrated data.
  const formatted = formatDateOnly(d.date, d.date);

  return {
    id: d.id,
    date: d.date,
    formatted,
    reason: d.reason || "Planned Day Off",
  };
}

function adaptSlot(slot: any): AvailabilitySlot {
  return {
    id: slot.id,
    dayOfWeek: String(slot.dayOfWeek),
    startTime: slot.startTime,
    endTime: slot.endTime,
    consultationDuration: slot.consultationDuration || 30,
    isActive: Boolean(slot.isActive),
  };
}

export function DoctorScheduleClient() {
  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const [editSlotOpen, setEditSlotOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  const [updatingSlotId, setUpdatingSlotId] = useState<string | null>(null);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [deletingDayOffId, setDeletingDayOffId] = useState<string | null>(null);

  const { data: rawSlots = [], isLoading: isSlotsLoading } = useMyDoctorSchedule();
  const { data: rawDaysOff = [], isLoading: isDaysOffLoading } = useMyDoctorDaysOff();
  const { data: dashboardData } = useDoctorDashboard();
  const toggleVisibilityMutation = useToggleAvailabilityVisibility();

  const isVisibilityEnabled = dashboardData?.isAvailabilityVisible ?? true;

  const handleToggleVisibility = (nextValue: boolean) => {
    toggleVisibilityMutation.mutate(nextValue, {
      onSuccess: () => {
        toast.success(
          nextValue
            ? "Your availability is now visible to patients for bookings."
            : "Your availability is now hidden from patients. Existing bookings are kept."
        );
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update visibility");
      },
    });
  };

  const createSlotMutation = useCreateAvailabilitySlot();
  const updateSlotMutation = useUpdateAvailabilitySlot();
  const deleteSlotMutation = useDeleteAvailabilitySlot();

  const createDayOffMutation = useCreateDoctorDayOff();
  const deleteDayOffMutation = useDeleteDoctorDayOff();

  const slots = rawSlots.map(adaptSlot);
  const daysOff = rawDaysOff.map(adaptDayOff);

  const handleToggleSlot = (id: string) => {
    const current = slots.find((s) => s.id === id);
    if (!current) return;

    setUpdatingSlotId(id);
    updateSlotMutation.mutate(
      {
        slotId: id,
        data: { isActive: !current.isActive },
      },
      {
        onSuccess: () => {
          toast.success(
            !current.isActive
              ? "Availability slot enabled"
              : "Availability slot disabled"
          );
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update slot status");
        },
        onSettled: () => {
          setUpdatingSlotId(null);
        },
      }
    );
  };

  const handleDeleteSlot = (id: string) => {
    setDeletingSlotId(id);
    deleteSlotMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Availability slot removed");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to delete slot");
      },
      onSettled: () => {
        setDeletingSlotId(null);
      },
    });
  };

  const handleOpenEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setEditSlotOpen(true);
  };

  const handleUpdateSlot = (updatedSlot: AvailabilitySlot) => {
    updateSlotMutation.mutate(
      {
        slotId: updatedSlot.id,
        data: {
          dayOfWeek: updatedSlot.dayOfWeek as any,
          startTime: to24Hour(updatedSlot.startTime),
          endTime: to24Hour(updatedSlot.endTime),
          consultationDuration: updatedSlot.consultationDuration,
          isActive: updatedSlot.isActive,
        },
      },
      {
        onSuccess: () => {
          toast.success("Availability slot updated successfully");
          setEditSlotOpen(false);
          setEditingSlot(null);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update availability slot");
        },
      }
    );
  };

  const handleAddSlot = (newSlot: AvailabilitySlot) => {
    createSlotMutation.mutate(
      {
        dayOfWeek: newSlot.dayOfWeek as any,
        startTime: to24Hour(newSlot.startTime),
        endTime: to24Hour(newSlot.endTime),
        consultationDuration: newSlot.consultationDuration,
        isActive: newSlot.isActive,
      },
      {
        onSuccess: () => {
          toast.success("Availability slot added successfully");
          setAddSlotOpen(false);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to add availability slot");
        },
      }
    );
  };

  const handleAddDayOff = (
    dateStr: string,
    reason: string,
    onSuccess?: () => void
  ) => {
    createDayOffMutation.mutate(
      {
        date: dateStr,
        reason,
      },
      {
        onSuccess: () => {
          toast.success("Day off scheduled successfully");
          onSuccess?.();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to schedule day off");
        },
      }
    );
  };

  const handleRemoveDayOff = (id: string) => {
    setDeletingDayOffId(id);
    deleteDayOffMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Day off removed successfully");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to remove day off");
      },
      onSettled: () => {
        setDeletingDayOffId(null);
      },
    });
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Clinical"
        title="Availability &amp; leaves"
        description="Configure regular consultation hours and manage planned leaves."
      />

      {/* 0. Visibility Control Panel */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              isVisibilityEnabled
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isVisibilityEnabled ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Public Booking Visibility
              </h3>
              <span
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                  isVisibilityEnabled
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                }`}
              >
                {isVisibilityEnabled ? "Visible to Patients" : "Hidden from Patients"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVisibilityEnabled
                ? "Patients can view your available calendar dates and book consultations. Toggle off to temporarily pause new bookings without losing your schedule."
                : "Your schedule is currently hidden. Patients cannot see or book appointment slots. Existing bookings remain active."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:shrink-0 self-end sm:self-center">
          <span className="text-xs font-semibold text-foreground">
            {isVisibilityEnabled ? "Active" : "Paused"}
          </span>
          <Switch
            checked={isVisibilityEnabled}
            disabled={toggleVisibilityMutation.isPending}
            onCheckedChange={(checked) => handleToggleVisibility(checked)}
          />
        </div>
      </div>

      {/* 1. Weekly Consultation Schedule Table */}
      <DoctorAvailabilityTable
        slots={slots}
        isLoading={isSlotsLoading && slots.length === 0}
        updatingSlotId={updatingSlotId}
        deletingSlotId={deletingSlotId}
        onToggleSlot={handleToggleSlot}
        onDeleteSlot={handleDeleteSlot}
        onEditSlot={handleOpenEditSlot}
        onOpenAddModal={() => setAddSlotOpen(true)}
      />

      {/* 2. Planned Days Off Calendar */}
      <DoctorDaysOffCalendar
        daysOff={daysOff}
        isAddingDayOff={createDayOffMutation.isPending}
        deletingDayOffId={deletingDayOffId}
        onAddDayOff={handleAddDayOff}
        onRemoveDayOff={handleRemoveDayOff}
      />

      {/* Add Slot Modal */}
      <AddWeeklySlotDialog
        open={addSlotOpen}
        onOpenChange={setAddSlotOpen}
        onAddSlot={handleAddSlot}
        isLoading={createSlotMutation.isPending}
      />

      {/* Edit Slot Modal */}
      <EditWeeklySlotDialog
        slot={editingSlot}
        open={editSlotOpen}
        onOpenChange={setEditSlotOpen}
        onUpdateSlot={handleUpdateSlot}
        isLoading={updateSlotMutation.isPending && editSlotOpen}
      />
    </div>
  );
}

export default DoctorScheduleClient;
