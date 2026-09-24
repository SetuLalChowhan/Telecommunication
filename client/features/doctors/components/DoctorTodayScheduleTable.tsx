"use client";

import React from "react";
import Link from "next/link";
import { Video, Check, CheckCircle2, ArrowRight, Loader2, Calendar, Phone } from "lucide-react";
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
import { DoctorScheduleItem } from "@/features/appointments/types";
import { cn } from "@/lib/utils";

interface DoctorTodayScheduleTableProps {
  schedule: DoctorScheduleItem[];
  onMarkComplete: (id: string) => void;
  onConfirm?: (id: string) => void;
  actionLoadingId?: string | null;
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

export const DoctorTodayScheduleTable: React.FC<DoctorTodayScheduleTableProps> = ({
  schedule,
  onMarkComplete,
  onConfirm,
  actionLoadingId = null,
  showViewAllLink = true,
}) => {
  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <div className="min-w-0">
          <h2 className="panel-title">Today&apos;s queue</h2>
          <p className="text-[11px] text-muted-foreground">
            {schedule.length} consultation{schedule.length === 1 ? "" : "s"}{" "}
            scheduled
          </p>
        </div>

        {showViewAllLink && (
          <Link
            href="/doctor/appointments"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {schedule.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Calendar className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Nothing scheduled today
          </p>
          <p className="max-w-xs text-xs text-muted-foreground">
            New patient bookings will appear in this queue automatically.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                    Patient
                  </TableHead>
                  <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                    Time
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
                {schedule.map((item) => {
                  const isLoadingThis = actionLoadingId === item.id;

                  return (
                    <TableRow
                      key={item.id}
                      className="border-0 transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage
                              src={item.patientAvatar}
                              alt={item.patientName}
                            />
                            <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                              {item.patientName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold text-foreground">
                              {item.patientName}
                            </p>
                            <p className="truncate text-[11px] text-muted-foreground">
                              {item.patientAge}y · {item.patientGender}
                            </p>
                            {item.patientPhone && (
                              <a
                                href={`tel:${item.patientPhone}`}
                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Phone className="h-2.5 w-2.5" />
                                <span>{item.patientPhone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-xs font-medium tabular-nums text-foreground">
                        {item.time}
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-xs text-secondary-text">
                        {item.consultationType}
                      </TableCell>
                      <TableCell className="px-4 py-2.5">
                        <span
                          className={cn(
                            "status-chip",
                            statusChip[item.status] ?? statusChip.COMPLETED
                          )}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "PENDING" && onConfirm && (
                            <Button
                              size="sm"
                              disabled={isLoadingThis}
                              onClick={() => onConfirm(item.id)}
                              className="h-7 rounded-md px-2.5 text-xs font-semibold"
                            >
                              {isLoadingThis ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
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
                                className="h-7 rounded-md px-2.5 text-xs font-semibold"
                              >
                                <Video className="h-3 w-3" />
                                <span>Call</span>
                              </Button>
                            </a>
                          )}
                          {item.status === "CONFIRMED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isLoadingThis}
                              onClick={() => onMarkComplete(item.id)}
                              className="h-7 rounded-md px-2.5 text-xs font-semibold"
                            >
                              {isLoadingThis ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                              <span>Done</span>
                            </Button>
                          )}
                          {item.status === "COMPLETED" && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Closed</span>
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile list */}
          <ul className="divide-y divide-border md:hidden">
            {schedule.map((item) => {
              const isLoadingThis = actionLoadingId === item.id;

              return (
                <li key={item.id} className="space-y-2.5 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={item.patientAvatar} alt={item.patientName} />
                        <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                          {item.patientName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {item.patientName}
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {item.time} · {item.patientAge}y · {item.patientGender}
                        </p>
                        {item.patientPhone && (
                          <a
                            href={`tel:${item.patientPhone}`}
                            className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-2.5 w-2.5" />
                            <span>{item.patientPhone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "status-chip shrink-0",
                        statusChip[item.status] ?? statusChip.COMPLETED
                      )}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-1.5">
                    {item.status === "PENDING" && onConfirm && (
                      <Button
                        size="sm"
                        disabled={isLoadingThis}
                        onClick={() => onConfirm(item.id)}
                        className="h-7 rounded-md px-2.5 text-xs font-semibold"
                      >
                        {isLoadingThis ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
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
                          className="h-7 rounded-md px-2.5 text-xs font-semibold"
                        >
                          <Video className="h-3 w-3" />
                          <span>Join</span>
                        </Button>
                      </a>
                    )}
                    {item.status === "CONFIRMED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isLoadingThis}
                        onClick={() => onMarkComplete(item.id)}
                        className="h-7 rounded-md px-2.5 text-xs font-semibold"
                      >
                        {isLoadingThis ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        <span>Done</span>
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
};

export default DoctorTodayScheduleTable;
