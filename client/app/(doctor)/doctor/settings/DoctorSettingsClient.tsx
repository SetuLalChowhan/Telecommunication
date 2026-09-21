"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Save,
  Loader2,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Video,
  FileCheck2,
  UploadCloud,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  GraduationCap,
  Sparkles,
  Unlink,
} from "lucide-react";
import { toast } from "react-toastify";
import DoctorLayout from "@/layouts/DoctorLayout";
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
import { useGoogleLogin } from "@react-oauth/google";
import { apiClient } from "@/lib/api/axios";
import {
  useMyDoctorProfile,
  useUpdateDoctorProfile,
  useSpecialties,
  useGoogleConnectionStatus,
  useDisconnectGoogle,
} from "@/features/doctors/api/queries";
import { DoctorQualification } from "@/features/doctors/types";

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

  const { data: profile, isLoading: isProfileLoading } = useMyDoctorProfile();
  const updateMutation = useUpdateDoctorProfile();
  const { data: specialties = [] } = useSpecialties();

  const {
    data: googleStatus,
    isLoading: isGoogleLoading,
    refetch: refetchGoogleStatus,
  } = useGoogleConnectionStatus();
  const disconnectGoogleMutation = useDisconnectGoogle();

  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  // Handle Google OAuth callback redirect params
  useEffect(() => {
    const isConnected = searchParams.get("google_connected");
    const googleError = searchParams.get("google_error");

    if (isConnected === "true") {
      toast.success("Google Calendar & Meet successfully connected!");
      refetchGoogleStatus();
      router.replace("/doctor/settings?tab=integrations");
    } else if (googleError) {
      toast.error(decodeURIComponent(googleError));
      router.replace("/doctor/settings?tab=integrations");
    }
  }, [searchParams, router, refetchGoogleStatus]);

  // Avatar Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    bmdcNumber: "",
    designation: "",
    hospitalAffiliation: "",
    clinicAddress: "",
    consultationFee: 0,
    experienceYears: 0,
    bio: "",
    slug: "",
    mainSpecialtyId: "",
  });

  const [qualifications, setQualifications] = useState<DoctorQualification[]>([]);

  // Populate form with doctor profile data
  useEffect(() => {
    if (profile) {
      const u = profile.user;
      const primarySpecialty = profile.specialties?.find((s) => s.isPrimary);
      const firstSpecialty = profile.specialties?.[0];

      setFormData({
        name: u?.name || "",
        phone: u?.phone || "",
        email: u?.email || "",
        bmdcNumber: profile.bmdcNumber || "",
        designation: profile.designation || "",
        hospitalAffiliation: profile.hospitalAffiliation || "",
        clinicAddress: profile.clinicAddress || "",
        consultationFee: Number(profile.fee || 0),
        experienceYears: Number(profile.experienceYears || 0),
        bio: profile.bio || "",
        slug: profile.slug || "",
        mainSpecialtyId:
          primarySpecialty?.specialtyId ||
          firstSpecialty?.specialtyId ||
          "",
      });

      if (profile.qualifications && Array.isArray(profile.qualifications)) {
        setQualifications(
          profile.qualifications.map((q) => ({
            id: q.id,
            degree: q.degree,
            institute: q.institute,
            field: q.field || "",
            passingYear: q.passingYear,
            result: q.result || "",
          }))
        );
      }
    }
  }, [profile]);

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddQualification = () => {
    setQualifications([
      ...qualifications,
      {
        id: `temp-${Date.now()}`,
        degree: "",
        institute: "",
        field: "",
        passingYear: new Date().getFullYear(),
      },
    ]);
  };

  const handleRemoveQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const handleQualificationChange = (
    index: number,
    field: keyof DoctorQualification,
    value: any
  ) => {
    const updated = [...qualifications];
    updated[index] = { ...updated[index], [field]: value };
    setQualifications(updated);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.name) data.append("name", formData.name.trim());
    if (formData.phone) data.append("phone", formData.phone.trim());
    if (formData.bmdcNumber) data.append("bmdcNumber", formData.bmdcNumber.trim());
    if (formData.designation) data.append("designation", formData.designation.trim());
    if (formData.hospitalAffiliation)
      data.append("hospitalAffiliation", formData.hospitalAffiliation.trim());
    if (formData.clinicAddress)
      data.append("clinicAddress", formData.clinicAddress.trim());
    data.append("fee", String(formData.consultationFee));
    data.append("experienceYears", String(formData.experienceYears));
    if (formData.bio) data.append("bio", formData.bio.trim());
    if (formData.slug) data.append("slug", formData.slug.trim());
    if (formData.mainSpecialtyId)
      data.append("mainSpecialtyId", formData.mainSpecialtyId);

    // Filter valid qualifications
    const validQuals = qualifications
      .filter((q) => q.degree && q.degree.trim() && q.institute && q.institute.trim())
      .map((q) => ({
        degree: q.degree.trim(),
        institute: q.institute.trim(),
        field: q.field?.trim() || undefined,
        passingYear: q.passingYear ? Number(q.passingYear) : undefined,
      }));

    validQuals.forEach((q, idx) => {
      data.append(`qualifications[${idx}][degree]`, q.degree);
      data.append(`qualifications[${idx}][institute]`, q.institute);
      if (q.field) data.append(`qualifications[${idx}][field]`, q.field);
      if (q.passingYear)
        data.append(`qualifications[${idx}][passingYear]`, String(q.passingYear));
    });

    if (avatarFile) {
      data.append("image", avatarFile);
    }

    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Profile and practice details updated successfully!");
        setAvatarFile(null);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update profile");
      },
    });
  };

  const triggerGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    scope:
      "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    onSuccess: async (codeResponse) => {
      setIsConnectingGoogle(true);
      try {
        const res = await apiClient.post<{ success: boolean; message?: string }>(
          "/google/connect",
          {
            code: codeResponse.code,
            redirectUri: "postmessage",
          }
        );
        if (res.data?.success || res.status === 200 || res.status === 201) {
          toast.success("Google Calendar & Meet successfully connected!");
          refetchGoogleStatus();
        } else {
          toast.error(res.data?.message || "Failed to link Google account");
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to link Google account");
      } finally {
        setIsConnectingGoogle(false);
      }
    },
    onError: () => {
      setIsConnectingGoogle(false);
      toast.error("Google connection was cancelled or failed.");
    },
  });

  const handleDisconnectGoogle = () => {
    if (
      !confirm(
        "Are you sure you want to disconnect Google Calendar? Newly booked appointments will fallback to default video links."
      )
    ) {
      return;
    }

    disconnectGoogleMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Google Calendar disconnected successfully");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to disconnect Google account");
      },
    });
  };

  const currentAvatar =
    avatarPreview ||
    profile?.user?.image ||
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80";

  return (
    <DoctorLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/70">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Profile & Settings
              </h1>
              {profile?.verified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>BMDC Verified</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Pending Verification</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-secondary-text">
              Manage your personal details, practice fee, chamber address, qualifications, and Google Calendar integration.
            </p>
          </div>
        </div>

        {/* Tab Navigation Navigation Buttons */}
        <div className="flex items-center gap-2 border-b border-border/70 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "profile"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-secondary-text hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile & Practice</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("integrations")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "integrations"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-secondary-text hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Video className="h-4 w-4" />
            <span>Google Meet & Calendar</span>
            {googleStatus?.isConnected && (
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "documents"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-secondary-text hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>License & Verification</span>
          </button>
        </div>

        {/* TAB 1: Profile & Practice Details */}
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar Upload Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-border/70">
                <div className="relative group">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/5 relative bg-muted">
                    <Image
                      src={currentAvatar}
                      alt="Doctor Profile Avatar"
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Upload profile photo"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-[10px] font-medium mt-1">Change</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    className="hidden"
                    onChange={handleAvatarSelect}
                  />
                </div>

                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    Doctor Portrait Photo
                  </h3>
                  <p className="text-xs text-secondary-text max-w-md">
                    Upload a professional medical portrait. This photo will be visible to patients across consultation searches and booking cards.
                  </p>
                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-8 rounded-xl text-xs font-semibold gap-1.5"
                    >
                      <Camera className="h-3.5 w-3.5 text-primary" />
                      <span>Upload New Photo</span>
                    </Button>
                    {avatarFile && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        className="h-8 rounded-xl text-xs text-muted-foreground hover:text-destructive"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal & Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                  <User className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Doctor Identity & Contact
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g. Dr. Jane Smith"
                      className="h-10 text-xs sm:text-sm rounded-xl"
                    />
                  </div>

                  {/* Email Address (Read-only) */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        disabled
                        value={formData.email}
                        className="h-10 text-xs sm:text-sm rounded-xl bg-muted/40 cursor-not-allowed opacity-80 pl-9"
                      />
                      <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="phone" className="text-xs font-semibold text-foreground">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+8801700000000"
                        className="h-10 text-xs sm:text-sm rounded-xl pl-9"
                      />
                      <Phone className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* BMDC Number */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="bmdcNumber" className="text-xs font-semibold text-foreground">
                      BMDC Registration No. <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bmdcNumber"
                      type="text"
                      required
                      value={formData.bmdcNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, bmdcNumber: e.target.value })
                      }
                      placeholder="e.g. A-12345"
                      className="h-10 text-xs sm:text-sm rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Practice Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Clinical Designation & Practice Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Designation */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="designation" className="text-xs font-semibold text-foreground">
                      Designation / Role
                    </Label>
                    <Input
                      id="designation"
                      type="text"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({ ...formData, designation: e.target.value })
                      }
                      placeholder="e.g. Assistant Professor, Dept of Cardiology"
                      className="h-10 text-xs sm:text-sm rounded-xl"
                    />
                  </div>

                  {/* Primary Specialty */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="specialty" className="text-xs font-semibold text-foreground">
                      Primary Specialty
                    </Label>
                    <Select
                      value={formData.mainSpecialtyId}
                      onValueChange={(val) =>
                        setFormData({ ...formData, mainSpecialtyId: val })
                      }
                    >
                      <SelectTrigger id="specialty" className="h-10 text-xs sm:text-sm rounded-xl">
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {specialties.map((s) => (
                          <SelectItem key={s.id} value={s.id} className="text-xs">
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Consultation Fee */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fee" className="text-xs font-semibold text-foreground">
                      Consultation Fee (BDT)
                    </Label>
                    <Input
                      id="fee"
                      type="number"
                      min={0}
                      value={formData.consultationFee}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          consultationFee: Number(e.target.value),
                        })
                      }
                      className="h-10 text-xs sm:text-sm rounded-xl"
                    />
                  </div>

                  {/* Experience Years */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="experienceYears" className="text-xs font-semibold text-foreground">
                      Years of Experience
                    </Label>
                    <Input
                      id="experienceYears"
                      type="number"
                      min={0}
                      value={formData.experienceYears}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          experienceYears: Number(e.target.value),
                        })
                      }
                      className="h-10 text-xs sm:text-sm rounded-xl"
                    />
                  </div>

                  {/* Hospital Affiliation */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="hospital" className="text-xs font-semibold text-foreground">
                      Hospital / Institution Affiliation
                    </Label>
                    <Input
                      id="hospital"
                      type="text"
                      value={formData.hospitalAffiliation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hospitalAffiliation: e.target.value,
                        })
                      }
                      placeholder="e.g. Dhaka Medical College Hospital"
                      className="h-10 text-xs sm:text-sm rounded-xl"
                    />
                  </div>

                  {/* Public SEO Slug */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="slug" className="text-xs font-semibold text-foreground">
                      Custom Profile Slug
                    </Label>
                    <Input
                      id="slug"
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      placeholder="e.g. dr-jane-smith"
                      className="h-10 text-xs sm:text-sm rounded-xl"
                    />
                  </div>

                  {/* Chamber / Clinic Address */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label htmlFor="clinicAddress" className="text-xs font-semibold text-foreground">
                      Chamber / Clinic Physical Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="clinicAddress"
                        type="text"
                        value={formData.clinicAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, clinicAddress: e.target.value })
                        }
                        placeholder="e.g. Suite 402, Green Life Hospital, Dhanmondi, Dhaka"
                        className="h-10 text-xs sm:text-sm rounded-xl pl-9"
                      />
                      <MapPin className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                    </div>
                  </div>

                  {/* Professional Biography */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label htmlFor="bio" className="text-xs font-semibold text-foreground">
                      Professional Biography
                    </Label>
                    <Textarea
                      id="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Write a brief overview of your medical training, clinical focus, and patient care philosophy..."
                      className="text-xs sm:text-sm rounded-xl resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Educational Qualifications Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Degrees & Medical Qualifications
                    </h2>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddQualification}
                    className="h-8 px-3 rounded-xl text-xs font-semibold gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Degree</span>
                  </Button>
                </div>

                <div className="space-y-3">
                  {qualifications.map((qual, idx) => (
                    <div
                      key={qual.id || idx}
                      className="p-3.5 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/30 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                    >
                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <Label className="text-[11px] text-muted-foreground">Degree</Label>
                        <Input
                          placeholder="e.g. MBBS, FCPS, MD"
                          value={qual.degree}
                          onChange={(e) =>
                            handleQualificationChange(idx, "degree", e.target.value)
                          }
                          className="h-9 text-xs rounded-xl"
                        />
                      </div>

                      <div className="sm:col-span-4 flex flex-col gap-1">
                        <Label className="text-[11px] text-muted-foreground">Institute</Label>
                        <Input
                          placeholder="e.g. Dhaka Medical College"
                          value={qual.institute}
                          onChange={(e) =>
                            handleQualificationChange(idx, "institute", e.target.value)
                          }
                          className="h-9 text-xs rounded-xl"
                        />
                      </div>

                      <div className="sm:col-span-3 flex flex-col gap-1">
                        <Label className="text-[11px] text-muted-foreground">Passing Year</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 2018"
                          value={qual.passingYear || ""}
                          onChange={(e) =>
                            handleQualificationChange(
                              idx,
                              "passingYear",
                              Number(e.target.value)
                            )
                          }
                          className="h-9 text-xs rounded-xl"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQualification(idx)}
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {qualifications.length === 0 && (
                    <p className="text-xs text-muted-foreground py-2 text-center">
                      No degrees added. Click &quot;Add Degree&quot; to list your medical credentials.
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border/70 flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="h-10 px-6 rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-xs"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving Profile...</span>
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
          </div>
        )}

        {/* TAB 2: Google Calendar & Meet Integration */}
        {activeTab === "integrations" && (
          <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-6">
            <div className="pb-4 border-b border-border/70 space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Google Calendar & Meet Video Integration
              </h2>
              <p className="text-xs sm:text-sm text-secondary-text">
                Connect your Google account to enable real-time Google Meet video consultations and sync patient bookings directly with your personal calendar.
              </p>
            </div>

            {/* Integration Card */}
            <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 border border-border shadow-xs flex items-center justify-center shrink-0">
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      Google Calendar & Google Meet
                    </h3>
                    {isGoogleLoading ? (
                      <span className="h-4 w-16 bg-muted animate-pulse rounded" />
                    ) : googleStatus?.isConnected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Not Connected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-secondary-text max-w-lg">
                    {googleStatus?.isConnected
                      ? "Your Google account is active. Real Google Meet meeting rooms are automatically generated and linked to your patient bookings."
                      : "Authorize Google Calendar to automatically generate Google Meet URLs for patient consultations and block consultation hours in your calendar."}
                  </p>

                  {googleStatus?.connectedAt && (
                    <p className="text-[11px] text-muted-foreground pt-1">
                      Connected on:{" "}
                      {new Date(googleStatus.connectedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 pt-2 md:pt-0">
                {googleStatus?.isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={disconnectGoogleMutation.isPending}
                    onClick={handleDisconnectGoogle}
                    className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    {disconnectGoogleMutation.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Unlink className="h-3.5 w-3.5" />
                    )}
                    <span>Disconnect Google</span>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={isConnectingGoogle}
                    onClick={() => triggerGoogleLogin()}
                    className="h-9.5 px-4 rounded-xl text-xs font-semibold gap-2 shadow-xs bg-primary hover:bg-primary/90"
                  >
                    {isConnectingGoogle ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Connect Google Account</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* How Google Meet Works Explainer */}
            <div className="rounded-2xl border border-border/70 p-5 space-y-3 bg-muted/15">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                How Google Meet & Calendar Sync Works
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-secondary-text">
                <div className="space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    1. Patient Books
                  </span>
                  <p>When a patient confirms a slot, a unique Google Meet link is automatically provisioned.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    2. Calendar Sync
                  </span>
                  <p>An event is added to your Google Calendar with the patient details and consultation notes.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    3. Join Video Call
                  </span>
                  <p>Both you and the patient can join the Google Meet session right from the appointment dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BMDC License & Documents */}
        {activeTab === "documents" && (
          <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  BMDC Registration & Verification Documents
                </h2>
                <p className="text-xs text-secondary-text">
                  Official clinical license and credential verification files approved by administration.
                </p>
              </div>
              <Link href="/doctor-verification">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8.5 px-3.5 rounded-xl text-xs font-semibold gap-1.5"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Upload Documents</span>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      BMDC Medical Practice License
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      License No: {formData.bmdcNumber || "Registered"}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      National ID / Passport Verification
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Government Issued Identity
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}

export default DoctorSettingsClient;
