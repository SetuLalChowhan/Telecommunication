"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  usePatientProfile,
  useUpdatePatientProfile,
} from "@/features/patients/api/queries";
import { PatientAvatarEditor } from "@/features/patients/components/profile/PatientAvatarEditor";
import {
  PatientPersonalInfoFields,
  PatientProfileFormData,
} from "@/features/patients/components/profile/PatientPersonalInfoFields";
import { PatientEmergencyContactFields } from "@/features/patients/components/profile/PatientEmergencyContactFields";

export function PatientProfileClient() {
  const { data: profile, isLoading } = usePatientProfile();
  const updateMutation = useUpdatePatientProfile();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<PatientProfileFormData>({
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  useEffect(() => {
    if (profile) {
      const u = profile.user;
      let dobStr = "";
      if (u?.dateOfBirth) {
        try {
          dobStr = new Date(u.dateOfBirth).toISOString().split("T")[0];
        } catch {}
      }

      setFormData({
        name: u?.name || "",
        phone: u?.phone || "",
        email: u?.email || "",
        dateOfBirth: dobStr,
        gender: profile.gender || "",
        bloodGroup: profile.bloodGroup || "",
        address: profile.address || "",
        emergencyContactName: profile.emergencyContactName || "",
        emergencyContactPhone: profile.emergencyContactPhone || "",
      });
    }
  }, [profile]);

  const handleFieldChange = (field: keyof PatientProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarSelect = (file: File) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.name) data.append("name", formData.name.trim());
    if (formData.phone) data.append("phone", formData.phone.trim());
    if (formData.dateOfBirth) data.append("dateOfBirth", formData.dateOfBirth);
    if (formData.gender) data.append("gender", formData.gender);
    if (formData.bloodGroup) data.append("bloodGroup", formData.bloodGroup);
    if (formData.address) data.append("address", formData.address.trim());
    if (formData.emergencyContactName) {
      data.append("emergencyContactName", formData.emergencyContactName.trim());
    }
    if (formData.emergencyContactPhone) {
      data.append("emergencyContactPhone", formData.emergencyContactPhone.trim());
    }
    if (avatarFile) data.append("image", avatarFile);

    try {
      await updateMutation.mutateAsync(data);
      setAvatarFile(null);
    } catch {
      // Toast already shown in mutation onError
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Patient Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information, emergency contact, and medical identity.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <PatientAvatarEditor
            currentImageUrl={profile?.user?.image}
            previewUrl={avatarPreview}
            patientName={formData.name}
            onFileSelect={handleAvatarSelect}
            disabled={updateMutation.isPending}
          />

          <PatientPersonalInfoFields
            formData={formData}
            onChange={handleFieldChange}
            disabled={updateMutation.isPending}
          />

          <PatientEmergencyContactFields
            emergencyContactName={formData.emergencyContactName}
            emergencyContactPhone={formData.emergencyContactPhone}
            onChange={(field, val) => handleFieldChange(field, val)}
            disabled={updateMutation.isPending}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold gap-2 shadow-sm shadow-primary/20"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PatientProfileClient;
