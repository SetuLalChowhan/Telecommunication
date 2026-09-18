"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, forgotPasswordMutation } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const isLoading = forgotPasswordMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await forgotPassword({ email: data.email });
    setSubmittedEmail(data.email);
    setIsSubmitted(true);
  };


  return (
    <AuthSplitLayout
      headline="Healthcare that fits your life."
      subheadline="Connect with trusted doctors from wherever you are."
      trustBadge="Over 500,000+ appointments completed"
      title="Forgot your password?"
      description="Enter your email and we'll send you a secure password reset link."
    >
      {isSubmitted ? (
        <div className="space-y-6 text-center animate-in fade-in duration-300">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Reset link sent</h2>
            <p className="text-sm sm:text-base text-secondary-text leading-relaxed">
              We&apos;ve sent instructions to{" "}
              <span className="font-medium text-foreground">{submittedEmail}</span>.
              Please check your inbox and spam folder.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              asChild
              className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-medium text-base rounded-xl shadow-sm"
            >
              <Link href="/login">
                Back to sign in
              </Link>
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSubmitted(false)}
              className="w-full text-secondary-text hover:text-foreground text-sm sm:text-base cursor-pointer"
            >
              Try another email
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email field */}
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

          {/* Primary CTA */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 sm:h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:scale-[0.995] flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isLoading ? "Sending link..." : "Send reset link"}</span>
          </Button>

          {/* Secondary sign in link */}
          <div className="text-center pt-2 sm:pt-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-secondary-text hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </form>
      )}
    </AuthSplitLayout>
  );
}
