"use client";

import React, { useState } from "react";
import {
  DOCTOR_TODAY_SCHEDULE,
  DoctorScheduleItem,
  DashboardAppointment,
} from "@/lib/dashboard-mock-data";
import { MOCK_AVAILABILITY_SLOTS, AvailabilitySlot } from "@/lib/doctor-mock-data";
import { DoctorNextConsultation } from "@/components/dashboard/doctor/DoctorNextConsultation";
import { DoctorTodayScheduleTable } from "@/components/dashboard/doctor/DoctorTodayScheduleTable";
import { DoctorAvailabilityTable } from "@/components/dashboard/doctor/DoctorAvailabilityTable";
import { DoctorDaysOffCalendar, DayOffItem } from "@/components/dashboard/doctor/DoctorDaysOffCalendar";
import { AppointmentDetailsDialog } from "@/components/dashboard/shared/AppointmentDetailsDialog";
import { AddWeeklySlotDialog } from "@/components/dashboard/shared/AddWeeklySlotDialog";
import { EditWeeklySlotDialog } from "@/components/dashboard/shared/EditWeeklySlotDialog";

interface DoctorDashboardViewProps {
  doctorName?: string | null;
  isVerified?: boolean;
  isLoading?: boolean;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = () => {
  const [schedule, setSchedule] = useState<DoctorScheduleItem[]>(DOCTOR_TODAY_SCHEDULE);
  const [slots, setSlots] = useState<AvailabilitySlot[]>(MOCK_AVAILABILITY_SLOTS);
  const [daysOff, setDaysOff] = useState<DayOffItem[]>([
    { id: "do-1", date: "2026-09-25", formatted: "Sep 25, 2026", reason: "Annual Cardiology Symposium" },
    { id: "do-2", date: "2026-10-04", formatted: "Oct 04, 2026", reason: "Hospital Training Leave" },
  ]);

  const [selectedAppt, setSelectedAppt] = useState<DashboardAppointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addSlotOpen, setAddSlotOpen] = useState(false);
  const [editSlotOpen, setEditSlotOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);

  const nextAppointment = schedule.find(
    (s) => s.status === "CONFIRMED" || s.status === "PENDING"
  );

  const handleMarkComplete = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "COMPLETED" as const } : item
      )
    );
  };

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
    <div className="space-y-8 sm:space-y-10 max-w-6xl mx-auto">
      {/* 1. Next Live Consultation Surface */}
      <DoctorNextConsultation
        appointment={nextAppointment}
        onMarkComplete={handleMarkComplete}
      />

      {/* 2. Today's Consultations Queue (shadcn Table) */}
      <DoctorTodayScheduleTable
        schedule={schedule}
        onMarkComplete={handleMarkComplete}
      />

      {/* 3. Weekly Availability Schedule (Table Layout with shadcn Switch Toggle) */}
      <DoctorAvailabilityTable
        slots={slots}
        onToggleSlot={handleToggleSlot}
        onDeleteSlot={handleDeleteSlot}
        onEditSlot={handleOpenEditSlot}
        onOpenAddModal={() => setAddSlotOpen(true)}
      />

      {/* 4. Planned Days Off & Vacation (Calendar Picker & Leave Manager) */}
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

      {/* Appointment Details Modal */}
      <AppointmentDetailsDialog
        appointment={selectedAppt}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        isDoctorView={true}
      />
    </div>
  );
};

export default DoctorDashboardView;
