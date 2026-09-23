"use client";

import React, { useState, useMemo } from "react";
import { Loader2, Calendar, Video, CheckCircle2, User } from "lucide-react";
import {
  useDoctorBookings,
  useConfirmDoctorBooking,
  useCompleteDoctorBooking,
  useCancelDoctorBooking,
} from "@/features/doctors/api/queries";
import { DoctorScheduleItem, DashboardAppointment } from "@/lib/dashboard-mock-data";
import { DoctorDashboardBooking } from "@/features/doctors/types";
import { MAX_PAGE_SIZE } from "@/lib/api/types";
import {
  currentAppYear,
  formatDate,
  formatTime,
  toDateInputValue,
} from "@/lib/time";
import { AppointmentDetailsDialog } from "@/features/appointments/components";
import {
  useBookingSummary,
  normalizeStatusFilter,
  EMPTY_BOOKING_SUMMARY,
} from "@/features/appointments";
import { DoctorAppointmentsHeader } from "@/features/appointments/components/doctor/DoctorAppointmentsHeader";
import {
  DoctorAppointmentTabs,
  AppointmentStatusFilter,
} from "@/features/appointments/components/doctor/DoctorAppointmentTabs";
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

function adaptBookingToScheduleItem(booking: DoctorDashboardBooking): DoctorScheduleItem {
  const patientUser = booking.patient?.user;
  const patientName = patientUser?.name || "Patient";

  let patientAge = 30;
  if (patientUser?.dateOfBirth) {
    const birthYear = Number(toDateInputValue(patientUser.dateOfBirth).slice(0, 4));
    const currentYear = currentAppYear();
    if (!isNaN(birthYear) && birthYear > 1900) {
      patientAge = Math.max(1, currentYear - birthYear);
    }
  }

  const rawGender = booking.patient?.gender || patientUser?.gender;
  const patientGender = rawGender
    ? rawGender.charAt(0).toUpperCase() + rawGender.slice(1).toLowerCase()
    : "Patient";

  // Pinned to the app timezone: these run during SSR too, so an unpinned host
  // timezone would shift the date/time and break hydration.
  const formattedDate = formatDate(booking.slotStart, "short", "Today");
  const formattedTime = formatTime(booking.slotStart, "09:00 AM");

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
    normalizeStatusFilter(initialStatus) as AppointmentStatusFilter
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<DashboardAppointment | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // The active tab is sent to the backend — no client-side status filtering.
  const bookingStatus = filter === "ALL" ? undefined : filter;

  const {
    data: bookingsData,
    isLoading,
    isFetching,
  } = useDoctorBookings({ status: bookingStatus, limit: MAX_PAGE_SIZE });
  const { data: summary } = useBookingSummary();

  const confirmMutation = useConfirmDoctorBooking();
  const completeMutation = useCompleteDoctorBooking();
  const cancelMutation = useCancelDoctorBooking();

  const closeDialog = () => setSelectedAppointment(null);

  const handleConfirm = (id: string) => {
    setActionLoadingId(id);
    confirmMutation.mutate(id, {
      onSettled: () => setActionLoadingId(null),
      onSuccess: closeDialog,
    });
  };

  const handleComplete = (id: string) => {
    setActionLoadingId(id);
    completeMutation.mutate(id, {
      onSettled: () => setActionLoadingId(null),
      onSuccess: closeDialog,
    });
  };

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id, { onSuccess: closeDialog });
  };

  const bookingsList = bookingsData?.data || [];
  const allScheduleItems = useMemo(() => bookingsList.map(adaptBookingToScheduleItem), [bookingsList]);

  // Counts come straight from the backend summary payload.
  const counts = summary || EMPTY_BOOKING_SUMMARY;

  // Search stays local (it is a text filter, not a status filter).
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allScheduleItems;

    const q = searchQuery.toLowerCase();
    return allScheduleItems.filter(
      (item) =>
        item.patientName.toLowerCase().includes(q) ||
        item.symptoms?.toLowerCase().includes(q)
    );
  }, [allScheduleItems, searchQuery]);

  const isBusy = isLoading || isFetching;

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <DoctorAppointmentsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={counts.all}
      />

      <DoctorAppointmentTabs
        activeTab={filter}
        onTabChange={setFilter}
        counts={counts}
      />

      {/* Main Clean Minimal Shadcn Table */}
      <div className="relative panel overflow-hidden">
        {isBusy && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/70 backdrop-blur-[1px]">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-11 w-11 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground mb-3">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No appointments found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {searchQuery
                ? "No consultations match your search query."
                : `No ${filter !== "ALL" ? filter.toLowerCase() : ""} consultations in queue.`}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Patient
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Age / Gender
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Date & Time
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Chief Complaint
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="h-9 px-4 text-right text-[10px] tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/40">
                  {filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* Patient Details */}
                      <TableCell className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-1 ring-primary/15 shrink-0">
                            <AvatarImage src={item.patientAvatar} alt={item.patientName} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                              {item.patientName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                              {item.patientName}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {item.consultationType}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Age / Gender */}
                      <TableCell className="py-3 px-4 text-xs text-secondary-text">
                        <span>{item.patientAge} yrs &bull; {item.patientGender}</span>
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell className="px-4 py-2.5 text-xs font-medium tabular-nums text-foreground">
                        {item.time}
                      </TableCell>

                      {/* Symptoms */}
                      <TableCell className="max-w-[200px] truncate px-4 py-2.5 text-xs text-muted-foreground">
                        {item.symptoms || "General Checkup"}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-2.5">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${
                            item.status === "CONFIRMED"
                              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400"
                              : item.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>

                      {/* Action Buttons */}
                      <TableCell className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "PENDING" && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirm(item.id)}
                              disabled={actionLoadingId === item.id}
                              className="h-7 rounded-md px-2.5 text-xs font-semibold gap-1"
                            >
                              {actionLoadingId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3" />
                              )}
                              <span>Confirm</span>
                            </Button>
                          )}

                          {item.meetLink && item.status === "CONFIRMED" && (
                            <a
                              href={item.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                className="h-7.5 px-2.5 rounded-lg text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              >
                                <Video className="h-3 w-3" />
                                <span>Join</span>
                              </Button>
                            </a>
                          )}

                          {item.status === "CONFIRMED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleComplete(item.id)}
                              disabled={actionLoadingId === item.id}
                              className="h-7 rounded-md px-2.5 text-xs font-semibold gap-1"
                            >
                              {actionLoadingId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                              )}
                              <span>Complete</span>
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
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

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-border/60">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="h-8.5 w-8.5 shrink-0 ring-1 ring-primary/20">
                        <AvatarImage src={item.patientAvatar} alt={item.patientName} />
                        <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-bold">
                          {item.patientName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {item.patientName}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {item.patientAge} yrs &bull; {item.patientGender}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase shrink-0 ${
                        item.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : item.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : item.status === "COMPLETED"
                          ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <span className="font-medium text-foreground text-[11px]">
                      {item.time}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {item.status === "PENDING" && (
                        <Button
                          size="sm"
                          disabled={actionLoadingId === item.id}
                          onClick={() => handleConfirm(item.id)}
                          className="h-7 rounded-md px-2.5 text-xs font-semibold gap-1"
                        >
                          {actionLoadingId === item.id && <Loader2 className="h-3 w-3 animate-spin" />}
                          <span>Confirm</span>
                        </Button>
                      )}
                      {item.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionLoadingId === item.id}
                          onClick={() => handleComplete(item.id)}
                          className="h-7 rounded-md px-2.5 text-xs font-semibold gap-1"
                        >
                          {actionLoadingId === item.id && <Loader2 className="h-3 w-3 animate-spin" />}
                          <span>Done</span>
                        </Button>
                      )}
                      {item.meetLink && item.status === "CONFIRMED" && (
                        <a
                          href={item.meetLink}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {selectedAppointment && (
        <AppointmentDetailsDialog
          open={Boolean(selectedAppointment)}
          onOpenChange={(open) => !open && setSelectedAppointment(null)}
          appointment={selectedAppointment}
          onCancelAppointment={handleCancel}
          onConfirmAppointment={handleConfirm}
          onCompleteAppointment={handleComplete}
          isDoctorView={true}
          isCancelling={cancelMutation.isPending}
          isConfirming={actionLoadingId === selectedAppointment?.id && confirmMutation.isPending}
          isCompleting={actionLoadingId === selectedAppointment?.id && completeMutation.isPending}
        />
      )}
    </div>
  );
}

export default DoctorAppointmentsClient;
