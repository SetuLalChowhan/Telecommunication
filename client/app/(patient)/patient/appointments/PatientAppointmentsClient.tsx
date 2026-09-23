"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Loader2, Calendar, Video, Plus, Phone } from "lucide-react";
import { DashboardAppointment } from "@/lib/dashboard-mock-data";
import { AppointmentDetailsDialog, TablePagination } from "@/features/appointments/components";
import {
  useBookingSummary,
  normalizeStatusFilter,
  EMPTY_BOOKING_SUMMARY,
} from "@/features/appointments";
import {
  usePatientBookings,
  useCancelPatientBooking,
} from "@/features/patients";
import {
  mapBookingToAppointment,
  RawBooking,
} from "@/features/patients/types";
import { PatientAppointmentsHeader } from "@/features/appointments/components/patient/PatientAppointmentsHeader";
import {
  PatientAppointmentTabs,
  PatientBookingFilterStatus,
} from "@/features/appointments/components/patient/PatientAppointmentTabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface PatientAppointmentsClientProps {
  initialStatus?: string;
}

export function PatientAppointmentsClient({
  initialStatus = "ALL",
}: PatientAppointmentsClientProps) {
  const [filter, setFilter] = useState<PatientBookingFilterStatus>(
    normalizeStatusFilter(initialStatus) as PatientBookingFilterStatus
  );
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppt, setSelectedAppt] = useState<DashboardAppointment | null>(null);

  // The active tab is sent to the backend — no client-side status filtering.
  const bookingStatus = filter === "ALL" ? undefined : filter;

  const {
    data: bookingsResponse,
    isLoading,
    isFetching,
  } = usePatientBookings({ status: bookingStatus, page, limit: 10 });
  const { data: summary } = useBookingSummary();
  const cancelMutation = useCancelPatientBooking();

  const handleTabChange = (newTab: PatientBookingFilterStatus) => {
    setFilter(newTab);
    setPage(1);
  };

  const allAppointments: DashboardAppointment[] = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    return (bookingsResponse.data as RawBooking[]).map(mapBookingToAppointment);
  }, [bookingsResponse?.data]);

  // Counts come straight from the backend summary payload.
  const counts = summary || EMPTY_BOOKING_SUMMARY;

  // Search stays local (it is a text filter, not a status filter).
  const filteredAppointments = useMemo(() => {
    if (!searchQuery.trim()) return allAppointments;

    const q = searchQuery.toLowerCase().trim();
    return allAppointments.filter(
      (appt) =>
        appt.doctorName.toLowerCase().includes(q) ||
        appt.doctorSpecialty.toLowerCase().includes(q)
    );
  }, [allAppointments, searchQuery]);

  const isBusy = isLoading || isFetching;

  const handleCancel = (id: string) => {
    cancelMutation.mutate(
      { bookingId: id },
      { onSuccess: () => setSelectedAppt(null) }
    );
  };

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <PatientAppointmentsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={counts.all}
      />

      <PatientAppointmentTabs
        activeTab={filter}
        onTabChange={handleTabChange}
        counts={counts}
      />

      {/* Main Content Table */}
      <div className="relative panel overflow-hidden">
        {isBusy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/70 backdrop-blur-[1px]">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-11 w-11 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground mb-3">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No appointments found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {searchQuery
                ? "No appointments match your search term."
                : `You currently have no ${filter !== "ALL" ? filter.toLowerCase() : ""} consultations.`}
            </p>
            {filter === "ALL" && !searchQuery && (
              <Link href="/doctors" className="mt-4">
                <Button size="sm" className="h-8 rounded-md px-3 text-xs font-semibold gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Find a Doctor</span>
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Clean Minimal Shadcn Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Doctor
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Specialty
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Date & Time
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Fee
                    </TableHead>
                    <TableHead className="h-9 px-4 text-right text-[10px] tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/40">
                  {filteredAppointments.map((appt) => (
                    <TableRow
                      key={appt.id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* Doctor Details */}
                      <TableCell className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-1 ring-primary/15 shrink-0">
                            <AvatarImage src={appt.doctorAvatar} alt={appt.doctorName} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                              {appt.doctorName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                              {appt.doctorName}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {appt.consultationType}
                            </p>
                            {appt.doctorPhone && (
                              <a
                                href={`tel:${appt.doctorPhone}`}
                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone className="h-2.5 w-2.5" />
                                <span>{appt.doctorPhone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Specialty */}
                      <TableCell className="px-4 py-2.5 text-xs text-secondary-text">
                        {appt.doctorSpecialty}
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell className="px-4 py-2.5 text-xs font-medium tabular-nums text-foreground">
                        <div>
                          <span>{appt.dateFormatted}</span>
                          <span className="text-muted-foreground ml-1 font-normal">
                            &bull; {appt.timeFormatted}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-2.5">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                            appt.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400"
                              : appt.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </TableCell>

                      {/* Fee */}
                      <TableCell className="py-3 px-4 text-xs font-semibold text-foreground">
                        {appt.fee ? `BDT ${appt.fee}` : "Free"}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {appt.meetLink && appt.status === "CONFIRMED" && (
                            <a
                              href={appt.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                className="h-7 rounded-md px-2.5 text-xs font-semibold gap-1"
                              >
                                <Video className="h-3 w-3" />
                                <span>Join</span>
                              </Button>
                            </a>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAppt(appt)}
                            className="h-7 rounded-md px-2.5 text-xs font-medium"
                          >
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Responsive Compact View */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredAppointments.map((appt) => (
                <div key={appt.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-8.5 w-8.5 shrink-0 ring-1 ring-primary/20">
                        <AvatarImage src={appt.doctorAvatar} alt={appt.doctorName} />
                        <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-bold">
                          {appt.doctorName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {appt.doctorName}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {appt.doctorSpecialty}
                        </p>
                        {appt.doctorPhone && (
                          <a
                            href={`tel:${appt.doctorPhone}`}
                            className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-2.5 w-2.5" />
                            <span>{appt.doctorPhone}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase shrink-0 ${
                        appt.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : appt.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : appt.status === "COMPLETED"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <span className="font-medium text-foreground text-[11px]">
                      {appt.dateFormatted} · {appt.timeFormatted}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {appt.meetLink && appt.status === "CONFIRMED" && (
                        <a
                          href={appt.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            className="h-7 rounded-md px-2.5 text-xs font-semibold gap-1"
                          >
                            <Video className="h-3 w-3" />
                            <span>Join</span>
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAppt(appt)}
                        className="h-7 rounded-md px-2.5 text-xs font-medium"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <TablePagination
              page={bookingsResponse?.meta?.page || page}
              totalPages={bookingsResponse?.meta?.totalPages || 1}
              total={bookingsResponse?.meta?.total ?? filteredAppointments.length}
              limit={bookingsResponse?.meta?.limit || 10}
              onPageChange={setPage}
              entityName="consultations"
            />
          </>
        )}
      </div>

      {selectedAppt && (
        <AppointmentDetailsDialog
          open={Boolean(selectedAppt)}
          onOpenChange={(open) => !open && setSelectedAppt(null)}
          appointment={selectedAppt}
          onCancelAppointment={handleCancel}
          isDoctorView={false}
          isCancelling={cancelMutation.isPending}
        />
      )}
    </div>
  );
}

export default PatientAppointmentsClient;
