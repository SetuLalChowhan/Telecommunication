"use client";

import React, { useState, useEffect } from "react";
import { Users, Loader2 } from "lucide-react";
import { useMyDoctorPatients } from "@/features/doctors/api/queries";
import { DoctorPatientRegistryItem } from "@/features/doctors/types";
import { DoctorPatientsHeader } from "@/features/doctors/components/patients/DoctorPatientsHeader";
import { DoctorPatientCard } from "@/features/doctors/components/patients/DoctorPatientCard";
import { DoctorPatientDetailDialog } from "@/features/doctors/components/patients/DoctorPatientDetailDialog";

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
    <div className="w-full space-y-6 sm:space-y-7">
      <DoctorPatientsHeader
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        isFetching={isFetching}
        totalPatients={totalPatients}
        totalConsultations={totalConsultations}
        totalReports={totalReports}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : patients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-card border border-border">
          <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No patients found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {debouncedSearch
              ? "No patients match your search filter. Try clearing or changing your query."
              : "Patients who book consultations with you will automatically appear in your registry."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <DoctorPatientCard
              key={patient.patientId}
              patient={patient}
              onSelect={(selected) => setSelectedPatient(selected)}
            />
          ))}
        </div>
      )}

      <DoctorPatientDetailDialog
        patient={selectedPatient}
        open={Boolean(selectedPatient)}
        onOpenChange={(open) => !open && setSelectedPatient(null)}
      />
    </div>
  );
}

export default DoctorPatientsClient;
