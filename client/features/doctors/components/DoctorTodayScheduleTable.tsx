"use client";

import React from "react";
import Link from "next/link";
import { Video, Check, CheckCircle2, ArrowRight } from "lucide-react";
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
import { DoctorScheduleItem } from "@/lib/dashboard-mock-data";

interface DoctorTodayScheduleTableProps {
  schedule: DoctorScheduleItem[];
  onMarkComplete: (id: string) => void;
  onConfirm?: (id: string) => void;
  showViewAllLink?: boolean;
}

export const DoctorTodayScheduleTable: React.FC<DoctorTodayScheduleTableProps> = ({
  schedule,
  onMarkComplete,
  onConfirm,
  showViewAllLink = true,
}) => {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-foreground">
            Today&apos;s Schedule
          </h2>
          <p className="text-xs text-muted-foreground">
            {schedule.length} consultations scheduled for today
          </p>
        </div>

        {showViewAllLink && (
          <Link
            href="/doctor/appointments"
            className="text-xs font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
        {/* Desktop Table */}
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
              {schedule.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                  <TableCell className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-1 ring-primary/15 shrink-0">
                        <AvatarImage src={item.patientAvatar} alt={item.patientName} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                          {item.patientName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-bold text-foreground text-sm truncate">{item.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.patientAge}y · {item.patientGender}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 px-4 font-medium text-foreground text-xs sm:text-sm">
                    {item.time}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs sm:text-sm text-secondary-text">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-foreground font-medium text-xs">
                      {item.consultationType}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase ${
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
                    <div className="flex items-center justify-end gap-2">
                      {item.status === "PENDING" && onConfirm && (
                        <Button
                          size="sm"
                          onClick={() => onConfirm(item.id)}
                          className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Confirm</span>
                        </Button>
                      )}
                      {item.meetLink && item.status === "CONFIRMED" && (
                        <a href={item.meetLink} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Video className="h-3.5 w-3.5" />
                            <span>Call</span>
                          </Button>
                        </a>
                      )}
                      {item.status === "CONFIRMED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkComplete(item.id)}
                          className="h-8 px-2.5 rounded-lg text-xs font-semibold border-border hover:border-emerald-500 hover:text-emerald-600"
                        >
                          <Check className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>Done</span>
                        </Button>
                      )}
                      {item.status === "COMPLETED" && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Done</span>
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Stacked Responsive Cards */}
        <div className="md:hidden divide-y divide-border/60">
          {schedule.map((item) => (
            <div key={item.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
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
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
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

              <div className="flex items-center justify-end gap-2 pt-1">
                {item.status === "PENDING" && onConfirm && (
                  <Button
                    size="sm"
                    onClick={() => onConfirm(item.id)}
                    className="h-8 px-3 rounded-lg text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
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
                    onClick={() => onMarkComplete(item.id)}
                    className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    <span>Done</span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorTodayScheduleTable;
