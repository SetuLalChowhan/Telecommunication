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

function formatBloodGroup(bg?: string | null): string {
  if (!bg) return "Unknown";
  const map: Record<string, string> = {
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  };
  return map[bg] || bg.replace("_", " ");
}

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
    <div className="w-full space-y-4 sm:space-y-5">
      <DoctorPatientsHeader
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        isFetching={isFetching}
        totalPatients={totalPatients}
        totalConsultations={totalConsultations}
        totalReports={totalReports}
      />

      {/* Main Clean Minimal Shadcn Table */}
      <div className="panel overflow-hidden">
        {isLoading && patients.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : patients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Users className="h-4 w-4" />
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
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Patient
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Age / Gender
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Blood Group
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Last Consultation
                    </TableHead>
                    <TableHead className="h-9 px-4 text-[10px] tracking-wider">
                      Visits & Reports
                    </TableHead>
                    <TableHead className="h-9 px-4 text-right text-[10px] tracking-wider">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
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
                        className="border-0 transition-colors hover:bg-muted/50"
                      >
                        {/* Patient info */}
                        <TableCell className="px-4 py-2.5">
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
                        <TableCell className="px-4 py-2.5 text-xs text-secondary-text">
                          <span>{patient.gender || "Patient"}</span>
                        </TableCell>

                        {/* Blood Group */}
                        <TableCell className="px-4 py-2.5">
                          <span className="inline-block rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                            {formatBloodGroup(patient.bloodGroup)}
                          </span>
                        </TableCell>

                        {/* Last Consultation */}
                        <TableCell className="px-4 py-2.5 text-xs font-medium tabular-nums text-foreground">
                          {lastVisitFormatted}
                        </TableCell>

                        {/* Stats */}
                        <TableCell className="px-4 py-2.5 text-xs text-muted-foreground">
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
                        <TableCell className="px-4 py-2.5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                            className="h-7 rounded-md px-2.5 text-xs font-medium"
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
            <div className="divide-y divide-border md:hidden">
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
                            {patient.gender || "Patient"} &bull; {patient.bloodGroup ? formatBloodGroup(patient.bloodGroup) : ""}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                        className="h-7 rounded-md px-2.5 text-xs font-medium"
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
