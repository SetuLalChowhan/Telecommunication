"use client";

import React from "react";
import { User, Phone, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientEmergencyContactFieldsProps {
  emergencyContactName: string;
  emergencyContactPhone: string;
  onChange: (field: "emergencyContactName" | "emergencyContactPhone", value: string) => void;
  disabled?: boolean;
}

export const PatientEmergencyContactFields: React.FC<PatientEmergencyContactFieldsProps> = ({
  emergencyContactName,
  emergencyContactPhone,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <div>
          <h4 className="text-sm font-semibold text-foreground">Emergency Contact Details</h4>
          <p className="text-xs text-muted-foreground">
            Contact person in case of urgent medical scenarios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Contact Person Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={emergencyContactName}
              disabled={disabled}
              onChange={(e) => onChange("emergencyContactName", e.target.value)}
              placeholder="e.g. Jane Doe (Spouse)"
              className="pl-10 h-10 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-foreground">Contact Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={emergencyContactPhone}
              disabled={disabled}
              onChange={(e) => onChange("emergencyContactPhone", e.target.value)}
              placeholder="+880 1XXXXXXXXX"
              className="pl-10 h-10 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
