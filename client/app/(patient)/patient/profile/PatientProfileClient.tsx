"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  User,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  AlertCircle,
  Save,
  Loader2,
  Camera,
  Calendar,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import PatientLayout from "@/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  usePatientProfile,
  useUpdatePatientProfile,
} from "@/features/patients/api/queries";

export function PatientProfileClient() {
  const { data: profile, isLoading } = usePatientProfile();
  const updateMutation = useUpdatePatientProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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

  // Populate form when data loads or updates
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

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.name) data.append("name", formData.name.trim());
    if (formData.phone) data.append("phone", formData.phone.trim());
    if (formData.dateOfBirth) data.append("dateOfBirth", formData.dateOfBirth);
    if (formData.gender) data.append("gender", formData.gender);
    if (formData.bloodGroup) data.append("bloodGroup", formData.bloodGroup);
    if (formData.address) data.append("address", formData.address.trim());
    if (formData.emergencyContactName)
      data.append("emergencyContactName", formData.emergencyContactName.trim());
    if (formData.emergencyContactPhone)
      data.append("emergencyContactPhone", formData.emergencyContactPhone.trim());

    if (avatarFile) {
      data.append("image", avatarFile);
    }

    updateMutation.mutate(data, {
      onSuccess: () => {
        setAvatarFile(null);
      },
    });
  };

  const isSaving = updateMutation.isPending;
  const currentAvatar =
    avatarPreview ||
    profile?.user?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

  return (
    <PatientLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        {/* Header */}
        <div className="pb-5 border-b border-border/70 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            My Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text">
            Update your personal contact details, residential address, emergency contacts, and profile photo.
          </p>
        </div>

        {/* Quick Summary Pill Bar */}
        {profile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl border border-border/70 bg-card flex flex-col justify-between">
              <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
                Total Consultations
              </span>
              <span className="text-xl font-bold text-foreground mt-1">
                {profile._count?.bookings ?? 0}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-border/70 bg-card flex flex-col justify-between">
              <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
                Medical Reports
              </span>
              <span className="text-xl font-bold text-foreground mt-1">
                {profile._count?.medicalReports ?? 0}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-border/70 bg-card flex flex-col justify-between">
              <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
                Blood Group
              </span>
              <span className="text-sm font-bold text-primary mt-1">
                {profile.bloodGroup ? profile.bloodGroup.replace("_", " ") : "Not set"}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-border/70 bg-card flex flex-col justify-between">
              <span className="text-[11px] font-medium text-secondary-text uppercase tracking-wider">
                Account Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>
          </div>
        )}

        {/* Profile Form Card */}
        <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-border/70">
              <div className="relative group">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-primary/30 ring-4 ring-primary/5 relative bg-muted">
                  <Image
                    src={currentAvatar}
                    alt="Profile Avatar"
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
                  Profile Photo
                </h3>
                <p className="text-xs text-secondary-text max-w-sm">
                  Upload a clear portrait photo. Supported formats: JPG, PNG, WEBP (Max 5MB).
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

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <User className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Personal Information
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+8801700000000"
                      className="h-10 text-xs sm:text-sm rounded-xl pl-9"
                    />
                    <Phone className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dateOfBirth" className="text-xs font-semibold text-foreground">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="h-10 text-xs sm:text-sm rounded-xl"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="gender" className="text-xs font-semibold text-foreground">
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) => setFormData({ ...formData, gender: val })}
                  >
                    <SelectTrigger id="gender" className="h-10 text-xs sm:text-sm rounded-xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE" className="text-xs">
                        Male
                      </SelectItem>
                      <SelectItem value="FEMALE" className="text-xs">
                        Female
                      </SelectItem>
                      <SelectItem value="OTHER" className="text-xs">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Blood Group */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="bloodGroup" className="text-xs font-semibold text-foreground">
                    Blood Group
                  </Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(val) => setFormData({ ...formData, bloodGroup: val })}
                  >
                    <SelectTrigger id="bloodGroup" className="h-10 text-xs sm:text-sm rounded-xl">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A_POSITIVE" className="text-xs">A+ (A Positive)</SelectItem>
                      <SelectItem value="A_NEGATIVE" className="text-xs">A- (A Negative)</SelectItem>
                      <SelectItem value="B_POSITIVE" className="text-xs">B+ (B Positive)</SelectItem>
                      <SelectItem value="B_NEGATIVE" className="text-xs">B- (B Negative)</SelectItem>
                      <SelectItem value="AB_POSITIVE" className="text-xs">AB+ (AB Positive)</SelectItem>
                      <SelectItem value="AB_NEGATIVE" className="text-xs">AB- (AB Negative)</SelectItem>
                      <SelectItem value="O_POSITIVE" className="text-xs">O+ (O Positive)</SelectItem>
                      <SelectItem value="O_NEGATIVE" className="text-xs">O- (O Negative)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Residential Address */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="address" className="text-xs font-semibold text-foreground">
                    Residential Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka 1209"
                      className="h-10 text-xs sm:text-sm rounded-xl pl-9"
                    />
                    <MapPin className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contacts Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-1 border-b border-border/50">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-foreground">
                  Emergency Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Emergency Contact Name */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="emergencyContactName"
                    className="text-xs font-semibold text-foreground"
                  >
                    Emergency Contact Name
                  </Label>
                  <Input
                    id="emergencyContactName"
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactName: e.target.value,
                      })
                    }
                    placeholder="e.g. Jane Doe / Spouse / Parent"
                    className="h-10 text-xs sm:text-sm rounded-xl"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="emergencyContactPhone"
                    className="text-xs font-semibold text-foreground"
                  >
                    Emergency Contact Phone
                  </Label>
                  <Input
                    id="emergencyContactPhone"
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactPhone: e.target.value,
                      })
                    }
                    placeholder="+8801700000001"
                    className="h-10 text-xs sm:text-sm rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-border/70 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="h-10 px-6 rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-xs"
              >
                {isSaving ? (
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
      </div>
    </PatientLayout>
  );
}
