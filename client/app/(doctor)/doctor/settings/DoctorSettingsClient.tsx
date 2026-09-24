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
import { PageHeader } from "@/components/layout";

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
    slug: "",
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

  // Sync the form with the loaded profile. Adjusting state while rendering is
  // React's recommended alternative to a `setState`-inside-`useEffect`.
  const [syncedProfile, setSyncedProfile] = useState<typeof profile>(undefined);
  if (profile && profile !== syncedProfile) {
    setSyncedProfile(profile);
    setFormData({
      name: profile.user?.name || "",
      slug: profile.slug || "",
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
        profile.specialties?.find((s) => s.isPrimary)?.specialtyId ||
        profile.specialties?.[0]?.specialtyId ||
        "",
      qualifications: profile.qualifications || [],
    });
  }

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
    data.append("name", formData.name.trim());
    data.append("phone", formData.phone.trim());
    data.append("designation", formData.designation.trim());
    data.append("bmdcNumber", formData.bmdcNumber.trim());
    data.append("hospitalAffiliation", formData.hospitalAffiliation.trim());
    data.append("clinicAddress", formData.clinicAddress.trim());
    if (formData.fee) data.append("fee", formData.fee);
    if (formData.experienceYears) data.append("experienceYears", formData.experienceYears);
    data.append("bio", formData.bio.trim());
    // Only sent when the doctor actually edited it. An untouched field means
    // "keep the URL derived from my name", and a blank one must not clear it.
    const nextSlug = formData.slug.trim();
    if (nextSlug && nextSlug !== (profile?.slug || "")) {
      data.append("slug", nextSlug);
    }
    if (formData.primarySpecialtyId) {
      data.append("primarySpecialtyId", formData.primarySpecialtyId);
      data.append("mainSpecialtyId", formData.primarySpecialtyId);
    }
    
    const sanitizedQualifications = (formData.qualifications || [])
      .map((q) => ({
        degree: q.degree?.trim() || "",
        institute: q.institute?.trim() || "",
        ...(q.field ? { field: q.field.trim() } : {}),
        ...(q.passingYear ? { passingYear: Number(q.passingYear) } : {}),
        ...(q.result ? { result: q.result.trim() } : {}),
      }))
      .filter((q) => q.degree && q.institute);

    data.append("qualifications", JSON.stringify(sanitizedQualifications));

    try {
      const updatedProfile = await updateMutation.mutateAsync(data);
      if (updatedProfile && (updatedProfile as any).qualifications) {
        setFormData((prev) => ({
          ...prev,
          qualifications: (updatedProfile as any).qualifications,
        }));
      }
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
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Account"
        title="Profile & practice"
        description="Credentials, calendar integrations and verification documents."
      />

      {/* Tab Switcher */}
      <div
        role="tablist"
        aria-label="Settings sections"
        className="flex w-full items-center gap-0.5 overflow-x-auto border-b border-border"
      >
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold transition-colors ${
            activeTab === "profile"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile & Bio</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("integrations")}
          className={`-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold transition-colors ${
            activeTab === "integrations"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Google Calendar & Meet</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`-mb-px flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-xs font-semibold transition-colors ${
            activeTab === "documents"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
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
