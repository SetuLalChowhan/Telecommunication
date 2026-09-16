"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Bell,
  CheckCircle2,
  Save,
} from "lucide-react";
import PatientLayout from "@/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PatientSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
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
            Preferences & Security
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
            Update your account password, manage SMS consultation reminders, and test your telemedicine audio/video setup.
          </p>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Security & Password
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-5 max-w-lg">
            <div className="flex flex-col gap-2 sm:gap-2.5">
              <Label htmlFor="currentPassword" className="text-sm font-semibold text-foreground">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••••••"
                className="h-11 sm:h-12 rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 sm:gap-2.5">
              <Label htmlFor="newPassword" className="text-sm font-semibold text-foreground">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••••••"
                className="h-11 sm:h-12 rounded-xl text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 sm:gap-2.5">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                className="h-11 sm:h-12 rounded-xl text-sm"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="h-10.5 px-5 rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-xs">
                <Save className="h-4 w-4" />
                <span>Update Password</span>
              </Button>
            </div>

            {saved && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Password updated successfully!</span>
              </p>
            )}
          </form>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              Consultation Notifications
            </h2>
          </div>

          <div className="space-y-3 max-w-xl text-xs sm:text-sm">
            <label className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer hover:border-primary/40 transition-colors">
              <div>
                <span className="font-bold text-foreground block">SMS Appointment Reminders</span>
                <span className="text-xs text-secondary-text">Receive SMS 30 minutes before your video call</span>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-primary rounded cursor-pointer" />
            </label>

            <label className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer hover:border-primary/40 transition-colors">
              <div>
                <span className="font-bold text-foreground block">e-Prescription Ready Alerts</span>
                <span className="text-xs text-secondary-text">Instant notification when physician uploads prescription</span>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-primary rounded cursor-pointer" />
            </label>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
