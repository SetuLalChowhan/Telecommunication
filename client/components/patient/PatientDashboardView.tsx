"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  FileCheck2,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientDashboardViewProps {
  patientName?: string | null;
  isLoading?: boolean;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = ({
  patientName,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Patient Portal
            </span>
            {isLoading || !patientName ? (
              <div className="h-8 sm:h-9 w-48 sm:w-64 bg-muted/70 animate-pulse rounded-lg mt-1" />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                Hello, {patientName}
              </h1>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Welcome to your personal telehealth dashboard.
            </p>
          </div>
          <Link href="/doctors">
            <Button className="bg-primary hover:bg-primary-dark text-white shadow-sm">
              <Stethoscope className="h-4 w-4 mr-2" />
              <span>Find a Doctor</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Upcoming Appointments</span>
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
            <span className="text-xs text-muted-foreground">No upcoming consultations</span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Past Consultations</span>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">0</p>
            <span className="text-xs text-muted-foreground">Medical history</span>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/30 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Health Records</span>
              <FileCheck2 className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">Active</p>
            <span className="text-xs text-muted-foreground">Profile synced</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardView;
