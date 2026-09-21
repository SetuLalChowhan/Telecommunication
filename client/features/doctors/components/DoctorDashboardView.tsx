"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DoctorScheduleItem,
  DashboardAppointment,
} from "@/lib/dashboard-mock-data";
import { DoctorNextConsultation } from "./DoctorNextConsultation";
import { DoctorTodayScheduleTable } from "./DoctorTodayScheduleTable";
import { DoctorStatsCards } from "./DoctorStatsCards";
import { AppointmentDetailsDialog } from "@/features/appointments/components/AppointmentDetailsDialog";
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

  const slotDate = new Date(booking.slotStart);
  const timeFormatted = !isNaN(slotDate.getTime())
    ? slotDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "10:00 AM";

  return {
    id: booking.id,
    time: timeFormatted,
    patientName,
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
    });
  };

  const handleMarkComplete = (id: string) => {
    setActionLoadingId(id);
    completeMutation.mutate(id, {
      onSettled: () => setActionLoadingId(null),
    });
  };

  const nextApptAdapted = dashboardData?.nextAppointment
    ? adaptBookingToScheduleItem(dashboardData.nextAppointment)
    : undefined;

  const todayScheduleAdapted = (dashboardData?.todaySchedule || []).map(adaptBookingToScheduleItem);
  const activeSlotsCount = dashboardData?.activeDaysCount ?? 0;
  const isLoading = (isParentLoading || isDashboardLoading) && !dashboardData;

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* 1. Practice Stats Row */}
      <DoctorStatsCards stats={dashboardData?.stats} isLoading={isLoading} />

      {/* 2. Next Live Consultation Surface */}
      <DoctorNextConsultation
        appointment={nextApptAdapted}
        onMarkComplete={handleMarkComplete}
        onConfirm={handleConfirmAppointment}
        actionLoadingId={actionLoadingId}
      />

      {/* 3. Today's Consultations Queue */}
      <DoctorTodayScheduleTable
        schedule={todayScheduleAdapted}
        onMarkComplete={handleMarkComplete}
        onConfirm={handleConfirmAppointment}
        actionLoadingId={actionLoadingId}
      />

      {/* 4. Practice Availability Summary Card */}
      <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground">
              Clinical Availability & Vacation
            </h3>
            <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
              {activeSlotsCount} active days configured for patient appointments.
            </p>
          </div>
        </div>

        <Link href="/doctor/schedule" className="shrink-0">
          <Button
            variant="outline"
            className="h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold rounded-xl gap-1.5 border-border hover:border-primary/50"
          >
            <span>Manage Hours & Leaves</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Link>
      </section>

      {/* Appointment Details Modal */}
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
