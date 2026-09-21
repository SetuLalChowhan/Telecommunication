"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  Check,
  Search,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DoctorScheduleItem,
  DashboardAppointment,
} from "@/lib/dashboard-mock-data";
import { AppointmentDetailsDialog } from "@/components/dashboard/shared/AppointmentDetailsDialog";
import {
  useDoctorBookings,
  useDoctorDashboard,
  useConfirmDoctorBooking,
  useCompleteDoctorBooking,
  useCancelDoctorBooking,
} from "@/features/doctors/api/queries";
import { DoctorDashboardBooking } from "@/features/doctors/types";

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

  const dateFormatted = !isNaN(slotDate.getTime())
    ? slotDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Today";

  return {
    id: booking.id,
    time: `${dateFormatted} · ${timeFormatted}`,
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

interface DoctorAppointmentsClientProps {
  initialStatus?: string;
}

export function DoctorAppointmentsClient({
  initialStatus = "ALL",
}: DoctorAppointmentsClientProps) {
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED">(
    (initialStatus?.toUpperCase() as any) || "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppt, setSelectedAppt] = useState<DashboardAppointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: dashboardData } = useDoctorDashboard();
  const { data: bookingsData, isLoading, isFetching } = useDoctorBookings({
    status: filter === "ALL" ? undefined : filter,
  });

  const confirmMutation = useConfirmDoctorBooking();
  const completeMutation = useCompleteDoctorBooking();
  const cancelMutation = useCancelDoctorBooking();

  const rawBookings = bookingsData?.data || [];
  const appointments: DoctorScheduleItem[] = rawBookings.map(adaptBookingToScheduleItem);

  const filteredAppointments = appointments.filter((appt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      appt.patientName.toLowerCase().includes(q) ||
      appt.symptoms.toLowerCase().includes(q)
    );
  });

  const handleMarkComplete = (id: string) => {
    completeMutation.mutate(id);
  };

  const handleConfirmAppointment = (id: string) => {
    confirmMutation.mutate(id);
  };

  const handleCancelAppointment = (id: string) => {
    cancelMutation.mutate(id, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  const handleOpenDetails = (item: DoctorScheduleItem) => {
    const adapted: DashboardAppointment = {
      id: item.id,
      doctorName: "Dr. Consultant",
      doctorSpecialty: "General Medicine",
      doctorAvatar: "",
      patientName: item.patientName,
      patientAge: item.patientAge,
      patientGender: item.patientGender,
      patientAvatar: item.patientAvatar,
      dateFormatted: "Scheduled Visit",
      timeFormatted: item.time,
      consultationType: "Video Consultation",
      status: item.status,
      meetLink: item.meetLink,
      symptoms: item.symptoms,
      fee: item.fee,
    };
    setSelectedAppt(adapted);
    setDialogOpen(true);
  };

  const stats = dashboardData?.stats;
  const getTabCount = (status: "ALL" | "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED") => {
    if (stats) {
      if (status === "ALL") return stats.totalConsultations;
      if (status === "CONFIRMED") return stats.confirmedCount;
      if (status === "PENDING") return stats.pendingConfirmationCount;
      if (status === "COMPLETED") return stats.completedConsultationsCount;
      if (status === "CANCELLED") return stats.cancelledCount;
    }
    return appointments.length;
  };

  return (
    <DoctorLayout>
      <div className="w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Consultation Queue
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              Manage scheduled patient consultations, launch video visits, and complete clinical reviews.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/doctor/schedule">
              <Button
                variant="outline"
                className="h-10 px-4 rounded-xl text-sm font-semibold gap-2 border-border hover:border-primary/50"
              >
                <Clock className="h-4 w-4 text-primary" />
                <span>Manage Availability</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Controls: Filter Pills & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {(["ALL", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"] as const).map((status) => {
              const count = getTabCount(status);
              const isCurrent = filter === status;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isCurrent
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-card text-secondary-text border-border/80 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {isCurrent && isFetching && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                  )}
                  <span>
                    {status === "ALL" ? "All Consultations" : status.charAt(0) + status.slice(1).toLowerCase()} ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by patient or symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-border/80 bg-card hover:border-primary/40 focus:border-primary shadow-xs"
            />
          </div>
        </div>

        {/* Consultations Table */}
        <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs relative">
          {/* Top progress indicator during background refetching */}
          {isFetching && !isLoading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 overflow-hidden z-20">
              <div className="h-full bg-primary animate-pulse w-full" />
            </div>
          )}

          {isLoading ? (
            <div className="p-6 space-y-4">
              <div className="hidden md:block">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4 py-3.5 animate-pulse border-b border-border/40 last:border-0"
                    >
                      <div className="flex items-center gap-3 w-1/3">
                        <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-4 w-28 bg-muted rounded" />
                          <div className="h-3 w-20 bg-muted/70 rounded" />
                        </div>
                      </div>
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-5 w-24 bg-muted rounded-md" />
                      <div className="h-5 w-20 bg-muted rounded-full" />
                      <div className="h-8 w-24 bg-muted rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile skeleton */}
              <div className="md:hidden space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border/50 bg-card/60 animate-pulse space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="space-y-1">
                          <div className="h-3.5 w-24 bg-muted rounded" />
                          <div className="h-3 w-16 bg-muted/70 rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-16 bg-muted rounded-full" />
                    </div>
                    <div className="h-3 w-40 bg-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className={`transition-opacity duration-200 ${isFetching ? "opacity-75 pointer-events-none" : "opacity-100"}`}>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-border/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-3 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Patient</TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Time</TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Type</TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Status</TableHead>
                      <TableHead className="py-3 px-6 text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/40">
                    {filteredAppointments.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <TableCell className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-1 ring-primary/15 shrink-0">
                              <AvatarImage src={item.patientAvatar} alt={item.patientName} />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                                {item.patientName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-foreground leading-snug">{item.patientName}</p>
                              <p className="text-xs text-secondary-text">
                                {item.patientAge}y · {item.patientGender}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5 px-4 font-medium text-xs text-foreground">
                          {item.time}
                        </TableCell>

                        <TableCell className="py-3.5 px-4">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-foreground border border-border/60">
                            {item.consultationType}
                          </span>
                        </TableCell>

                        <TableCell className="py-3.5 px-4">
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
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

                        <TableCell className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Doctor Actions */}
                            {item.status === "PENDING" && (
                              <Button
                                size="sm"
                                onClick={() => handleConfirmAppointment(item.id)}
                                disabled={confirmMutation.isPending}
                                className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs"
                              >
                                {confirmMutation.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Check className="h-3.5 w-3.5" />
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
                                  className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                >
                                  <Video className="h-3.5 w-3.5" />
                                  <span>Call</span>
                                </Button>
                              </a>
                            )}

                            {item.status === "CONFIRMED" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkComplete(item.id)}
                                disabled={completeMutation.isPending}
                                className="h-8 px-2.5 rounded-lg text-xs font-semibold border-border hover:border-primary/50 text-foreground"
                              >
                                {completeMutation.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                                )}
                                <span>Done</span>
                              </Button>
                            )}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDetails(item)}
                              className="h-8 px-2.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10"
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

              {/* Mobile Stacked Responsive Cards */}
              <div className="md:hidden divide-y divide-border/60">
                {filteredAppointments.map((item) => (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.patientAvatar} alt={item.patientName} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                            {item.patientName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-foreground">{item.patientName}</p>
                          <p className="text-xs text-muted-foreground">{item.time} · {item.consultationType}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border uppercase ${
                          item.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {item.status === "PENDING" && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirmAppointment(item.id)}
                          className="h-8 px-3 rounded-lg text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Confirm</span>
                        </Button>
                      )}
                      {item.meetLink && item.status === "CONFIRMED" && (
                        <a href={item.meetLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="h-8 px-3 rounded-lg text-xs font-semibold gap-1 bg-emerald-600 text-white">
                            <Video className="h-3.5 w-3.5" />
                            <span>Join Call</span>
                          </Button>
                        </a>
                      )}
                      {item.status === "CONFIRMED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkComplete(item.id)}
                          className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Complete</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDetails(item)}
                        className="h-8 px-2 text-xs font-semibold text-primary"
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center space-y-3">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No appointments found</h3>
              <p className="text-sm text-muted-foreground">
                No consultations found matching your current filter.
              </p>
            </div>
          )}
        </div>

        {/* Appointment Details Modal */}
        <AppointmentDetailsDialog
          appointment={selectedAppt}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCancelAppointment={handleCancelAppointment}
          onConfirmAppointment={handleConfirmAppointment}
          isCancelling={cancelMutation.isPending}
          isDoctorView={true}
        />
      </div>
    </DoctorLayout>
  );
}

export default DoctorAppointmentsClient;
