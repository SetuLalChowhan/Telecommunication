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
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorDashboardViewProps {
  doctorName?: string;
  isVerified?: boolean;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  doctorName = "Doctor",
  isVerified = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Verification notice if not verified */}
      {!isVerified && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-amber-900">
                Doctor Profile Verification Required
              </h3>
              <p className="text-xs sm:text-sm text-amber-700 mt-0.5">
                Please upload your medical credentials and license so patients can book appointments with you.
              </p>
            </div>
          </div>
          <Link href="/doctor-verification">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
              <span>Upload Documents</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Doctor Metrics & Summary */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Doctor Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Welcome, Dr. {doctorName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your patient schedule, appointments, and consultation records.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isVerified ? "Verified Doctor" : "Verification Pending"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Today&apos;s Appointments</span>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
            <span className="text-xs text-muted-foreground">No bookings today</span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Total Patients Consulted</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
            <span className="text-xs text-muted-foreground">Lifetime records</span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Consultation Duration</span>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">30 min</p>
            <span className="text-xs text-muted-foreground">Default slot length</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardView;
