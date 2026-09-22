"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, RefreshCw } from "lucide-react";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";
import {
  usePatientDashboard,
  useCancelPatientBooking,
} from "../api/queries";
import { PatientStatsCards } from "./PatientStatsCards";
import { PatientNextConsultation } from "./PatientNextConsultation";
import { PatientQuickActions } from "./PatientQuickActions";
import { PatientAppointmentsTable } from "./PatientAppointmentsTable";
import { AppointmentDetailsDialog } from "@/features/appointments/components/AppointmentDetailsDialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout";

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

  // Prefetched/cached data should render immediately, never behind a skeleton.
  const isLoading = (isParentLoading || isDashboardLoading) && !dashboardData;

  const handleOpenDetails = (appt: DashboardAppointment) => {
    setSelectedAppointment(appt);
    setDialogOpen(true);
  };

  const handleCancelAppointment = (id: string) => {
    cancelMutation.mutate(
      { bookingId: id },
      { onSuccess: () => setDialogOpen(false) }
    );
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Care summary"
        title={patientName || "Patient overview"}
        meta={
          dashboardData?.stats
            ? `${dashboardData.stats.totalConsultations} consultations on record`
            : undefined
        }
        description="Your upcoming video visits, consultation history and health shortcuts."
        actions={
          <Link href="/patient/appointments">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-md px-3 text-xs font-semibold"
            >
              <span>All appointments</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        }
      />

      {isError && (
        <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
            <p className="text-xs font-medium text-destructive">
              {error instanceof Error
                ? error.message
                : "Unable to load dashboard data right now."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 shrink-0 gap-1.5 self-start rounded-md border-destructive/30 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 sm:self-auto"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry</span>
          </Button>
        </div>
      )}

      {/* Metric strip */}
      <PatientStatsCards stats={dashboardData?.stats} isLoading={isLoading} />

      {/* Working grid: consultation flow on the left, shortcuts on the right */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-5">
        <div className="space-y-4 xl:col-span-2 xl:space-y-5">
          <PatientNextConsultation
            appointment={dashboardData?.nextConsultation}
            isLoading={isLoading}
            onOpenDetails={handleOpenDetails}
          />

          <PatientAppointmentsTable
            appointments={dashboardData?.recentConsultations || []}
            isLoading={isLoading}
            onOpenDetails={handleOpenDetails}
          />
        </div>

        <div className="space-y-4 xl:space-y-5">
          <PatientQuickActions />
        </div>
      </div>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCancelAppointment={handleCancelAppointment}
        isCancelling={cancelMutation.isPending}
      />
    </div>
  );
};

export default PatientDashboardView;
