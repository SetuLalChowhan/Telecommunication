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
import { DashboardAppointment } from "@/features/appointments/types";
import { cn } from "@/lib/utils";

interface PatientAppointmentsTableProps {
  appointments: DashboardAppointment[];
  isLoading?: boolean;
  onOpenDetails: (appointment: DashboardAppointment) => void;
  showViewAllLink?: boolean;
}

const statusChip: Record<string, string> = {
  CONFIRMED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PENDING:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  COMPLETED: "border-border bg-muted text-muted-foreground",
  CANCELLED: "border-border bg-muted text-muted-foreground",
};

export const PatientAppointmentsTable: React.FC<PatientAppointmentsTableProps> = ({
  appointments,
  isLoading = false,
  onOpenDetails,
  showViewAllLink = true,
}) => {
  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <div className="min-w-0">
          <h2 className="panel-title">Recent consultations</h2>
          <p className="text-[11px] text-muted-foreground">
            {appointments.length} on record
          </p>
        </div>

        {showViewAllLink && (
          <Link
            href="/patient/appointments"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="divide-y divide-border">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted/70" />
              </div>
              <div className="hidden h-3.5 w-28 animate-pulse rounded bg-muted sm:block" />
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Calendar className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No consultations yet
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Past and upcoming visits will be listed here once you consult a
            specialist.
          </p>
          <Link href="/doctors" className="pt-1">
            <Button size="sm" variant="outline" className="h-8 rounded-md text-xs">
              Book consultation
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                    Doctor
                  </TableHead>
                  <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                    Date &amp; time
                  </TableHead>
                  <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                    Type
                  </TableHead>
                  <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="h-9 px-4 text-right text-[10px] tracking-wider">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {appointments.map((appt) => (
                  <TableRow
                    key={appt.id}
                    className="border-0 transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage
                            src={appt.doctorAvatar}
                            alt={appt.doctorName}
                          />
                          <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                            {appt.doctorName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-foreground">
                            {appt.doctorName}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {appt.doctorSpecialty}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-xs font-medium tabular-nums text-foreground">
                      {appt.dateFormatted} · {appt.timeFormatted}
                    </TableCell>
                    <TableCell className="px-4 py-2.5 text-xs text-secondary-text">
                      {appt.consultationType}
                    </TableCell>
                    <TableCell className="px-4 py-2.5">
                      <span
                        className={cn(
                          "status-chip",
                          statusChip[appt.status] ?? statusChip.COMPLETED
                        )}
                      >
                        {appt.status}
                      </span>
                    </TableCell>
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
                              className="h-7 rounded-md px-2.5 text-xs font-semibold"
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
                          className="h-7 rounded-md px-2.5 text-xs font-semibold"
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

          {/* Mobile list */}
          <ul className="divide-y divide-border md:hidden">
            {appointments.map((appt) => (
              <li key={appt.id} className="space-y-2.5 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={appt.doctorAvatar} alt={appt.doctorName} />
                      <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                        {appt.doctorName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {appt.doctorName}
                      </p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {appt.doctorSpecialty}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "status-chip shrink-0",
                      statusChip[appt.status] ?? statusChip.COMPLETED
                    )}
                  >
                    {appt.status}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
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
                          className="h-7 rounded-md px-2.5 text-xs font-semibold"
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
                      className="h-7 rounded-md px-2.5 text-xs font-semibold"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default PatientAppointmentsTable;
