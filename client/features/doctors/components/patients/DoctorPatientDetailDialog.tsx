"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  Mail,
  MapPin,
  Droplet,
  ShieldAlert,
  Calendar,
  FileText,
} from "lucide-react";
import { DoctorPatientRegistryItem } from "@/features/doctors/types";

interface DoctorPatientDetailDialogProps {
  patient: DoctorPatientRegistryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatBloodGroup = (value: string) =>
  value
    .replace("_POSITIVE", "+")
    .replace("_NEGATIVE", "-")
    .replace("_", " ");

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

  const stats = [
    {
      label: "Consultations",
      value: patient.consultationCount ?? 0,
      icon: Calendar,
    },
    {
      label: "Medical records",
      value: patient.reportsCount ?? 0,
      icon: FileText,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0 rounded-lg">
              <AvatarImage src={patient.image || undefined} alt={patient.name} />
              <AvatarFallback className="rounded-lg bg-muted text-sm font-semibold text-foreground">
                {getInitials(patient.name || "P")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="truncate">{patient.name}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-x-1.5">
                <span className="font-mono">
                  ID {patient.patientId.slice(-8)}
                </span>
                {patient.gender && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{patient.gender}</span>
                  </>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogBody>
          {/* Contact block */}
          <dl className="grid grid-cols-1 gap-x-4 gap-y-2.5 rounded-md border border-border bg-muted/40 p-3 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <dt className="shrink-0 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                <span className="sr-only">Phone</span>
              </dt>
              <dd className="truncate text-xs font-medium text-foreground">
                {patient.phone || "No phone"}
              </dd>
            </div>

            <div className="flex items-center gap-2">
              <dt className="shrink-0 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="sr-only">Email</span>
              </dt>
              <dd className="truncate text-xs font-medium text-foreground">
                {patient.email || "No email"}
              </dd>
            </div>

            {patient.bloodGroup && (
              <div className="flex items-center gap-2">
                <dt className="shrink-0 text-muted-foreground">
                  <Droplet className="h-3.5 w-3.5" />
                  <span className="sr-only">Blood group</span>
                </dt>
                <dd className="text-xs font-medium text-foreground">
                  {formatBloodGroup(patient.bloodGroup)}
                </dd>
              </div>
            )}

            {patient.address && (
              <div className="flex items-center gap-2 sm:col-span-2">
                <dt className="shrink-0 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="sr-only">Address</span>
                </dt>
                <dd className="truncate text-xs font-medium text-foreground">
                  {patient.address}
                </dd>
              </div>
            )}
          </dl>

          {patient.emergencyContactName && (
            <div className="space-y-1 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-amber-800 dark:text-amber-200">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Emergency contact</span>
              </div>
              <p className="text-xs font-medium">
                {patient.emergencyContactName}
              </p>
            </div>
          )}

          {/* Activity */}
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-md border border-border p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorPatientDetailDialog;
