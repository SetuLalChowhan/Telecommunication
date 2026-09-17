"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Video } from "lucide-react";
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
  onOpenDetails: (appointment: DashboardAppointment) => void;
  showViewAllLink?: boolean;
}

export const PatientAppointmentsTable: React.FC<PatientAppointmentsTableProps> = ({
  appointments,
  onOpenDetails,
  showViewAllLink = true,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Consultation Appointments
          </h2>
          <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
            Review your scheduled video visits, past records, and booking status.
          </p>
        </div>

        {showViewAllLink && (
          <Link
            href="/patient/appointments"
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-900/50">
              <TableRow>
                <TableHead className="py-3.5 px-5 font-semibold text-xs sm:text-sm">Doctor</TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-xs sm:text-sm">Date & Time</TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-xs sm:text-sm">Type</TableHead>
                <TableHead className="py-3.5 px-4 font-semibold text-xs sm:text-sm">Status</TableHead>
                <TableHead className="py-3.5 px-5 text-right font-semibold text-xs sm:text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <TableCell className="py-4 px-5">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-10 w-10 ring-1 ring-primary/20">
                        <AvatarImage src={appt.doctorAvatar} alt={appt.doctorName} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                          {appt.doctorName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground text-sm">{appt.doctorName}</p>
                        <p className="text-xs text-muted-foreground">{appt.doctorSpecialty}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4 font-semibold text-foreground text-sm">
                    {appt.dateFormatted} · {appt.timeFormatted}
                  </TableCell>
                  <TableCell className="py-4 px-4 text-secondary-text font-medium text-sm">
                    {appt.consultationType}
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border uppercase ${
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
                  <TableCell className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {appt.meetLink && appt.status === "CONFIRMED" && (
                        <a href={appt.meetLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="h-8 px-3 rounded-lg text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Video className="h-3.5 w-3.5" />
                            <span>Join</span>
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenDetails(appt)}
                        className="h-8 px-3 rounded-lg text-xs font-semibold hover:border-primary hover:text-primary"
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
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={appt.doctorAvatar} alt={appt.doctorName} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                      {appt.doctorName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{appt.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{appt.doctorSpecialty}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border uppercase ${
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

              <div className="flex items-center justify-between text-xs text-secondary-text pt-1">
                <span className="font-semibold text-foreground">{appt.dateFormatted} · {appt.timeFormatted}</span>
                <div className="flex items-center gap-2">
                  {appt.meetLink && appt.status === "CONFIRMED" && (
                    <a href={appt.meetLink} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="h-8 px-2.5 text-xs font-semibold gap-1 bg-emerald-600 text-white">
                        <Video className="h-3.5 w-3.5" />
                        <span>Join</span>
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenDetails(appt)}
                    className="h-8 px-2.5 text-xs font-semibold"
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PatientAppointmentsTable;
