"use client";

import React from "react";
import { User, Phone, Mail, MapPin, Calendar, HeartPulse } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PatientProfileFormData {
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export const BLOOD_GROUPS = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A-", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B-", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB-", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O-", value: "O_NEGATIVE" },
];

const BLOOD_GROUP_SHORT_MAP: Record<string, string> = {
  "A+": "A_POSITIVE",
  "A-": "A_NEGATIVE",
  "B+": "B_POSITIVE",
  "B-": "B_NEGATIVE",
  "AB+": "AB_POSITIVE",
  "AB-": "AB_NEGATIVE",
  "O+": "O_POSITIVE",
  "O-": "O_NEGATIVE",
};

export const normalizeBloodGroup = (bg?: string | null): string => {
  if (!bg) return "";
  return BLOOD_GROUP_SHORT_MAP[bg] || bg;
};

interface PatientPersonalInfoFieldsProps {
  formData: PatientProfileFormData;
  onChange: (field: keyof PatientProfileFormData, value: string) => void;
  disabled?: boolean;
}

export const PatientPersonalInfoFields: React.FC<PatientPersonalInfoFieldsProps> = ({
  formData,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-card border border-border/80 shadow-xs">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={formData.name}
            disabled={disabled}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="John Doe"
            className="pl-10 h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={formData.phone}
            disabled={disabled}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="+880 1XXXXXXXXX"
            className="pl-10 h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">Email Address (Read-only)</Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={formData.email}
            readOnly
            disabled
            className="pl-10 h-10 rounded-xl bg-muted/60 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">Date of Birth</Label>
        <div className="relative">
          <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={formData.dateOfBirth}
            disabled={disabled}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
            className="pl-10 h-10 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">Gender</Label>
        <Select
          value={formData.gender}
          onValueChange={(val) => onChange("gender", val)}
          disabled={disabled}
        >
          <SelectTrigger className="h-10 rounded-xl">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-foreground">Blood Group</Label>
        <Select
          value={normalizeBloodGroup(formData.bloodGroup)}
          onValueChange={(val) => onChange("bloodGroup", val)}
          disabled={disabled}
        >
          <SelectTrigger className="h-10 rounded-xl">
            <SelectValue placeholder="Select blood group" />
          </SelectTrigger>
          <SelectContent>
            {BLOOD_GROUPS.map((bg) => (
              <SelectItem key={bg.value} value={bg.value}>
                {bg.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label className="text-xs font-semibold text-foreground">Residential Address</Label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={formData.address}
            disabled={disabled}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="House #12, Road #4, Dhanmondi, Dhaka"
            className="pl-10 h-10 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
