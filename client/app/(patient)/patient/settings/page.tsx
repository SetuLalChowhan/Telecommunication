"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  KeyRound,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/features/auth/api/client";
import { PageHeader } from "@/components/layout";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function PatientSettingsPage() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
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
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
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
      reset();
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
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage account security and password."
      />

      <section className="panel max-w-xl overflow-hidden">
        <div className="panel-header">
          <h2 className="panel-title">Security &amp; password</h2>
          <KeyRound className="h-4 w-4 text-muted-foreground" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              disabled={isChangingPassword}
              placeholder="••••••••••••"
              className={`h-9 rounded-md text-sm ${
                errors.currentPassword ? "border-error focus-visible:ring-error" : ""
              }`}
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-xs text-error font-medium">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              disabled={isChangingPassword}
              placeholder="••••••••••••"
              className={`h-9 rounded-md text-sm ${
                errors.newPassword ? "border-error focus-visible:ring-error" : ""
              }`}
              {...register("newPassword")}
            />
            {errors.newPassword ? (
              <p className="text-xs text-error font-medium">{errors.newPassword.message}</p>
            ) : (
              <span className="text-[11px] text-muted-foreground">
                Minimum 8 characters with a mix of letters and numbers.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              disabled={isChangingPassword}
              placeholder="••••••••••••"
              className={`h-9 rounded-md text-sm ${
                errors.confirmPassword ? "border-error focus-visible:ring-error" : ""
              }`}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-error font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="h-8 rounded-md px-3 text-xs font-semibold gap-2"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Update password</span>
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
      </section>
    </div>
  );
}
