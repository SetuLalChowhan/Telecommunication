"use client";

import React from "react";
import { Phone, Calendar, Activity, Droplet, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoctorPatientRegistryItem } from "@/features/doctors/types";

interface DoctorPatientCardProps {
  patient: DoctorPatientRegistryItem;
  onSelect: (patient: DoctorPatientRegistryItem) => void;
}

export const DoctorPatientCard: React.FC<DoctorPatientCardProps> = ({
  patient,
  onSelect,
}) => {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="p-5 rounded-xl border border-border bg-card transition-colors hover:border-primary/40 flex flex-col justify-between gap-4">
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-12 w-12 rounded-lg border border-primary/20 shrink-0">
              <AvatarImage src={patient.image || undefined} alt={patient.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm rounded-lg">
                {getInitials(patient.name || "P")}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-foreground truncate">{patient.name}</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <Phone className="h-3 w-3" />
                <span>{patient.phone || "No phone"}</span>
              </p>
            </div>
          </div>

          {patient.bloodGroup && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
              <Droplet className="h-3 w-3" />
              {patient.bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-").replace("_", " ")}
            </span>
          )}
        </div>

        <div className="space-y-1.5 p-3 rounded-lg bg-muted/40 border border-border text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-primary" />
              Last Consult:
            </span>
            <span className="font-medium text-foreground">
              {patient.lastConsultation
                ? new Date(patient.lastConsultation).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          {patient.lastCondition && (
            <div className="flex items-start justify-between gap-2 text-muted-foreground">
              <span className="flex items-center gap-1 shrink-0">
                <Activity className="h-3 w-3 text-emerald-600" />
                Condition:
              </span>
              <span className="font-medium text-foreground truncate max-w-[150px]">
                {patient.lastCondition}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {patient.consultationCount} visits
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {patient.reportsCount} records
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => onSelect(patient)}
          className="h-8 px-3 rounded-lg text-xs gap-1 hover:bg-muted"
        >
          <span>Records</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
