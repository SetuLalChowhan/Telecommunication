"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Video,
  Plus,
  Search,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import PatientLayout from "@/layouts/PatientLayout";
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
import { DashboardAppointment } from "@/lib/dashboard-mock-data";
import { AppointmentDetailsDialog } from "@/components/dashboard/shared/AppointmentDetailsDialog";
import {
  usePatientBookings,
  useCancelPatientBooking,
} from "@/features/patients";
import {
  mapBookingToAppointment,
  RawBooking,
  PatientBookingsQueryParams,
} from "@/features/patients/types";

interface PatientAppointmentsClientProps {
  initialStatus?: string;
}

type BookingFilterStatus =
  | "ALL"
  | "CONFIRMED"
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED";

const VALID_STATUSES: BookingFilterStatus[] = [
  "ALL",
  "CONFIRMED",
  "PENDING",
  "COMPLETED",
  "CANCELLED",
];

export function PatientAppointmentsClient({
  initialStatus = "ALL",
}: PatientAppointmentsClientProps) {
  const normalizedInitial = initialStatus?.toUpperCase() as BookingFilterStatus;
  const initialFilter = VALID_STATUSES.includes(normalizedInitial)
    ? normalizedInitial
    : "ALL";

  const [filter, setFilter] = useState<BookingFilterStatus>(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppt, setSelectedAppt] =
    useState<DashboardAppointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const queryParams: PatientBookingsQueryParams = useMemo(
    () => ({
      status: filter === "ALL" ? undefined : filter,
      page: 1,
    }),
    [filter]
  );

  // Fetch bookings for current filter
  const {
    data: bookingsResponse,
    isLoading: isQueryLoading,
    isError,
    error,
    refetch,
  } = usePatientBookings(queryParams);

  // Only show skeleton if there is no data in cache yet
  const isLoading = isQueryLoading && !bookingsResponse;

  const cancelMutation = useCancelPatientBooking();

  // Map backend bookings to UI appointment models
  const appointments: DashboardAppointment[] = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    return (bookingsResponse.data as RawBooking[]).map(mapBookingToAppointment);
  }, [bookingsResponse?.data]);

  // Client-side search across doctor name and specialty
  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) return appointments;
    const query = searchQuery.toLowerCase();
    return appointments.filter(
      (b) =>
        b.doctorName.toLowerCase().includes(query) ||
        b.doctorSpecialty.toLowerCase().includes(query)
    );
  }, [appointments, searchQuery]);

  const handleOpenDetails = (appt: DashboardAppointment) => {
    setSelectedAppt(appt);
    setDialogOpen(true);
  };

  const handleCancelAppointment = (id: string) => {
    cancelMutation.mutate({ bookingId: id });
  };

  return (
    <PatientLayout>
      <div className="w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              My Appointments
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              View your consultation schedule, join video appointments, or
              schedule new doctor visits.
            </p>
          </div>

          <Link href="/doctors">
            <Button className="h-10 px-4 sm:px-5 rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Book Appointment</span>
            </Button>
          </Link>
        </div>

        {/* Error Banner with Retry */}
        {isError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-destructive">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-xs sm:text-sm font-medium">
                {error instanceof Error
                  ? error.message
                  : "Unable to load appointments at this time."}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-8 px-3 rounded-xl border-destructive/30 hover:bg-destructive/10 text-destructive text-xs font-semibold gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        )}

        {/* Filter Pills & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Status Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {(
              ["ALL", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"] as const
            ).map((status) => {
              const isCurrent = filter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    isCurrent
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-card text-secondary-text border-border/80 hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {status === "ALL"
                    ? "All Bookings"
                    : status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by doctor or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-xs sm:text-sm rounded-xl border-border/80 bg-card hover:border-primary/40 focus:border-primary shadow-xs"
            />
          </div>
        </div>

        {/* Bookings Table Surface */}
        <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
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
          ) : filteredBookings.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-slate-50/60 dark:bg-slate-900/40 border-b border-border/60">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="py-3 px-6 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Doctor
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Date & Time
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Type
                      </TableHead>
                      <TableHead className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="py-3 px-6 text-right font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border/40">
                    {filteredBookings.map((booking) => (
                      <TableRow
                        key={booking.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                      >
                        <TableCell className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-1 ring-primary/15 shrink-0">
                              <AvatarImage
                                src={booking.doctorAvatar}
                                alt={booking.doctorName}
                              />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                                {booking.doctorName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold text-foreground text-sm truncate">
                                {booking.doctorName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.doctorSpecialty}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 px-4 font-medium text-foreground text-xs sm:text-sm">
                          {booking.dateFormatted} · {booking.timeFormatted}
                        </TableCell>
                        <TableCell className="py-3.5 px-4 text-xs sm:text-sm text-secondary-text">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-foreground font-medium text-xs">
                            {booking.consultationType}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 px-4">
                          <span
                            className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase ${
                              booking.status === "CONFIRMED"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : booking.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : booking.status === "COMPLETED"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.meetLink &&
                              booking.status === "CONFIRMED" && (
                                <a
                                  href={booking.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    size="sm"
                                    className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                  >
                                    <Video className="h-3.5 w-3.5" />
                                    <span>Join Call</span>
                                  </Button>
                                </a>
                              )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDetails(booking)}
                              className="h-8 px-2.5 rounded-lg text-xs font-semibold border-border hover:border-primary hover:text-primary"
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
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={booking.doctorAvatar}
                            alt={booking.doctorName}
                          />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                            {booking.doctorName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {booking.doctorName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.doctorSpecialty}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border uppercase ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : booking.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-secondary-text pt-1">
                      <span className="font-semibold text-foreground">
                        {booking.dateFormatted} · {booking.timeFormatted}
                      </span>
                      <div className="flex items-center gap-2">
                        {booking.meetLink &&
                          booking.status === "CONFIRMED" && (
                            <a
                              href={booking.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                className="h-8 px-2.5 text-xs font-semibold gap-1 bg-emerald-600 text-white"
                              >
                                <Video className="h-3.5 w-3.5" />
                                <span>Join</span>
                              </Button>
                            </a>
                          )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDetails(booking)}
                          className="h-8 px-2.5 text-xs font-semibold"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-10 text-center space-y-3">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">
                No bookings found
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? `No appointments matched "${searchQuery}".`
                  : `You have no ${
                      filter === "ALL" ? "" : filter.toLowerCase()
                    } appointments scheduled.`}
              </p>
              <Link href="/doctors" className="inline-block pt-2">
                <Button size="sm" className="rounded-xl text-xs font-semibold">
                  Find a Doctor
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Appointment Details Modal */}
        <AppointmentDetailsDialog
          appointment={selectedAppt}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCancelAppointment={handleCancelAppointment}
        />
      </div>
    </PatientLayout>
  );
}

export default PatientAppointmentsClient;
