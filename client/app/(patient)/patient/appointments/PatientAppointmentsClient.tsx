"use client";

import React, { useState, useMemo } from "react";
import { Loader2, Calendar } from "lucide-react";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";
import { AppointmentDetailsDialog } from "@/features/appointments/components";
import {
  usePatientBookings,
  useCancelPatientBooking,
} from "@/features/patients";
import {
  mapBookingToAppointment,
  RawBooking,
  PatientBookingsQueryParams,
} from "@/features/patients/types";
import { PatientAppointmentsHeader } from "@/features/appointments/components/patient/PatientAppointmentsHeader";
import {
  PatientAppointmentTabs,
  PatientBookingFilterStatus,
} from "@/features/appointments/components/patient/PatientAppointmentTabs";
import { PatientAppointmentCard } from "@/features/appointments/components/patient/PatientAppointmentCard";

interface PatientAppointmentsClientProps {
  initialStatus?: string;
}

export function PatientAppointmentsClient({
  initialStatus = "ALL",
}: PatientAppointmentsClientProps) {
  const [filter, setFilter] = useState<PatientBookingFilterStatus>(
    (initialStatus?.toUpperCase() as any) || "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppt, setSelectedAppt] = useState<DashboardAppointment | null>(null);

  const queryParams: PatientBookingsQueryParams = useMemo(
    () => ({
      status: filter === "ALL" ? undefined : filter,
      page: 1,
    }),
    [filter]
  );

  const { data: bookingsResponse, isLoading } = usePatientBookings(queryParams);
  const cancelMutation = useCancelPatientBooking();

  const appointments: DashboardAppointment[] = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    return (bookingsResponse.data as RawBooking[]).map(mapBookingToAppointment);
  }, [bookingsResponse?.data]);

  const filteredAppointments = appointments.filter((appt) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        appt.doctorName.toLowerCase().includes(q) ||
        appt.doctorSpecialty.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: appointments.length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PatientAppointmentsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={appointments.length}
      />

      <PatientAppointmentTabs
        activeTab={filter}
        onTabChange={setFilter}
        counts={counts}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-card border border-border">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No appointments found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {searchQuery
              ? "No appointments match your search query."
              : `You do not have any ${filter !== "ALL" ? filter.toLowerCase() : ""} appointments.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((appt) => (
            <PatientAppointmentCard
              key={appt.id}
              appointment={appt}
              onSelect={(selected) => setSelectedAppt(selected)}
            />
          ))}
        </div>
      )}

      {selectedAppt && (
        <AppointmentDetailsDialog
          open={Boolean(selectedAppt)}
          onOpenChange={(open) => !open && setSelectedAppt(null)}
          appointment={selectedAppt}
          onCancelAppointment={(id) => cancelMutation.mutate({ bookingId: id })}
          isDoctorView={false}
          isCancelling={cancelMutation.isPending}
        />
      )}
    </div>
  );
}

export default PatientAppointmentsClient;
