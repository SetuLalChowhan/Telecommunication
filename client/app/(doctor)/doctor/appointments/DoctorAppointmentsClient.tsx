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
import { AppointmentDetailsDialog } from "@/features/appointments/components";
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
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const { data: bookingsData, isLoading } = useDoctorBookings();

  const confirmMutation = useConfirmDoctorBooking();
  const completeMutation = useCompleteDoctorBooking();
  const cancelMutation = useCancelDoctorBooking();

  const handleConfirm = (id: string) => {
    setActionLoadingId(id);
    confirmMutation.mutate(id, {
      onSettled: () => setActionLoadingId(null),
    });
  };

  const handleComplete = (id: string) => {
    setActionLoadingId(id);
    completeMutation.mutate(id, {
      onSettled: () => setActionLoadingId(null),
    });
  };

  const bookingsList = bookingsData?.data || [];
  const allScheduleItems = useMemo(() => bookingsList.map(adaptBookingToScheduleItem), [bookingsList]);

  const counts = useMemo(
    () => ({
      all: allScheduleItems.length,
      confirmed: allScheduleItems.filter((i) => i.status === "CONFIRMED").length,
      pending: allScheduleItems.filter((i) => i.status === "PENDING").length,
      completed: allScheduleItems.filter((i) => i.status === "COMPLETED").length,
      cancelled: allScheduleItems.filter((i) => i.status === "CANCELLED").length,
    }),
    [allScheduleItems]
  );

  const filteredItems = useMemo(() => {
    return allScheduleItems.filter((item) => {
      if (filter !== "ALL" && item.status !== filter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.patientName.toLowerCase().includes(q) ||
          item.symptoms?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allScheduleItems, filter, searchQuery]);

  return (
    <div className="w-full space-y-5">
      <DoctorAppointmentsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={allScheduleItems.length}
      />

      <DoctorAppointmentTabs
        activeTab={filter}
        onTabChange={setFilter}
        counts={counts}
      />

      {/* Main Clean Minimal Shadcn Table */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
        {isLoading && allScheduleItems.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : filteredItems.length === 0 ? (
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
                <TableHeader className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-border/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="py-2.5 px-5 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Patient
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Age / Gender
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Date & Time
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Chief Complaint
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="py-2.5 px-5 text-right font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
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
                      <TableCell className="py-3 px-5">
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
                      <TableCell className="py-3 px-4 font-medium text-foreground text-xs">
                        {item.time}
                      </TableCell>

                      {/* Symptoms */}
                      <TableCell className="py-3 px-4 text-xs text-muted-foreground max-w-[200px] truncate">
                        {item.symptoms || "General Checkup"}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-3 px-4">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
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
                      </TableCell>

                      {/* Action Buttons */}
                      <TableCell className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "PENDING" && (
                            <Button
                              size="sm"
                              onClick={() => handleConfirm(item.id)}
                              disabled={actionLoadingId === item.id}
                              className="h-7.5 px-2.5 rounded-lg text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
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
                              className="h-7.5 px-2.5 rounded-lg text-xs font-semibold gap-1 border-border hover:border-emerald-500 hover:text-emerald-600 cursor-pointer"
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
                            className="h-7.5 px-2.5 rounded-lg text-xs font-medium border-border/80 hover:border-primary/50"
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
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase shrink-0 ${
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
                          className="h-7 px-2.5 rounded-lg text-xs font-semibold gap-1 bg-emerald-600 text-white"
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
                          className="h-7 px-2.5 rounded-lg text-xs font-semibold gap-1"
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
                            className="h-7 px-2.5 rounded-lg text-xs font-semibold gap-1 bg-emerald-600 text-white"
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
          onCancelAppointment={(id: string) => cancelMutation.mutate(id)}
          onConfirmAppointment={handleConfirm}
          onCompleteAppointment={handleComplete}
          isDoctorView={true}
          isCancelling={cancelMutation.isPending}
          isCompleting={actionLoadingId === selectedAppointment?.id && completeMutation.isPending}
        />
      )}
    </div>
  );
}

export default DoctorAppointmentsClient;
