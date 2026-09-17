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
        <div className="pb-3.5 border-b border-border/70 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text">
            Update your account password, manage SMS consultation reminders, and notification preferences.
          </p>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-border/70">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              Security & Password
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="••••••••••••"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••••••"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••••••"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="h-9.5 px-4 rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-xs">
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
        <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-border/70">
            <Bell className="h-4 w-4 text-primary" />
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              Consultation Notifications
            </h2>
          </div>

          <div className="space-y-2.5 max-w-xl text-xs sm:text-sm">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer hover:border-primary/40 transition-colors">
              <div>
                <span className="font-semibold text-foreground block">SMS Appointment Reminders</span>
                <span className="text-xs text-secondary-text">Receive SMS 30 minutes before your video call</span>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-primary rounded cursor-pointer" />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer hover:border-primary/40 transition-colors">
              <div>
                <span className="font-semibold text-foreground block">e-Prescription Ready Alerts</span>
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
