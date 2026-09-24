"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DoctorScheduleItem,
  DashboardAppointment,
} from "@/features/appointments/types";
import { formatTime } from "@/lib/time";
import { DoctorNextConsultation } from "./DoctorNextConsultation";
import { DoctorTodayScheduleTable } from "./DoctorTodayScheduleTable";
import { DoctorStatsCards } from "./DoctorStatsCards";
import { DoctorQuickActions } from "./DoctorQuickActions";
import { AppointmentDetailsDialog } from "@/features/appointments/components/AppointmentDetailsDialog";
import { PageHeader } from "@/components/layout";
import {
  useDoctorDashboard,
  useConfirmDoctorBooking,
  useCompleteDoctorBooking,
} from "../api/queries";
import { DoctorDashboardBooking } from "../types";

interface DoctorDashboardViewProps {
  doctorName?: string | null;
  isVerified?: boolean;
  isLoading?: boolean;
}

function adaptBookingToScheduleItem(booking: DoctorDashboardBooking): DoctorScheduleItem {
  const patientUser = booking.patient?.user;
  const patientName = patientUser?.name || "Patient";

  let patientAge = 32;
  if (patientUser?.dateOfBirth) {
    const birthYear = new Date(patientUser.dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    if (!isNaN(birthYear) && birthYear > 1900) {
      patientAge = Math.max(1, currentYear - birthYear);
    }
  }

  const rawGender = booking.patient?.gender || patientUser?.gender;
  const patientGender = rawGender
    ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase()
    : "Patient";

  const timeFormatted = formatTime(booking.slotStart, "10:00 AM");

  return {
    id: booking.id,
    time: timeFormatted,
    patientName,
    patientPhone: patientUser?.phone || undefined,
    patientAge,
    patientGender,
    patientAvatar: patientUser?.image || "",
    consultationType: "Video Consultation",
    status: booking.status,
    symptoms: booking.notes || "General Consultation",
    meetLink: booking.meetLink || undefined,
    fee: 1200,
  };
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  doctorName,
  isVerified = true,
  isLoading: isParentLoading = false,
}) => {
  const [selectedAppt, setSelectedAppt] = useState<DashboardAppointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { data: dashboardData, isLoading: isDashboardLoading } = useDoctorDashboard();
  const confirmMutation = useConfirmDoctorBooking();
  const completeMutation = useCompleteDoctorBooking();

  const handleConfirmAppointment = (id: string) => {
    setActionLoadingId(id);
    confirmMutation.mutate(id, {
      onSettled: () => setActionLoadingId(null),
      onSuccess: () => setDetailsOpen(false),
    });
  };

  const handleMarkComplete = (id: string) => {
    setActionLoadingId(id);
    completeMutation.mutate(id, {
      onSettled: () => setActionLoadingId(null),
      onSuccess: () => setDetailsOpen(false),
    });
  };

  const nextApptAdapted = dashboardData?.nextAppointment
    ? adaptBookingToScheduleItem(dashboardData.nextAppointment)
    : undefined;

  const todayScheduleAdapted = (dashboardData?.todaySchedule || []).map(
    adaptBookingToScheduleItem
  );
  const activeSlotsCount = dashboardData?.activeDaysCount ?? 0;
  const isLoading = (isParentLoading || isDashboardLoading) && !dashboardData;

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Clinical workspace"
        title={doctorName || "Doctor overview"}
        meta={
          dashboardData?.stats
            ? `${dashboardData.stats.todayConsultationsCount} today`
            : undefined
        }
        description="Your queue, patient consultations and practice availability."
        actions={
          <Link href="/doctor/appointments">
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-md px-3 text-xs font-semibold"
            >
              <span>Consultation queue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        }
      />

      {!isVerified && (
        <div className="flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              Your BMDC registration is not verified yet — patients cannot book
              you until verification completes.
            </p>
          </div>
          <Link href="/doctor-verification" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-md border-amber-500/40 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
            >
              <span>Complete verification</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Metric strip */}
      <DoctorStatsCards stats={dashboardData?.stats} isLoading={isLoading} />

      {/* Working grid: today's flow on the left, practice details on the right */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-5">
        <div className="space-y-4 xl:col-span-2 xl:space-y-5">
          <DoctorNextConsultation
            appointment={nextApptAdapted}
            onMarkComplete={handleMarkComplete}
            onConfirm={handleConfirmAppointment}
            actionLoadingId={actionLoadingId}
          />

          <DoctorTodayScheduleTable
            schedule={todayScheduleAdapted}
            onMarkComplete={handleMarkComplete}
            onConfirm={handleConfirmAppointment}
            actionLoadingId={actionLoadingId}
          />
        </div>

        <div className="space-y-4 xl:space-y-5">
          <section className="panel overflow-hidden">
            <div className="panel-header">
              <h2 className="panel-title">Availability</h2>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-baseline gap-2">
                <span className="data-value">{activeSlotsCount}</span>
                <span className="text-xs text-muted-foreground">
                  active day{activeSlotsCount === 1 ? "" : "s"} open for bookings
                </span>
              </div>
              <Link href="/doctor/schedule" className="block">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between rounded-md text-xs font-semibold"
                >
                  <span>Manage hours &amp; leaves</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </section>

          <DoctorQuickActions />
        </div>
      </div>

      <AppointmentDetailsDialog
        appointment={selectedAppt}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onConfirmAppointment={handleConfirmAppointment}
        onCompleteAppointment={handleMarkComplete}
        isDoctorView={true}
        isConfirming={actionLoadingId === selectedAppt?.id && confirmMutation.isPending}
        isCompleting={actionLoadingId === selectedAppt?.id && completeMutation.isPending}
      />
    </div>
  );
};

export default DoctorDashboardView;
