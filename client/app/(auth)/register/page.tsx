"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Info, Loader2, Stethoscope, User, AlertCircle, Check } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/api";

const registerSchema = z
  .object({
    role: z.enum(["PATIENT", "DOCTOR"]),
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms & Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerAuth, registerMutation } = useAuth();
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isLoading = registerMutation.isPending;
  const serverError = registerMutation.error?.message;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "PATIENT",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: true,
    },
  });

  const passwordValue = watch("password") || "";

  // Password requirements calculation
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);

  // Strength score (0 to 4)
  const strengthScore = useMemo(() => {
    if (!passwordValue) return 0;
    let score = 0;
    if (passwordValue.length >= 8) score++;
    if (passwordValue.length >= 12) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    return Math.min(score, 4);
  }, [passwordValue]);

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

  const handleRoleChange = (newRole: "PATIENT" | "DOCTOR") => {
    setRole(newRole);
    setValue("role", newRole);
  };

  const onSubmit = (data: RegisterFormValues) => {
    registerAuth({
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };


  return (
    <AuthSplitLayout
      headline="Healthcare that fits your life."
      subheadline="Connect with trusted doctors from wherever you are."
      trustBadge="Over 500,000+ appointments completed"
      title="Create your account"
      description="Start your journey with trusted healthcare professionals."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Server Error Alert */}
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-error/20 bg-error/5 p-3.5 text-sm transition-all"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-error shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground text-sm sm:text-base">Unable to register</p>
                <p className="text-secondary-text text-xs sm:text-sm leading-relaxed">
                  {serverError}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Role Selection: Simple Segmented Control */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <Label className="text-sm sm:text-base font-semibold text-foreground">
            I am a
          </Label>
          <div className="space-y-2">
            <div
              role="tablist"
              aria-label="Account Type"
              className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80"
            >
              <button
                type="button"
                role="tab"
                aria-selected={role === "PATIENT"}
                onClick={() => handleRoleChange("PATIENT")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  role === "PATIENT"
                    ? "bg-white text-primary font-semibold shadow-xs border border-slate-200/60 dark:bg-card dark:text-white"
                    : "text-secondary-text hover:text-foreground"
                }`}
              >
                <User className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Patient</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={role === "DOCTOR"}
                onClick={() => handleRoleChange("DOCTOR")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  role === "DOCTOR"
                    ? "bg-white text-secondary font-semibold shadow-xs border border-slate-200/60 dark:bg-card dark:text-white"
                    : "text-secondary-text hover:text-foreground"
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5 stroke-[2.2]" />
                <span>Doctor</span>
              </button>
            </div>

            {/* Subtle Doctor Notice matching backend verification flow */}
            {role === "DOCTOR" && (
              <div className="rounded-xl bg-teal-50 border border-teal-200/70 p-3 flex items-start gap-2.5 text-xs sm:text-[13px] text-teal-900 animate-in fade-in duration-200">
                <Info className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Doctor accounts require verification before providing consultations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* First & Last Name Fields (Responsive 2-column) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="flex flex-col gap-2 sm:gap-2.5">
            <Label htmlFor="firstName" className="text-sm sm:text-base font-semibold text-foreground">
              First name
            </Label>
            <div>
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Sarah"
                disabled={isLoading}
                aria-invalid={!!errors.firstName}
                className={errors.firstName ? "border-error focus-visible:ring-error" : ""}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-xs text-error font-medium mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:gap-2.5">
            <Label htmlFor="lastName" className="text-sm sm:text-base font-semibold text-foreground">
              Last name
            </Label>
            <div>
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Rahman"
                disabled={isLoading}
                aria-invalid={!!errors.lastName}
                className={errors.lastName ? "border-error focus-visible:ring-error" : ""}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-xs text-error font-medium mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-foreground">
            Email address
          </Label>
          <div>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              className={errors.email ? "border-error focus-visible:ring-error" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-error font-medium mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <Label htmlFor="password" className="text-sm sm:text-base font-semibold text-foreground">
            Password
          </Label>
          <div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                disabled={isLoading}
                aria-invalid={!!errors.password}
                className={`pr-10 ${errors.password ? "border-error focus-visible:ring-error" : ""}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-secondary-text" />
                ) : (
                  <Eye className="h-4 w-4 text-secondary-text" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-error font-medium mt-1">
                {errors.password.message}
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
                placeholder="Confirm your password"
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
        {passwordValue.length > 0 && (
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
        {passwordValue.length > 0 && (
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

        {/* Terms and Privacy Policy Checkbox */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="terms"
              defaultChecked
              onCheckedChange={(checked) =>
                setValue("agreeToTerms", checked === true ? true : (false as any))
              }
              className="mt-0.5"
            />
            <label
              htmlFor="terms"
              className="text-sm sm:text-base text-secondary-text leading-snug cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs sm:text-sm text-error font-medium">
              {errors.agreeToTerms.message}
            </p>
          )}
        </div>

        {/* Primary CTA */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-base rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:scale-[0.995] flex items-center justify-center gap-2 mt-3"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isLoading ? "Creating account..." : "Create account"}</span>
        </Button>

        {/* Divider */}
        <AuthDivider text="or continue with" />

        {/* Google OAuth */}
        <GoogleAuthButton disabled={isLoading} />


        {/* Bottom Switch Link (Visible on desktop & mobile under OAuth button) */}
        <p className="text-center text-sm sm:text-base text-secondary-text pt-3">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
