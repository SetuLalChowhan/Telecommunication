"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Droplet, ShieldAlert, Calendar, FileText } from "lucide-react";
import { DoctorPatientRegistryItem } from "@/features/doctors/types";

interface DoctorPatientDetailDialogProps {
  patient: DoctorPatientRegistryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DoctorPatientDetailDialog: React.FC<DoctorPatientDetailDialogProps> = ({
  patient,
  open,
  onOpenChange,
}) => {
  if (!patient) return null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-lg p-6">
        <DialogHeader className="text-left space-y-2">
          <div className="flex items-center gap-3.5">
            <Avatar className="h-14 w-14 rounded-2xl border border-primary/20">
              <AvatarImage src={patient.image || undefined} alt={patient.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-base rounded-2xl">
                {getInitials(patient.name || "P")}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {patient.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                <span>Patient ID: {patient.patientId.slice(-8)}</span>
                {patient.gender && <span>• {patient.gender}</span>}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-muted/40 border border-border/60">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground">{patient.phone || "No phone"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground truncate">{patient.email}</span>
            </div>
            {patient.bloodGroup && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplet className="h-3.5 w-3.5 text-red-600" />
                <span className="font-medium text-foreground">Blood: {patient.bloodGroup}</span>
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="font-medium text-foreground truncate">{patient.address}</span>
              </div>
            )}
          </div>

          {patient.emergencyContactName && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Emergency Contact</span>
              </div>
              <p>{patient.emergencyContactName}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 text-center">
              <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
              <span className="text-[11px] text-muted-foreground">Consultations</span>
              <p className="text-base font-bold text-foreground mt-0.5">{patient.consultationCount}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 text-center">
              <FileText className="h-4 w-4 text-primary mx-auto mb-1" />
              <span className="text-[11px] text-muted-foreground">Medical Records</span>
              <p className="text-base font-bold text-foreground mt-0.5">{patient.reportsCount}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
