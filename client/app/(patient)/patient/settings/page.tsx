"use client";

import React, { useState } from "react";
import {
  KeyRound,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import PatientLayout from "@/layouts/PatientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/features/auth/api/client";

export default function PatientSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const authAny = authClient as unknown as {
        changePassword?: (params: {
          currentPassword: string;
          newPassword: string;
          revokeOtherSessions?: boolean;
        }) => Promise<{ error?: { message?: string } }>;
      };

      if (typeof authAny.changePassword === "function") {
        const res = await authAny.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true,
        });

        if (res?.error) {
          toast.error(res.error.message || "Failed to update password.");
          setIsChangingPassword(false);
          return;
        }
      }

      setPasswordSuccess(true);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(
        error?.message || "Failed to update password. Please check your current password."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <PatientLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        {/* Header */}
        <div className="pb-5 border-b border-border/70 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text">
            Manage your account security and update your password.
          </p>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-border/70">
            <KeyRound className="h-4 w-4 text-primary" />
            <h2 className="text-sm sm:text-base font-semibold text-foreground">
              Security & Password
            </h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
              <span className="text-[11px] text-muted-foreground">
                Minimum 8 characters with a mix of letters and numbers.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="h-9.5 px-4 rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-xs"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Update Password</span>
                  </>
                )}
              </Button>

              {passwordSuccess && (
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Password updated!</span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </PatientLayout>
  );
}
