"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DOCTOR_TODAY_SCHEDULE,
  DoctorScheduleItem,
  DashboardAppointment,
} from "@/lib/dashboard-mock-data";
import { MOCK_AVAILABILITY_SLOTS } from "@/lib/doctor-mock-data";
import { DoctorNextConsultation } from "@/components/dashboard/doctor/DoctorNextConsultation";
import { DoctorTodayScheduleTable } from "@/components/dashboard/doctor/DoctorTodayScheduleTable";
import { AppointmentDetailsDialog } from "@/components/dashboard/shared/AppointmentDetailsDialog";

interface DoctorDashboardViewProps {
  doctorName?: string | null;
  isVerified?: boolean;
  isLoading?: boolean;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = () => {
  const [schedule, setSchedule] = useState<DoctorScheduleItem[]>(DOCTOR_TODAY_SCHEDULE);
  const [selectedAppt, setSelectedAppt] = useState<DashboardAppointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const nextAppointment = schedule.find(
    (s) => s.status === "CONFIRMED" || s.status === "PENDING"
  );

  const activeSlotsCount = MOCK_AVAILABILITY_SLOTS.filter((s) => s.isActive).length;

  const handleMarkComplete = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "COMPLETED" as const } : item
      )
    );
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
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

      {/* 3. Minimal Practice Availability Summary Card */}
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
        isDoctorView={true}
      />
    </div>
  );
};

export default DoctorDashboardView;
