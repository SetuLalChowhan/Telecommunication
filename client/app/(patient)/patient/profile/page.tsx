"use client";

import React, { useState } from "react";
import { Save, CheckCircle2 } from "lucide-react";
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
import { useAuth } from "@/lib/api";

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "Tanvir Hossain",
    email: user?.email || "tanvir.hossain@example.com",
    address: "House 42, Road 9/A, Dhanmondi, Dhaka",
    gender: "MALE",
    bloodGroup: "O_POSITIVE",
    emergencyContactName: "Nusrat Jahan",
    emergencyContactPhone: "+880 1819-765432",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PatientLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="pb-4 border-b border-border space-y-2 max-w-xl">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
            Update your personal contact details, residential address, and emergency information.
          </p>
        </div>

        {/* Profile Form Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="h-11 sm:h-12 rounded-xl text-sm"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={formData.email}
                  className="h-11 sm:h-12 rounded-xl text-sm bg-muted/50 cursor-not-allowed opacity-80"
                />
              </div>

              {/* Gender (shadcn Select) */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <Label htmlFor="gender" className="text-sm font-semibold text-foreground">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => setFormData({ ...formData, gender: val })}
                >
                  <SelectTrigger
                    id="gender"
                    className="h-11 sm:h-12 w-full rounded-xl border border-border bg-card px-3.5 sm:px-4 text-sm font-medium text-foreground shadow-subtle focus:ring-2 focus:ring-primary/20"
                  >
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border border-border bg-popover p-1.5 shadow-xl">
                    <SelectItem value="MALE" className="rounded-xl text-sm cursor-pointer">
                      Male
                    </SelectItem>
                    <SelectItem value="FEMALE" className="rounded-xl text-sm cursor-pointer">
                      Female
                    </SelectItem>
                    <SelectItem value="OTHER" className="rounded-xl text-sm cursor-pointer">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Blood Group (shadcn Select) */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <Label htmlFor="bloodGroup" className="text-sm font-semibold text-foreground">
                  Blood Group
                </Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(val) => setFormData({ ...formData, bloodGroup: val })}
                >
                  <SelectTrigger
                    id="bloodGroup"
                    className="h-11 sm:h-12 w-full rounded-xl border border-border bg-card px-3.5 sm:px-4 text-sm font-medium text-foreground shadow-subtle focus:ring-2 focus:ring-primary/20"
                  >
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border border-border bg-popover p-1.5 shadow-xl">
                    <SelectItem value="A_POSITIVE" className="rounded-xl text-sm cursor-pointer">A+</SelectItem>
                    <SelectItem value="A_NEGATIVE" className="rounded-xl text-sm cursor-pointer">A-</SelectItem>
                    <SelectItem value="B_POSITIVE" className="rounded-xl text-sm cursor-pointer">B+</SelectItem>
                    <SelectItem value="B_NEGATIVE" className="rounded-xl text-sm cursor-pointer">B-</SelectItem>
                    <SelectItem value="AB_POSITIVE" className="rounded-xl text-sm cursor-pointer">AB+</SelectItem>
                    <SelectItem value="AB_NEGATIVE" className="rounded-xl text-sm cursor-pointer">AB-</SelectItem>
                    <SelectItem value="O_POSITIVE" className="rounded-xl text-sm cursor-pointer">O+</SelectItem>
                    <SelectItem value="O_NEGATIVE" className="rounded-xl text-sm cursor-pointer">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Residential Address */}
              <div className="flex flex-col gap-2 sm:gap-2.5 sm:col-span-2">
                <Label htmlFor="address" className="text-sm font-semibold text-foreground">
                  Residential Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, apartment, city"
                  className="h-11 sm:h-12 rounded-xl text-sm"
                />
              </div>

              {/* Emergency Contact Name */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <Label htmlFor="emergencyContactName" className="text-sm font-semibold text-foreground">
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergencyContactName"
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactName: e.target.value })
                  }
                  placeholder="e.g. Nusrat Jahan"
                  className="h-11 sm:h-12 rounded-xl text-sm"
                />
              </div>

              {/* Emergency Contact Phone */}
              <div className="flex flex-col gap-2 sm:gap-2.5">
                <Label htmlFor="emergencyContactPhone" className="text-sm font-semibold text-foreground">
                  Emergency Contact Phone
                </Label>
                <Input
                  id="emergencyContactPhone"
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactPhone: e.target.value })
                  }
                  placeholder="+880 1819-765432"
                  className="h-11 sm:h-12 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
              <Button type="submit" className="h-10.5 px-5 rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-xs">
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </Button>

              {saved && (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Profile updated successfully!</span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </PatientLayout>
  );
}
