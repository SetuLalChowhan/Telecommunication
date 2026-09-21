"use client";

import React, { useState } from "react";
import { Loader2, Calendar } from "lucide-react";
import {
  useDoctorBookings,
  useConfirmDoctorBooking,
  useCompleteDoctorBooking,
  useCancelDoctorBooking,
} from "@/features/doctors/api/queries";
import { DoctorScheduleItem, DashboardAppointment } from "@/lib/dashboard-mock-data";
import { DoctorDashboardBooking } from "@/features/doctors/types";
import { AppointmentDetailsDialog } from "@/features/appointments/components";
import { DoctorAppointmentsHeader } from "@/features/appointments/components/doctor/DoctorAppointmentsHeader";
import {
  DoctorAppointmentTabs,
  AppointmentStatusFilter,
} from "@/features/appointments/components/doctor/DoctorAppointmentTabs";
import { DoctorAppointmentRow } from "@/features/appointments/components/doctor/DoctorAppointmentRow";

function adaptBookingToScheduleItem(booking: DoctorDashboardBooking): DoctorScheduleItem {
  const patientUser = booking.patient?.user;
  const patientName = patientUser?.name || "Patient";

  let patientAge = 30;
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
  const formattedDate = !isNaN(slotDate.getTime())
    ? slotDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  const formattedTime = !isNaN(slotDate.getTime())
    ? slotDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "09:00 AM";

  return {
    id: booking.id,
    patientName,
    patientAvatar: patientUser?.image || "",
    patientAge,
    patientGender,
    time: `${formattedDate} · ${formattedTime}`,
    consultationType: "Video Consultation",
    status: booking.status as any,
    symptoms: booking.notes || "General Consultation",
    fee: 0,
    meetLink: booking.meetLink || undefined,
  };
}

interface DoctorAppointmentsClientProps {
  initialStatus?: string;
}

export function DoctorAppointmentsClient({
  initialStatus = "ALL",
}: DoctorAppointmentsClientProps) {
  const [filter, setFilter] = useState<AppointmentStatusFilter>(
    (initialStatus as AppointmentStatusFilter) || "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<DashboardAppointment | null>(null);

  const { data: bookingsData, isLoading } = useDoctorBookings({
    status: filter !== "ALL" ? (filter as any) : undefined,
  });

  const confirmMutation = useConfirmDoctorBooking();
  const completeMutation = useCompleteDoctorBooking();
  const cancelMutation = useCancelDoctorBooking();

  const bookingsList = bookingsData?.data || [];
  const scheduleItems = bookingsList.map(adaptBookingToScheduleItem);

  const filteredItems = scheduleItems.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.patientName.toLowerCase().includes(q) ||
        item.symptoms?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: scheduleItems.length,
    confirmed: scheduleItems.filter((i) => i.status === "CONFIRMED").length,
    pending: scheduleItems.filter((i) => i.status === "PENDING").length,
    completed: scheduleItems.filter((i) => i.status === "COMPLETED").length,
    cancelled: scheduleItems.filter((i) => i.status === "CANCELLED").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <DoctorAppointmentsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={scheduleItems.length}
      />

      <DoctorAppointmentTabs
        activeTab={filter}
        onTabChange={setFilter}
        counts={counts}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-card border border-border">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No appointments found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {searchQuery
              ? "No appointments match your search query."
              : `No ${filter !== "ALL" ? filter.toLowerCase() : ""} appointments scheduled.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <DoctorAppointmentRow
              key={item.id}
              item={item}
              onSelect={() =>
                setSelectedAppointment({
                  id: item.id,
                  doctorName: "Dr. Specialist",
                  doctorSpecialty: "Specialist",
                  doctorAvatar: "/images/doctor-placeholder.jpg",
                  patientName: item.patientName,
                  patientAvatar: item.patientAvatar,
                  patientAge: item.patientAge,
                  patientGender: item.patientGender,
                  dateFormatted: item.time.split(" · ")[0] || "Today",
                  timeFormatted: item.time.split(" · ")[1] || item.time,
                  status: item.status as any,
                  consultationType: "Video Consultation",
                  symptoms: item.symptoms,
                  fee: item.fee,
                  meetLink: item.meetLink,
                })
              }
              onConfirm={(id) => confirmMutation.mutate(id)}
              onComplete={(id) => completeMutation.mutate(id)}
              isConfirming={confirmMutation.isPending}
              isCompleting={completeMutation.isPending}
            />
          ))}
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetailsDialog
          open={Boolean(selectedAppointment)}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
          appointment={selectedAppointment}
          onCancelAppointment={(id: string) => cancelMutation.mutate(id)}
          onConfirmAppointment={(id: string) => confirmMutation.mutate(id)}
          isDoctorView={true}
          isCancelling={cancelMutation.isPending}
        />
      )}
    </div>
  );
}

export default DoctorAppointmentsClient;
