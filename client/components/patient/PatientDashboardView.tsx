"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";
import {
  usePatientDashboard,
  useCancelPatientBooking,
} from "@/features/patients";
import { PatientStatsCards } from "@/components/dashboard/patient/PatientStatsCards";
import { PatientNextConsultation } from "@/components/dashboard/patient/PatientNextConsultation";
import { PatientQuickActions } from "@/components/dashboard/patient/PatientQuickActions";
import { PatientAppointmentsTable } from "@/components/dashboard/patient/PatientAppointmentsTable";
import { AppointmentDetailsDialog } from "@/components/dashboard/shared/AppointmentDetailsDialog";
import { Button } from "@/components/ui/button";

interface PatientDashboardViewProps {
  patientName?: string | null;
  isLoading?: boolean;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = ({
  patientName,
  isLoading: isParentLoading = false,
}) => {
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    isError,
    error,
    refetch,
  } = usePatientDashboard();

  const cancelMutation = useCancelPatientBooking();

  const [selectedAppointment, setSelectedAppointment] =
    useState<DashboardAppointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // If dashboardData is already available in cache or prefetched, never show skeletons!
  const isLoading = (isParentLoading || isDashboardLoading) && !dashboardData;

  const handleOpenDetails = (appt: DashboardAppointment) => {
    setSelectedAppointment(appt);
    setDialogOpen(true);
  };

  const handleCancelAppointment = (id: string) => {
    cancelMutation.mutate({ bookingId: id });
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-1">
        <h1
          className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
          suppressHydrationWarning
        >
          {patientName ? `Welcome back, ${patientName}` : "Patient Overview"}
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text">
          Manage your tele-consultations, health status, and medical bookings.
        </p>
      </div>

      {/* Error Banner with Retry */}
      {isError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-destructive">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              {error instanceof Error
                ? error.message
                : "Unable to load dashboard data right now."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 px-3 rounded-xl border-destructive/30 hover:bg-destructive/10 text-destructive text-xs font-semibold gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* 1. Recommended Patient Stats Overview Cards */}
      <PatientStatsCards
        stats={dashboardData?.stats}
        isLoading={isLoading}
      />

      {/* 2. Upcoming Consultation Surface */}
      <PatientNextConsultation
        appointment={dashboardData?.nextConsultation}
        isLoading={isLoading}
        onOpenDetails={handleOpenDetails}
      />

      {/* 3. Purposeful Quick Booking Action */}
      <PatientQuickActions />

      {/* 4. Recent Appointments Table */}
      <PatientAppointmentsTable
        appointments={dashboardData?.recentConsultations || []}
        isLoading={isLoading}
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
