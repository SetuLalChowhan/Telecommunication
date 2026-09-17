"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  UploadCloud,
  FileText,
} from "lucide-react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_DOCTOR_PROFILE } from "@/lib/doctor-mock-data";

export default function DoctorSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: MOCK_DOCTOR_PROFILE.name,
    specialization: MOCK_DOCTOR_PROFILE.specialization,
    bio: MOCK_DOCTOR_PROFILE.bio,
    experienceYears: MOCK_DOCTOR_PROFILE.experienceYears,
    consultationFee: MOCK_DOCTOR_PROFILE.consultationFee,
    bmdcNumber: MOCK_DOCTOR_PROFILE.bmdcNumber,
    designation: MOCK_DOCTOR_PROFILE.designation || "Senior Consultant - Cardiology",
    hospitalAffiliation: MOCK_DOCTOR_PROFILE.hospitalAffiliation,
    clinicAddress: MOCK_DOCTOR_PROFILE.clinicAddress || "Plot 4, Road 2, Section 2, Mirpur, Dhaka 1216",
    degrees: MOCK_DOCTOR_PROFILE.degrees.join(", "),
    languages: MOCK_DOCTOR_PROFILE.languages.join(", "),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DoctorLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/70">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                Profile & Practice Details
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>BMDC Verified</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-secondary-text">
              Manage your public biography, consultation fee, credentials, and chamber information.
            </p>
          </div>
        </div>

        {/* Doctor Settings Form */}
        <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Doctor Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Specialization */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialization">Primary Specialization</Label>
                <Input
                  id="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* BMDC Registration Number */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bmdcNumber">BMDC Registration Number</Label>
                <Input
                  id="bmdcNumber"
                  type="text"
                  value={formData.bmdcNumber}
                  onChange={(e) => setFormData({ ...formData, bmdcNumber: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Consultation Fee */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consultationFee">Consultation Fee (BDT)</Label>
                <Input
                  id="consultationFee"
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData({ ...formData, consultationFee: Number(e.target.value) })
                  }
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Experience Years */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="experienceYears">Years of Experience</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceYears: Number(e.target.value) })
                  }
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Hospital Affiliation */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="hospitalAffiliation">Hospital / Clinic Affiliation</Label>
                <Input
                  id="hospitalAffiliation"
                  type="text"
                  value={formData.hospitalAffiliation}
                  onChange={(e) =>
                    setFormData({ ...formData, hospitalAffiliation: e.target.value })
                  }
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Designation / Current Role */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="designation">Current Role / Designation</Label>
                <Input
                  id="designation"
                  type="text"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  className="h-10 text-xs sm:text-sm rounded-xl"
                  placeholder="e.g. Senior Consultant - Cardiology"
                />
              </div>

              {/* Clinic Location / Address */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="clinicAddress">Clinic / Chamber Location</Label>
                <Input
                  id="clinicAddress"
                  type="text"
                  value={formData.clinicAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, clinicAddress: e.target.value })
                  }
                  className="h-10 text-xs sm:text-sm rounded-xl"
                  placeholder="e.g. Mirpur, Dhaka 1216"
                />
              </div>

              {/* Degrees */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="degrees">Medical Degrees & Certifications (comma separated)</Label>
                <Input
                  id="degrees"
                  type="text"
                  value={formData.degrees}
                  onChange={(e) => setFormData({ ...formData, degrees: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Languages */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="languages">Languages Spoken (comma separated)</Label>
                <Input
                  id="languages"
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Professional Bio */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="bio">Professional Biography</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="text-xs sm:text-sm rounded-xl resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-4">
              <Button type="submit" className="h-9.5 px-4 rounded-xl text-xs sm:text-sm font-semibold gap-1.5 shadow-xs">
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </Button>

              {saved && (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Profile updated successfully!</span>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Verification Credentials Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                BMDC License & Verification Documents
              </h2>
            </div>
            <Link href="/doctor-verification">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-semibold gap-1.5 border-border hover:border-primary hover:text-primary"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload New</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">BMDC_Certificate.pdf</p>
                  <p className="text-[11px] text-muted-foreground">Status: Approved</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                VERIFIED
              </span>
            </div>

            <div className="p-3 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">National_ID_Scan.pdf</p>
                  <p className="text-[11px] text-muted-foreground">Status: Approved</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
