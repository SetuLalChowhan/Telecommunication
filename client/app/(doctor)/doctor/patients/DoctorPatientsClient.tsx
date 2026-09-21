"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Phone,
  Calendar,
  Activity,
  Droplet,
  FileText,
  MapPin,
  ShieldAlert,
  Loader2,
  Users,
  ExternalLink,
} from "lucide-react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMyDoctorPatients } from "@/features/doctors/api/queries";
import { DoctorPatientRegistryItem } from "@/features/doctors/types";

export function DoctorPatientsClient() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPatient, setSelectedPatient] =
    useState<DoctorPatientRegistryItem | null>(null);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: patients = [], isLoading, isFetching } =
    useMyDoctorPatients(debouncedSearch);

  const totalPatients = patients.length;
  const totalConsultations = patients.reduce(
    (acc, p) => acc + (p.consultationCount || 0),
    0
  );
  const totalReports = patients.reduce(
    (acc, p) => acc + (p.reportsCount || 0),
    0
  );

  return (
    <DoctorLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              My Patients Registry
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              View your patient records, consultation histories, and clinical diagnoses.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, phone, diagnosis..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9.5 pr-9 h-10 text-xs sm:text-sm rounded-xl"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
            )}
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl border border-border/70 bg-card flex items-center gap-3.5 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider">
                Total Patients
              </p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {totalPatients}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border/70 bg-card flex items-center gap-3.5 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider">
                Total Consultations
              </p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {totalConsultations}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border/70 bg-card flex items-center gap-3.5 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-secondary-text uppercase tracking-wider">
                Medical Records
              </p>
              <p className="text-xl font-bold text-foreground mt-0.5">
                {totalReports} Files
              </p>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-muted rounded" />
                    <div className="h-3 w-1/2 bg-muted rounded" />
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="h-3.5 w-full bg-muted rounded" />
                  <div className="h-3.5 w-4/5 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-card p-12 text-center space-y-3 shadow-xs">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/60" />
            <h3 className="text-base font-bold text-foreground">
              {searchInput
                ? `No patients match "${searchInput}"`
                : "No patient records in registry yet"}
            </h3>
            <p className="text-xs text-secondary-text max-w-sm mx-auto">
              {searchInput
                ? "Try searching by another patient name, diagnosis keyword, or phone number."
                : "Patients will automatically appear here once consultations are scheduled or confirmed."}
            </p>
            {searchInput && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchInput("")}
                className="h-8 rounded-xl text-xs mt-2"
              >
                Clear Search Filter
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {patients.map((patient) => {
              const formattedDate = patient.lastConsultation
                ? new Date(patient.lastConsultation).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent";

              return (
                <div
                  key={patient.patientId}
                  className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-2xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20 shrink-0">
                        <AvatarImage
                          src={patient.image || ""}
                          alt={patient.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {patient.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-bold text-foreground truncate">
                          {patient.name}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {patient.gender || "Patient"} &bull;{" "}
                          <span className="text-foreground font-medium">
                            {patient.consultationCount} visits
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2 border-t border-border/60">
                      <div className="flex items-center gap-2 text-secondary-text">
                        <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-semibold text-foreground">
                          Condition:
                        </span>
                        <span className="truncate">{patient.lastCondition}</span>
                      </div>

                      <div className="flex items-center gap-2 text-secondary-text">
                        <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Last Consultation:</span>
                        <span className="font-medium text-foreground">
                          {formattedDate}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-muted-foreground pt-1">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{patient.phone}</span>
                        </div>
                        {patient.bloodGroup && (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md">
                            <Droplet className="h-3 w-3" />
                            <span>{patient.bloodGroup.replace("_", " ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPatient(patient)}
                      className="w-full h-8.5 rounded-xl text-xs font-semibold gap-1.5 border-border hover:border-primary hover:text-primary"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      <span>View Clinical Summary</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clinical Summary Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <h3 className="text-base font-bold text-foreground">
                  Patient Clinical Profile
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPatient(null)}
                  className="h-8 w-8 p-0 rounded-full text-muted-foreground hover:text-foreground"
                >
                  &times;
                </Button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-14 w-14 ring-2 ring-primary/20 shrink-0">
                    <AvatarImage
                      src={selectedPatient.image || ""}
                      alt={selectedPatient.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {selectedPatient.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground text-base truncate">
                      {selectedPatient.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedPatient.gender || "Patient"} &bull;{" "}
                      {selectedPatient.email}
                    </p>
                    {selectedPatient.bloodGroup && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md mt-1.5">
                        <Droplet className="h-3 w-3" />
                        Blood Group: {selectedPatient.bloodGroup.replace("_", " ")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50/70 dark:bg-slate-900/40 p-3.5 space-y-2 border border-border/70 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Primary Contact:</span>
                    <a
                      href={`tel:${selectedPatient.phone}`}
                      className="font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <Phone className="h-3 w-3" />
                      {selectedPatient.phone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Diagnosis:</span>
                    <span className="font-semibold text-foreground">
                      {selectedPatient.lastCondition}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Consultations Count:</span>
                    <span className="font-semibold text-foreground">
                      {selectedPatient.consultationCount} completed sessions
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last Visit Date:</span>
                    <span className="font-semibold text-foreground">
                      {selectedPatient.lastConsultation
                        ? new Date(
                            selectedPatient.lastConsultation
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  {selectedPatient.address && (
                    <div className="flex items-start justify-between gap-2 pt-1 border-t border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                        <MapPin className="h-3 w-3" /> Address:
                      </span>
                      <span className="font-medium text-foreground text-right">
                        {selectedPatient.address}
                      </span>
                    </div>
                  )}

                  {selectedPatient.emergencyContactName && (
                    <div className="flex items-center justify-between pt-1 border-t border-border/50">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <ShieldAlert className="h-3 w-3 text-amber-500" /> Emergency:
                      </span>
                      <span className="font-medium text-foreground">
                        {selectedPatient.emergencyContactName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Patient Records Info */}
                <div className="rounded-xl bg-primary/5 p-3.5 space-y-2 border border-primary/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-primary" />
                      Patient Medical Records
                    </span>
                    <span className="text-[11px] text-primary font-bold">
                      {selectedPatient.reportsCount || 0} Files
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary-text">
                    Patient medical history records are linked to consultation bookings.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/70 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setSelectedPatient(null)}
                  className="h-9 px-5 rounded-xl text-xs font-semibold"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}

export default DoctorPatientsClient;
