"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  FileText,
  Stethoscope,
  Video,
  ArrowRight,
  Download,
  CalendarCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_BOOKINGS, MOCK_MEDICAL_REPORTS } from "@/lib/patient-mock-data";

interface PatientDashboardViewProps {
  patientName?: string | null;
  isLoading?: boolean;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = ({
  patientName,
  isLoading = false,
}) => {
  const name = patientName || "Patient";

  const upcomingCount = MOCK_BOOKINGS.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING"
  ).length;
  const completedCount = MOCK_BOOKINGS.filter((b) => b.status === "COMPLETED").length;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider block">
            Patient Dashboard
          </span>
          {isLoading ? (
            <div className="h-9 sm:h-10 w-56 bg-muted/70 animate-pulse rounded-xl" />
          ) : (
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Welcome, {name}
            </h1>
          )}
          <p className="text-sm sm:text-base text-secondary-text leading-relaxed">
            Manage your doctor bookings, join video consultations, and view your uploaded medical reports.
          </p>
        </div>

        <Link href="/doctors" className="shrink-0">
          <Button className="h-11 sm:h-12 px-5 sm:px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm sm:text-base gap-2.5 shadow-xs">
            <Stethoscope className="h-4.5 w-4.5" />
            <span>Book Appointment</span>
          </Button>
        </Link>
      </div>

      {/* 2. 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-sm sm:text-base font-medium text-secondary-text">
            <span>Upcoming Bookings</span>
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{upcomingCount}</p>
          <span className="text-xs sm:text-sm text-muted-foreground block">Active appointments</span>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-sm sm:text-base font-medium text-secondary-text">
            <span>Completed Visits</span>
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{completedCount}</p>
          <span className="text-xs sm:text-sm text-muted-foreground block">Past consultations</span>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-sm sm:text-base font-medium text-secondary-text">
            <span>Medical Reports</span>
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">{MOCK_MEDICAL_REPORTS.length}</p>
          <span className="text-xs sm:text-sm text-muted-foreground block">Uploaded files</span>
        </div>
      </div>

      {/* 3. Recent Bookings Section */}
      <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <CalendarCheck2 className="h-5.5 w-5.5 text-primary" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              Recent Bookings
            </h2>
          </div>
          <Link
            href="/patient/appointments"
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1.5"
          >
            <span>View all</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {MOCK_BOOKINGS.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-900/20 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all hover:border-primary/40 hover:shadow-xs"
            >
              {/* Doctor Details */}
              <div className="flex items-center gap-4">
                <Avatar className="h-13 w-13 sm:h-15 sm:w-15 ring-2 ring-primary/20 shrink-0">
                  <AvatarImage src={booking.doctor.avatar} alt={booking.doctor.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    DR
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {booking.doctor.name}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                        booking.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : booking.status === "PENDING"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-primary font-semibold">
                    {booking.doctor.specialty}
                  </p>
                  <p className="text-xs sm:text-sm text-secondary-text font-medium">
                    {booking.slotStart}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                {booking.meetLink && booking.status === "CONFIRMED" && (
                  <a
                    href={booking.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold gap-2 shadow-xs">
                      <Video className="h-4 w-4" />
                      <span>Join Meet</span>
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Medical Reports Section */}
      <div className="rounded-2xl sm:rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <FileText className="h-5.5 w-5.5 text-primary" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
              Medical Reports
            </h2>
          </div>
          <Link
            href="/patient/records"
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1.5"
          >
            <span>View all reports</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {MOCK_MEDICAL_REPORTS.map((report) => (
            <div
              key={report.id}
              className="p-5 sm:p-6 rounded-2xl border border-border bg-slate-50/50 dark:bg-slate-900/20 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-foreground truncate mt-3">
                  {report.fileName}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Uploaded on {report.uploadedAt}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm text-primary font-medium truncate max-w-[140px]">
                  {report.doctorName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => alert(`Downloading ${report.fileName}...`)}
                  className="h-8.5 sm:h-9 px-3 text-xs sm:text-sm text-primary hover:bg-primary/10 font-semibold gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardView;
