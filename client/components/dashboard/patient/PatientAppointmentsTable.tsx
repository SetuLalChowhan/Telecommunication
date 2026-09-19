"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface PatientAppointmentsTableProps {
  appointments: DashboardAppointment[];
  isLoading?: boolean;
  onOpenDetails: (appointment: DashboardAppointment) => void;
  showViewAllLink?: boolean;
}

export const PatientAppointmentsTable: React.FC<PatientAppointmentsTableProps> = ({
  appointments,
  isLoading = false,
  onOpenDetails,
  showViewAllLink = true,
}) => {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Consultation Appointments
          </h2>
          <p className="text-xs text-muted-foreground">
            Review your scheduled video visits, past records, and booking status.
          </p>
        </div>

        {showViewAllLink && (
          <Link
            href="/patient/appointments"
            className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <div className="hidden md:block">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 py-3 animate-pulse border-b border-border/40 last:border-0"
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
                    <div className="h-8 w-20 bg-muted rounded-lg" />
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
        ) : appointments.length > 0 ? (
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
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/40">
                  {appointments.map((appt) => (
                    <TableRow
                      key={appt.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                    >
                      <TableCell className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-1 ring-primary/15 shrink-0">
                            <AvatarImage
                              src={appt.doctorAvatar}
                              alt={appt.doctorName}
                            />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                              {appt.doctorName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground text-sm truncate">
                              {appt.doctorName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appt.doctorSpecialty}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 font-medium text-foreground text-xs sm:text-sm">
                        {appt.dateFormatted} · {appt.timeFormatted}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-xs sm:text-sm text-secondary-text">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-foreground font-medium text-xs">
                          {appt.consultationType}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase ${
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
                      </TableCell>
                      <TableCell className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {appt.meetLink && appt.status === "CONFIRMED" && (
                            <a
                              href={appt.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              >
                                <Video className="h-3.5 w-3.5" />
                                <span>Join</span>
                              </Button>
                            </a>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenDetails(appt)}
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
              {appointments.map((appt) => (
                <div key={appt.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 shrink-0 ring-1 ring-primary/20">
                        <AvatarImage
                          src={appt.doctorAvatar}
                          alt={appt.doctorName}
                        />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                          {appt.doctorName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-foreground">
                          {appt.doctorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appt.doctorSpecialty}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase ${
                        appt.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : appt.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-secondary-text pt-0.5">
                    <span className="font-semibold text-foreground">
                      {appt.dateFormatted} · {appt.timeFormatted}
                    </span>
                    <div className="flex items-center gap-2">
                      {appt.meetLink && appt.status === "CONFIRMED" && (
                        <a
                          href={appt.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            className="h-8.5 px-3 rounded-xl text-xs font-semibold gap-1 bg-emerald-600 text-white"
                          >
                            <Video className="h-3 w-3" />
                            <span>Join</span>
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenDetails(appt)}
                        className="h-8.5 px-3 rounded-xl text-xs font-medium border-border hover:border-primary/50"
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
          <div className="p-8 text-center space-y-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">
              No recent consultations
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              When you consult with specialists, your appointments and video logs
              will appear here.
            </p>
            <Link href="/doctors" className="inline-block pt-1">
              <Button size="sm" variant="outline" className="text-xs rounded-xl">
                Book Consultation
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PatientAppointmentsTable;
