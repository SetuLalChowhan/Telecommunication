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
      <div className="w-full space-y-6 sm:space-y-7">
        {/* Header */}
        <div className="pb-5 border-b border-border/70 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text">
            Update your personal contact details, residential address, and emergency information.
          </p>
        </div>

        {/* Profile Form Card */}
        <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  disabled
                  value={formData.email}
                  className="h-10 text-xs sm:text-sm rounded-xl bg-muted/40 cursor-not-allowed opacity-80"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gender">Gender</Label>
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
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(val) => setFormData({ ...formData, bloodGroup: val })}
                >
                  <SelectTrigger id="bloodGroup" className="h-10 text-xs sm:text-sm rounded-xl">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A_POSITIVE" className="text-xs">A+</SelectItem>
                    <SelectItem value="A_NEGATIVE" className="text-xs">A-</SelectItem>
                    <SelectItem value="B_POSITIVE" className="text-xs">B+</SelectItem>
                    <SelectItem value="B_NEGATIVE" className="text-xs">B-</SelectItem>
                    <SelectItem value="AB_POSITIVE" className="text-xs">AB+</SelectItem>
                    <SelectItem value="AB_NEGATIVE" className="text-xs">AB-</SelectItem>
                    <SelectItem value="O_POSITIVE" className="text-xs">O+</SelectItem>
                    <SelectItem value="O_NEGATIVE" className="text-xs">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Residential Address */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="address">Residential Address</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address, apartment, city"
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Emergency Contact Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactName: e.target.value })
                  }
                  placeholder="e.g. Nusrat Jahan"
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>

              {/* Emergency Contact Phone */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  type="text"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactPhone: e.target.value })
                  }
                  placeholder="+880 1819-765432"
                  className="h-10 text-xs sm:text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/70 flex items-center justify-between gap-4">
              <Button type="submit" className="h-9.5 px-4 rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-xs">
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
