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
    hospitalAffiliation: MOCK_DOCTOR_PROFILE.hospitalAffiliation,
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
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="pb-3.5 border-b border-border space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-wider block">
              Doctor Settings
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" />
              <span>BMDC Verified</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight leading-tight">
            Profile & Practice Details
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
            Update your public doctor profile, consultation fee, medical degrees, and hospital affiliations.
          </p>
        </div>

        {/* Doctor Settings Form */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                  Doctor Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Specialization */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialization" className="text-xs font-semibold text-foreground">
                  Primary Specialization
                </Label>
                <Input
                  id="specialization"
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* BMDC Registration Number */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bmdcNumber" className="text-xs font-semibold text-foreground">
                  BMDC Registration Number
                </Label>
                <Input
                  id="bmdcNumber"
                  type="text"
                  value={formData.bmdcNumber}
                  onChange={(e) => setFormData({ ...formData, bmdcNumber: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Consultation Fee */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consultationFee" className="text-xs font-semibold text-foreground">
                  Consultation Fee (BDT)
                </Label>
                <Input
                  id="consultationFee"
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData({ ...formData, consultationFee: Number(e.target.value) })
                  }
                  className="h-10 text-xs rounded-xl"
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
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({ ...formData, experienceYears: Number(e.target.value) })
                  }
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Hospital Affiliation */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="hospitalAffiliation" className="text-xs font-semibold text-foreground">
                  Hospital / Institute Affiliation
                </Label>
                <Input
                  id="hospitalAffiliation"
                  type="text"
                  value={formData.hospitalAffiliation}
                  onChange={(e) =>
                    setFormData({ ...formData, hospitalAffiliation: e.target.value })
                  }
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Degrees */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="degrees" className="text-xs font-semibold text-foreground">
                  Medical Degrees & Certifications (comma separated)
                </Label>
                <Input
                  id="degrees"
                  type="text"
                  value={formData.degrees}
                  onChange={(e) => setFormData({ ...formData, degrees: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Languages */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="languages" className="text-xs font-semibold text-foreground">
                  Languages Spoken (comma separated)
                </Label>
                <Input
                  id="languages"
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              {/* Professional Bio */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="bio" className="text-xs font-semibold text-foreground">
                  Professional Biography
                </Label>
                <Textarea
                  id="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-4">
              <Button type="submit" className="h-9.5 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs">
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
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4.5 w-4.5 text-primary" />
              <h2 className="text-base font-bold text-foreground">
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
            <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4.5 w-4.5 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">BMDC_Certificate.pdf</p>
                  <p className="text-[11px] text-muted-foreground">Status: Approved</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                VERIFIED
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4.5 w-4.5 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">National_ID_Scan.pdf</p>
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
