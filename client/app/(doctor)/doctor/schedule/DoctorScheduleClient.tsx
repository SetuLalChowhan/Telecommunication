"use client";

import React, { useState } from "react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { AvailabilitySlot } from "@/lib/doctor-mock-data";
import { DoctorAvailabilityTable } from "@/components/dashboard/doctor/DoctorAvailabilityTable";
import { DoctorDaysOffCalendar, DayOffItem } from "@/components/dashboard/doctor/DoctorDaysOffCalendar";
import { AddWeeklySlotDialog } from "@/components/dashboard/shared/AddWeeklySlotDialog";
import { EditWeeklySlotDialog } from "@/components/dashboard/shared/EditWeeklySlotDialog";
import {
  useMyDoctorSchedule,
  useCreateAvailabilitySlot,
  useUpdateAvailabilitySlot,
  useDeleteAvailabilitySlot,
  useMyDoctorDaysOff,
  useCreateDoctorDayOff,
  useDeleteDoctorDayOff,
} from "@/features/doctors/api/queries";
import { DoctorDayOff } from "@/features/doctors/types";
import { to24Hour } from "@/lib/time-utils";
import { toast } from "react-toastify";

function adaptDayOff(d: DoctorDayOff): DayOffItem {
  const dateObj = new Date(d.date);
  const formatted = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : d.date;

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
    <DoctorLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/70">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Availability & Leave Schedule
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              Configure your regular consultation hours and manage planned leaves.
            </p>
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
    </DoctorLayout>
  );
}

export default DoctorScheduleClient;
