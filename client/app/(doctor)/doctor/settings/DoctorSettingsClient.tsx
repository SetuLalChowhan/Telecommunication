"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useMyDoctorProfile,
  useUpdateDoctorProfile,
  useSpecialties,
  useGoogleConnectionStatus,
  useDisconnectGoogle,
} from "@/features/doctors/api/queries";
import { DoctorProfileTab, DoctorProfileFormData } from "@/features/doctors/components/settings/DoctorProfileTab";
import { DoctorGoogleTab } from "@/features/doctors/components/settings/DoctorGoogleTab";
import { DoctorDocumentsTab } from "@/features/doctors/components/settings/DoctorDocumentsTab";

export function DoctorSettingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"profile" | "integrations" | "documents">(
    tabParam === "integrations"
      ? "integrations"
      : tabParam === "documents"
      ? "documents"
      : "profile"
  );

  const { data: profile, isLoading: isProfileLoading, refetch: refetchProfile } = useMyDoctorProfile();
  const updateMutation = useUpdateDoctorProfile();
  const { data: specialties = [] } = useSpecialties();
  const { data: googleStatus, isLoading: isGoogleLoading, refetch: refetchGoogleStatus } = useGoogleConnectionStatus();
  const disconnectGoogleMutation = useDisconnectGoogle();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<DoctorProfileFormData>({
    name: "",
    phone: "",
    email: "",
    bmdcNumber: "",
    designation: "",
    hospitalAffiliation: "",
    clinicAddress: "",
    fee: "",
    experienceYears: "",
    bio: "",
    primarySpecialtyId: "",
    qualifications: [],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.user?.name || "",
        phone: profile.user?.phone || "",
        email: profile.user?.email || "",
        bmdcNumber: profile.bmdcNumber || "",
        designation: profile.designation || "",
        hospitalAffiliation: profile.hospitalAffiliation || "",
        clinicAddress: profile.clinicAddress || "",
        fee: profile.fee ? String(profile.fee) : "",
        experienceYears: profile.experienceYears ? String(profile.experienceYears) : "",
        bio: profile.bio || "",
        primarySpecialtyId:
          profile.specialties?.find((s: any) => s.isPrimary)?.specialtyId ||
          profile.specialties?.[0]?.specialtyId ||
          "",
        qualifications: profile.qualifications || [],
      });
    }
  }, [profile]);

  const handleFieldChange = (field: keyof DoctorProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarSelect = (file: File) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    if (avatarFile) data.append("image", avatarFile);
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("designation", formData.designation);
    data.append("bmdcNumber", formData.bmdcNumber);
    data.append("hospitalAffiliation", formData.hospitalAffiliation);
    data.append("clinicAddress", formData.clinicAddress);
    if (formData.fee) data.append("fee", formData.fee);
    if (formData.experienceYears) data.append("experienceYears", formData.experienceYears);
    data.append("bio", formData.bio);
    if (formData.primarySpecialtyId) data.append("primarySpecialtyId", formData.primarySpecialtyId);
    data.append("qualifications", JSON.stringify(formData.qualifications));

    try {
      await updateMutation.mutateAsync(data);
      toast.success("Doctor profile successfully updated");
      setAvatarFile(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update profile");
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await disconnectGoogleMutation.mutateAsync();
      toast.success("Google account disconnected");
      refetchGoogleStatus();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to disconnect Google");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Doctor Account & Practice Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your credentials, calendar integrations, and verification documents.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile & Bio</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("integrations")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "integrations"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Google Calendar & Meet</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "documents"
              ? "bg-card text-foreground shadow-xs border border-border"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Verification & Credentials</span>
        </button>
      </div>

      {/* Main Content Area */}
      {isProfileLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {activeTab === "profile" && (
            <DoctorProfileTab
              formData={formData}
              specialties={specialties}
              currentImageUrl={profile?.user?.image}
              previewUrl={avatarPreview}
              isSaving={updateMutation.isPending}
              onFieldChange={handleFieldChange}
              onAvatarSelect={handleAvatarSelect}
              onSubmit={handleSubmitProfile}
            />
          )}

          {activeTab === "integrations" && (
            <DoctorGoogleTab
              isConnected={Boolean(googleStatus?.isConnected)}
              connectedAt={googleStatus?.connectedAt}
              isLoading={isGoogleLoading}
              onRefresh={refetchGoogleStatus}
              onDisconnect={handleDisconnectGoogle}
              isDisconnecting={disconnectGoogleMutation.isPending}
            />
          )}

          {activeTab === "documents" && (
            <DoctorDocumentsTab
              documents={profile?.documents || []}
              isVerified={Boolean(profile?.verified)}
              onRefresh={refetchProfile}
            />
          )}
        </>
      )}
    </div>
  );
}

export default DoctorSettingsClient;
