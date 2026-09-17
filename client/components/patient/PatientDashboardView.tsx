"use client";

import React, { useState } from "react";
import {
  PATIENT_RECENT_APPOINTMENTS,
  DashboardAppointment,
} from "@/lib/dashboard-mock-data";
import { PatientNextConsultation } from "@/components/dashboard/patient/PatientNextConsultation";
import { PatientQuickActions } from "@/components/dashboard/patient/PatientQuickActions";
import { PatientAppointmentsTable } from "@/components/dashboard/patient/PatientAppointmentsTable";
import { AppointmentDetailsDialog } from "@/components/dashboard/shared/AppointmentDetailsDialog";

interface PatientDashboardViewProps {
  patientName?: string | null;
  isLoading?: boolean;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<DashboardAppointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recentAppointments, setRecentAppointments] = useState(PATIENT_RECENT_APPOINTMENTS);

  const upcoming = recentAppointments.find(
    (a) => (a.status === "CONFIRMED" || a.status === "PENDING") && a.isToday
  ) || recentAppointments.find((a) => a.status === "CONFIRMED" || a.status === "PENDING");

  const handleOpenDetails = (appt: DashboardAppointment) => {
    setSelectedAppointment(appt);
    setDialogOpen(true);
  };

  const handleCancelAppointment = (id: string) => {
    setRecentAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" as const } : a))
    );
  };

  return (
    <div className="space-y-8 sm:space-y-10 max-w-6xl mx-auto">
      {/* 1. Upcoming Consultation Surface */}
      <PatientNextConsultation
        appointment={upcoming}
        onOpenDetails={handleOpenDetails}
      />

      {/* 2. Purposeful Quick Booking Action */}
      <PatientQuickActions />

      {/* 3. Recent Appointments Table */}
      <PatientAppointmentsTable
        appointments={recentAppointments}
        onOpenDetails={handleOpenDetails}
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCancelAppointment={handleCancelAppointment}
      />
    </div>
  );
};

export default PatientDashboardView;
