"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";

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

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (_values: ChangePasswordFormValues) => {
    try {
      setApiError("");
      // Simulate/Trigger API update
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        reset();
        onOpenChange(false);
      }, 1500);
    } catch {
      setApiError("Failed to update password. Please verify current password.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] p-6 sm:p-7">
        <DialogHeader className="mb-5">
          <DialogTitle className="text-lg font-bold text-foreground">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-xs text-secondary-text mt-1">
            Enter your current password and choose a secure new password.
          </DialogDescription>
        </DialogHeader>

        {apiError && (
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium mb-3">
            {apiError}
          </div>
        )}

        {success ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-semibold text-foreground">
              Password updated successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
                placeholder="••••••••"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
              {errors.currentPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...register("newPassword")}
                placeholder="At least 8 characters"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
              {errors.newPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder="Re-type new password"
                className="h-10 text-xs sm:text-sm rounded-xl"
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 px-4 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-9 px-5 text-xs font-semibold rounded-xl shadow-xs"
              >
                {isSubmitting && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
