"use client";

import React, { useState } from "react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { MOCK_AVAILABILITY_SLOTS, AvailabilitySlot } from "@/lib/doctor-mock-data";
import { DoctorAvailabilityTable } from "@/components/dashboard/doctor/DoctorAvailabilityTable";
import { DoctorDaysOffCalendar, DayOffItem } from "@/components/dashboard/doctor/DoctorDaysOffCalendar";
import { AddWeeklySlotDialog } from "@/components/dashboard/shared/AddWeeklySlotDialog";
import { EditWeeklySlotDialog } from "@/components/dashboard/shared/EditWeeklySlotDialog";

export default function DoctorSchedulePage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(MOCK_AVAILABILITY_SLOTS);
  const [daysOff, setDaysOff] = useState<DayOffItem[]>([
    { id: "do-1", date: "2026-09-25", formatted: "Sep 25, 2026", reason: "Annual Cardiology Symposium" },
    { id: "do-2", date: "2026-10-04", formatted: "Oct 04, 2026", reason: "Hospital Training Leave" },
  ]);
  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const [editSlotOpen, setEditSlotOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  const handleToggleSlot = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleDeleteSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const handleOpenEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlot(slot);
    setEditSlotOpen(true);
  };

  const handleUpdateSlot = (updatedSlot: AvailabilitySlot) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === updatedSlot.id ? updatedSlot : s))
    );
  };

  const handleAddSlot = (newSlot: AvailabilitySlot) => {
    setSlots((prev) => [...prev, newSlot]);
  };

  const handleAddDayOff = (formattedDate: string, reason: string) => {
    setDaysOff((prev) => [
      ...prev,
      {
        id: `do-${Date.now()}`,
        date: new Date().toISOString(),
        formatted: formattedDate,
        reason,
      },
    ]);
  };

  const handleRemoveDayOff = (id: string) => {
    setDaysOff((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DoctorLayout>
      <div className="space-y-8 sm:space-y-10 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="space-y-1 pb-4 border-b border-border/70">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Availability & Leave Schedule
          </h1>
          <p className="text-sm text-secondary-text">
            Configure your weekly regular consultation hours and manage planned days off.
          </p>
        </div>

        {/* 1. Weekly Consultation Schedule Table */}
        <DoctorAvailabilityTable
          slots={slots}
          onToggleSlot={handleToggleSlot}
          onDeleteSlot={handleDeleteSlot}
          onEditSlot={handleOpenEditSlot}
          onOpenAddModal={() => setAddSlotOpen(true)}
        />

        {/* 2. Planned Days Off Calendar */}
        <DoctorDaysOffCalendar
          daysOff={daysOff}
          onAddDayOff={handleAddDayOff}
          onRemoveDayOff={handleRemoveDayOff}
        />

        {/* Add Slot Modal */}
        <AddWeeklySlotDialog
          open={addSlotOpen}
          onOpenChange={setAddSlotOpen}
          onAddSlot={handleAddSlot}
        />

        {/* Edit Slot Modal */}
        <EditWeeklySlotDialog
          slot={editingSlot}
          open={editSlotOpen}
          onOpenChange={setEditSlotOpen}
          onUpdateSlot={handleUpdateSlot}
        />
      </div>
    </DoctorLayout>
  );
}
