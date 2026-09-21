"use client";

import React, { useState, useEffect } from "react";
import { Users, Loader2, Calendar, FileText, Phone, Mail } from "lucide-react";
import { useMyDoctorPatients } from "@/features/doctors/api/queries";
import { DoctorPatientRegistryItem } from "@/features/doctors/types";
import { DoctorPatientsHeader } from "@/features/doctors/components/patients/DoctorPatientsHeader";
import { DoctorPatientDetailDialog } from "@/features/doctors/components/patients/DoctorPatientDetailDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function DoctorPatientsClient() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatientRegistryItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: patients = [], isLoading, isFetching } = useMyDoctorPatients(debouncedSearch);

  const totalPatients = patients.length;
  const totalConsultations = patients.reduce((acc, p) => acc + (p.consultationCount || 0), 0);
  const totalReports = patients.reduce((acc, p) => acc + (p.reportsCount || 0), 0);

  return (
    <div className="w-full space-y-5">
      <DoctorPatientsHeader
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        isFetching={isFetching}
        totalPatients={totalPatients}
        totalConsultations={totalConsultations}
        totalReports={totalReports}
      />

      {/* Main Clean Minimal Shadcn Table */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-xs">
        {isLoading && patients.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-11 w-11 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground mb-3">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">No patients found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {debouncedSearch
                ? "No patients match your search filter. Try clearing or changing your query."
                : "Patients who book consultations with you will automatically appear in your registry."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-border/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="py-2.5 px-5 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Patient
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Age / Gender
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Blood Group
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Last Consultation
                    </TableHead>
                    <TableHead className="py-2.5 px-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Visits & Reports
                    </TableHead>
                    <TableHead className="py-2.5 px-5 text-right font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/40">
                  {patients.map((patient) => {
                    const patientName = patient.name || "Patient";
                    const lastVisitFormatted = patient.lastConsultation
                      ? new Date(patient.lastConsultation).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Never";

                    return (
                      <TableRow
                        key={patient.patientId}
                        className="hover:bg-muted/40 transition-colors group"
                      >
                        {/* Patient info */}
                        <TableCell className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 ring-1 ring-primary/15 shrink-0">
                              <AvatarImage src={patient.image || ""} alt={patientName} />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">
                                {patientName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                                {patientName}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {patient.email || patient.phone || "No contact info"}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Gender */}
                        <TableCell className="py-3 px-4 text-xs text-secondary-text">
                          <span>{patient.gender || "Patient"}</span>
                        </TableCell>

                        {/* Blood Group */}
                        <TableCell className="py-3 px-4">
                          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 border border-rose-500/20">
                            {patient.bloodGroup ? patient.bloodGroup.replace("_", " ") : "Unknown"}
                          </span>
                        </TableCell>

                        {/* Last Consultation */}
                        <TableCell className="py-3 px-4 text-xs font-medium text-foreground">
                          {lastVisitFormatted}
                        </TableCell>

                        {/* Stats */}
                        <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {patient.consultationCount || 0}
                          </span>{" "}
                          visits &bull;{" "}
                          <span className="font-semibold text-foreground">
                            {patient.reportsCount || 0}
                          </span>{" "}
                          reports
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="py-3 px-5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                            className="h-7.5 px-2.5 rounded-lg text-xs font-medium border-border/80 hover:border-primary/50"
                          >
                            View Medical File
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-border/60">
              {patients.map((patient) => {
                const patientName = patient.name || "Patient";
                return (
                  <div key={patient.patientId} className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="h-8.5 w-8.5 shrink-0 ring-1 ring-primary/20">
                          <AvatarImage src={patient.image || ""} alt={patientName} />
                          <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-bold">
                            {patientName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {patientName}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {patient.gender || "Patient"} &bull; {patient.bloodGroup ? patient.bloodGroup.replace("_", " ") : ""}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                        className="h-7 px-2.5 rounded-lg text-xs font-medium border-border"
                      >
                        File
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <DoctorPatientDetailDialog
        patient={selectedPatient}
        open={Boolean(selectedPatient)}
        onOpenChange={(open) => !open && setSelectedPatient(null)}
      />
    </div>
  );
}

export default DoctorPatientsClient;
