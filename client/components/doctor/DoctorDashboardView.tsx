"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Video,
  FileCheck2,
  CalendarCheck2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorDashboardViewProps {
  doctorName?: string | null;
  isVerified?: boolean;
  isLoading?: boolean;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  doctorName,
  isVerified = false,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Verification Alert Banner (when verification is pending) */}
      {!isVerified && !isLoading && (
        <div className="rounded-2xl border border-amber-200/90 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  Doctor Verification Required
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                  To start receiving patient consultation requests, please upload your BMDC registration certificate and credentials.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:shrink-0 pl-12 sm:pl-0">
              <Link href="/doctor-verification">
                <Button className="h-9.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-medium rounded-xl shadow-xs transition-colors flex items-center gap-1.5">
                  <span>Upload Documents</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Doctor Workspace Header & Action Bar */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Doctor Console
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isVerified
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }`}
              >
                {isVerified ? (
                  <>
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Doctor</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3" />
                    <span>Verification Pending</span>
                  </>
                )}
              </span>
            </div>

            {isLoading || !doctorName ? (
              <div className="h-8 w-56 bg-muted/70 animate-pulse rounded-lg mt-1.5" />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
                Welcome, Dr. {doctorName}
              </h1>
            )}
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
              Manage your upcoming patient appointments, consultations, and digital health records.
            </p>
          </div>

          {/* Quick Doctor Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Link href="/doctor-verification">
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileCheck2 className="h-4 w-4 text-primary" />
                <span>Verification</span>
              </Button>
            </Link>
            <Link href="/doctors">
              <Button size="sm" className="gap-1.5">
                <Video className="h-4 w-4" />
                <span>Public Profile</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Clinical Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-border">
          <div className="rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary-text">Today&apos;s Appointments</span>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
            <span className="text-[11px] text-secondary-text">No active bookings scheduled</span>
          </div>

          <div className="rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary-text">Total Patients Consulted</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
            <span className="text-[11px] text-secondary-text">Lifetime consultation history</span>
          </div>

          <div className="rounded-xl border border-border bg-slate-50/70 dark:bg-slate-900/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary-text">Slot Length</span>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">20–30 min</p>
            <span className="text-[11px] text-secondary-text">Standard video consultation</span>
          </div>
        </div>
      </div>

      {/* 3. Today's Consultations Schedule & Queue */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="h-5 w-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Today&apos;s Consultation Schedule
            </h2>
          </div>
          <span className="text-xs text-secondary-text font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Empty Schedule State */}
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Video className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-sm font-bold text-foreground">
              No Appointments Scheduled for Today
            </h3>
            <p className="text-xs text-secondary-text leading-relaxed">
              When patients book consultations with you, they will appear here with instant links to start encrypted video calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardView;
