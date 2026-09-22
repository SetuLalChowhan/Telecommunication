"use client";

import React from "react";
import { User, Phone, Mail, MapPin, Save, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorAvatarUploader } from "./DoctorAvatarUploader";
import { DoctorQualificationsManager } from "./DoctorQualificationsManager";
import { DoctorQualification, Specialty } from "@/features/doctors/types";

export interface DoctorProfileFormData {
  name: string;
  phone: string;
  email: string;
  bmdcNumber: string;
  designation: string;
  hospitalAffiliation: string;
  clinicAddress: string;
  fee: string;
  experienceYears: string;
  bio: string;
  primarySpecialtyId: string;
  qualifications: DoctorQualification[];
}

interface DoctorProfileTabProps {
  formData: DoctorProfileFormData;
  specialties: Specialty[];
  currentImageUrl?: string | null;
  previewUrl?: string | null;
  isSaving: boolean;
  onFieldChange: (field: keyof DoctorProfileFormData, value: any) => void;
  onAvatarSelect: (file: File) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const DoctorProfileTab: React.FC<DoctorProfileTabProps> = ({
  formData,
  specialties,
  currentImageUrl,
  previewUrl,
  isSaving,
  onFieldChange,
  onAvatarSelect,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <DoctorAvatarUploader
        currentImageUrl={currentImageUrl}
        previewUrl={previewUrl}
        doctorName={formData.name}
        onFileSelect={onAvatarSelect}
        disabled={isSaving}
      />

      <div className="panel grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={formData.name}
              disabled={isSaving}
              onChange={(e) => onFieldChange("name", e.target.value)}
              placeholder="Dr. Full Name"
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
              disabled={isSaving}
              onChange={(e) => onFieldChange("phone", e.target.value)}
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
          <Label className="text-xs font-semibold text-foreground">BMDC Registration Number</Label>
          <Input
            value={formData.bmdcNumber}
            disabled={isSaving}
            onChange={(e) => onFieldChange("bmdcNumber", e.target.value)}
            placeholder="A-12345"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground">Designation / Title</Label>
          <Input
            value={formData.designation}
            disabled={isSaving}
            onChange={(e) => onFieldChange("designation", e.target.value)}
            placeholder="Associate Professor, Cardiology"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground">Primary Specialty</Label>
          <Select
            value={formData.primarySpecialtyId}
            onValueChange={(val) => onFieldChange("primarySpecialtyId", val)}
            disabled={isSaving}
          >
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Select primary specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((spec) => (
                <SelectItem key={spec.id} value={spec.id}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground">Hospital / Medical Center Affiliation</Label>
          <Input
            value={formData.hospitalAffiliation}
            disabled={isSaving}
            onChange={(e) => onFieldChange("hospitalAffiliation", e.target.value)}
            placeholder="Dhaka Medical College & Hospital"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground">Consultation Fee (BDT)</Label>
          <Input
            type="number"
            value={formData.fee}
            disabled={isSaving}
            onChange={(e) => onFieldChange("fee", e.target.value)}
            placeholder="1000"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground">Years of Clinical Experience</Label>
          <Input
            type="number"
            value={formData.experienceYears}
            disabled={isSaving}
            onChange={(e) => onFieldChange("experienceYears", e.target.value)}
            placeholder="8"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-foreground">Clinic / Chamber Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={formData.clinicAddress}
              disabled={isSaving}
              onChange={(e) => onFieldChange("clinicAddress", e.target.value)}
              placeholder="Suite 4B, HealthTower, Dhanmondi"
              className="pl-10 h-10 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-semibold text-foreground">Professional Bio & Patient Introduction</Label>
          <Textarea
            rows={4}
            value={formData.bio}
            disabled={isSaving}
            onChange={(e) => onFieldChange("bio", e.target.value)}
            placeholder="Write a brief overview of your background, specializations, and patient care philosophy..."
            className="rounded-xl resize-none text-sm"
          />
        </div>
      </div>

      <DoctorQualificationsManager
        qualifications={formData.qualifications}
        onChange={(quals) => onFieldChange("qualifications", quals)}
        disabled={isSaving}
      />

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSaving}
          className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm shadow-primary/20"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
