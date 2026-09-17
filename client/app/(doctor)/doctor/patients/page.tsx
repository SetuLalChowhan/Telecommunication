"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Phone,
  Calendar,
  Activity,
  Droplet,
  FileText,
} from "lucide-react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_DOCTOR_PATIENTS, DoctorPatientRecord } from "@/lib/doctor-mock-data";

export default function DoctorPatientsPage() {
  const [patients] = useState<DoctorPatientRecord[]>(MOCK_DOCTOR_PATIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<DoctorPatientRecord | null>(null);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastCondition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  return (
    <DoctorLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              My Patients
            </h1>
            <p className="text-xs sm:text-sm text-secondary-text">
              View your patient records, consultation histories, and clinical diagnoses.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, diagnosis, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs rounded-xl"
            />
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20 shrink-0">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {patient.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-bold text-foreground truncate">
                      {patient.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {patient.age} yrs &bull; {patient.gender}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-1 border-t border-border">
                  <div className="flex items-center gap-2 text-secondary-text">
                    <Activity className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="font-semibold text-foreground">Diagnosis:</span>
                    <span className="truncate">{patient.lastCondition}</span>
                  </div>

                  <div className="flex items-center gap-2 text-secondary-text">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Last Visit:</span>
                    <span className="font-medium text-foreground">{patient.lastVisitDate}</span>
                    <span className="text-muted-foreground">({patient.totalVisits} visits)</span>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-md">
                      <Droplet className="h-3 w-3" />
                      <span>{patient.bloodGroup}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
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
          ))}
        </div>

        {/* Clinical Summary Modal / Drawer */}
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-bold text-foreground">
                  Patient Summary
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPatient(null)}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  &times;
                </Button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={selectedPatient.avatar} alt={selectedPatient.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {selectedPatient.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">
                      {selectedPatient.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedPatient.age} yrs &bull; {selectedPatient.gender} &bull; Blood: {selectedPatient.bloodGroup}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50/70 dark:bg-slate-900/40 p-3 space-y-1.5 border border-border text-xs">
                  <p>
                    <span className="font-semibold text-foreground">Phone:</span> {selectedPatient.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Primary Condition:</span> {selectedPatient.lastCondition}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Total Consultations:</span> {selectedPatient.totalVisits}
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Last Consultation:</span> {selectedPatient.lastVisitDate}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => setSelectedPatient(null)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold"
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
