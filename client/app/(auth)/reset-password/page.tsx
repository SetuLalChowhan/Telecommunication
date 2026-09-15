"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Check, CheckCircle2, ArrowLeft, Loader2 } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const initialSuccess = searchParams.get("success") === "true";

  const [isSuccess, setIsSuccess] = useState(initialSuccess);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword") || "";

  // Password requirements calculation
  const hasMinLength = newPasswordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPasswordValue);
  const hasNumber = /[0-9]/.test(newPasswordValue);

  // Strength score (0 to 4)
  const strengthScore = useMemo(() => {
    if (!newPasswordValue) return 0;
    let score = 0;
    if (newPasswordValue.length >= 8) score++;
    if (newPasswordValue.length >= 12) score++;
    if (/[A-Z]/.test(newPasswordValue)) score++;
    if (/[0-9]/.test(newPasswordValue)) score++;
    if (/[^A-Za-z0-9]/.test(newPasswordValue)) score++;
    return Math.min(score, 4);
  }, [newPasswordValue]);

  const strengthColor = useMemo(() => {
    switch (strengthScore) {
      case 1:
        return "bg-error";
      case 2:
        return "bg-warning";
      case 3:
        return "bg-secondary";
      case 4:
        return "bg-success";
      default:
        return "bg-border";
    }
  }, [strengthScore]);

  const strengthLabel = useMemo(() => {
    switch (strengthScore) {
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  }, [strengthScore]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log("Password reset success", data);
      setIsSuccess(true);
    }, 1000);
  };

  /* 
    6. Reset Password Success State:
    "Ekhane image/form split maintain korar dorkar nai.
     Centered success state better.
     Background: #F8FAFC. White small content container. No giant illustration."
  */
  if (isSuccess) {
    return (
      <main className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6">
        <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 sm:p-10 text-center shadow-card border border-border/70 animate-in zoom-in-95 duration-200">
          {/* Subtle Green Checkmark Circle */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success mb-6">
            <Check className="h-8 w-8 stroke-[2.5]" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Password updated
          </h1>

          <p className="text-sm sm:text-base text-secondary-text mt-2 mb-8 leading-relaxed">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>

          <Button
            asChild
            className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-medium text-base rounded-lg transition-colors shadow-sm"
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <AuthSplitLayout
      headline="Healthcare that fits your life."
      subheadline="Connect with trusted doctors from wherever you are."
      trustBadge="Over 500,000+ appointments completed"
      title="Create a new password"
      description="Choose a strong password for your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5" noValidate>
        {/* New Password */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <Label htmlFor="newPassword" className="text-sm sm:text-base font-semibold text-foreground">
            New password
          </Label>
          <div>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isLoading}
                aria-invalid={!!errors.newPassword}
                className={`pr-10 ${errors.newPassword ? "border-error focus-visible:ring-error" : ""}`}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded p-0.5"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-secondary-text" />
                ) : (
                  <Eye className="h-4 w-4 text-secondary-text" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-error font-medium mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <Label htmlFor="confirmPassword" className="text-sm sm:text-base font-semibold text-foreground">
            Confirm password
          </Label>
          <div>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                className={`pr-10 ${errors.confirmPassword ? "border-error focus-visible:ring-error" : ""}`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded p-0.5"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-secondary-text" />
                ) : (
                  <Eye className="h-4 w-4 text-secondary-text" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs sm:text-sm text-error font-medium mt-1.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Password Strength Meter */}
        {newPasswordValue.length > 0 && (
          <div className="space-y-2 pt-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-secondary-text">Password strength</span>
              <span className="font-semibold text-foreground">{strengthLabel}</span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden flex gap-1">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  strengthScore >= 1 ? strengthColor : "bg-transparent"
                } w-1/4`}
              />
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  strengthScore >= 2 ? strengthColor : "bg-transparent"
                } w-1/4`}
              />
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  strengthScore >= 3 ? strengthColor : "bg-transparent"
                } w-1/4`}
              />
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  strengthScore >= 4 ? strengthColor : "bg-transparent"
                } w-1/4`}
              />
            </div>
          </div>
        )}

        {/* Dynamic Requirements Checklist (shown after typing) */}
        {newPasswordValue.length > 0 && (
          <div className="rounded-lg bg-muted/60 p-3.5 space-y-2.5 text-xs sm:text-sm text-secondary-text animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  hasMinLength
                    ? "bg-success text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {hasMinLength ? <Check className="h-2.5 w-2.5" /> : "•"}
              </span>
              <span className={hasMinLength ? "text-foreground font-medium" : ""}>
                8+ characters
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  hasUppercase
                    ? "bg-success text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {hasUppercase ? <Check className="h-2.5 w-2.5" /> : "•"}
              </span>
              <span className={hasUppercase ? "text-foreground font-medium" : ""}>
                One uppercase letter
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                  hasNumber
                    ? "bg-success text-white"
                    : "bg-border text-muted-foreground"
                }`}
              >
                {hasNumber ? <Check className="h-2.5 w-2.5" /> : "•"}
              </span>
              <span className={hasNumber ? "text-foreground font-medium" : ""}>
                One number
              </span>
            </div>
          </div>
        )}

        {/* Primary CTA */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-base rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:scale-[0.995] mt-3 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isLoading ? "Updating password..." : "Update password"}</span>
        </Button>

        {/* Back to sign in */}
        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-medium text-secondary-text hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </form>
    </AuthSplitLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
