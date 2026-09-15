"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    // Simulate authentication check (ready for API integration)
    setTimeout(() => {
      setIsLoading(false);
      // Demo test trigger: if user types wrong@test.com it shows the exact error banner
      if (data.email.includes("error")) {
        setServerError("The email or password is incorrect. Please try again.");
      } else {
        // Success state demonstration
        console.log("Login submitted successfully", data);
      }
    }, 900);
  };

  return (
    <AuthSplitLayout
      headline="Healthcare that fits your life."
      subheadline="Connect with trusted doctors from wherever you are."
      trustBadge="Over 500,000+ appointments completed"
      title="Welcome back"
      description="Sign in to continue your healthcare journey."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Subtle Human Error Alert (As per item 7 UX guidelines) */}
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-error/20 bg-error/5 p-3.5 text-sm transition-all"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-error shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-foreground text-sm sm:text-base">Unable to sign in</p>
                <p className="text-secondary-text text-xs sm:text-sm leading-relaxed">
                  {serverError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-foreground">
            Email address
          </Label>
          <div>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="doctor@hospital.com or patient@gmail.com"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              className={errors.email ? "border-error focus-visible:ring-error" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2 sm:gap-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm sm:text-base font-semibold text-foreground">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isLoading}
                aria-invalid={!!errors.password}
                className={`pr-10 ${errors.password ? "border-error focus-visible:ring-error" : ""}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded p-0.5 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-500" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        {/* Primary CTA */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 sm:h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:scale-[0.995] flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isLoading ? "Signing in..." : "Sign in"}</span>
        </Button>

        {/* Divider */}
        <AuthDivider text="or continue with" />

        {/* Google OAuth */}
        <GoogleAuthButton
          disabled={isLoading}
          onClick={() => {
            console.log("Initiating Google Sign-In");
          }}
        />

        {/* Bottom Switch Link */}
        <p className="text-center text-xs sm:text-sm text-secondary-text pt-2 sm:pt-3">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
