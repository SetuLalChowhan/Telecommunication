"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

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

const fields = [
  {
    id: "currentPassword",
    label: "Current password",
    placeholder: "••••••••",
  },
  {
    id: "newPassword",
    label: "New password",
    placeholder: "At least 8 characters",
  },
  {
    id: "confirmPassword",
    label: "Confirm new password",
    placeholder: "Re-type new password",
  },
] as const;

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

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setApiError("");
      setSuccess(false);
      reset();
    }
    onOpenChange(next);
  };

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a secure new one.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <DialogBody className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-semibold text-foreground">
              Password updated
            </p>
            <p className="text-xs text-muted-foreground">
              Your new password is active immediately.
            </p>
          </DialogBody>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            <DialogBody>
              {apiError && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs font-medium text-destructive">
                  <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type="password"
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(errors[field.id])}
                    className="h-9 rounded-md text-sm"
                    {...register(field.id)}
                  />
                  {errors[field.id] && (
                    <p className="text-[11px] font-medium text-destructive">
                      {errors[field.id]?.message}
                    </p>
                  )}
                </div>
              ))}
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
                className="h-8 rounded-md px-3 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8 rounded-md px-3 text-xs font-semibold"
              >
                {isSubmitting && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                <span>Update password</span>
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
