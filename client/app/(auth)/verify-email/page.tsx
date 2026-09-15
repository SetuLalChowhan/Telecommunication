"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight, RotateCw, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const status = searchParams.get("status");
  const errorMessage = searchParams.get("message");
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role")?.toUpperCase() || "";
  const isDoctor = role === "DOCTOR";

  const {
    verifyEmail,
    verifyEmailMutation,
    resendVerificationEmail,
    resendVerificationEmailMutation,
  } = useAuth();

  const isManualVerifying = verifyEmailMutation.isPending;
  const isManualSuccess = verifyEmailMutation.isSuccess;
  const isManualError = verifyEmailMutation.error?.message;
  const isResending = resendVerificationEmailMutation.isPending;

  // Countdown timer for resend (starts at 45s)
  const [countdown, setCountdown] = useState(45);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Countdown timer tick effect
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleManualVerify = () => {
    if (token) {
      verifyEmail(token);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending || !email) return;
    try {
      await resendVerificationEmail({ email });
      setResendSuccess(true);
      setCountdown(60);
    } catch {
      // Toast notification is automatically managed by useMutationClient
    }
  };

  // State 1: Verification was successful (via server redirect or manual button)
  if (status === "success" || isManualSuccess) {
    return (
      <div className="space-y-5 text-center py-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/50">
          <CheckCircle2 className="h-8 w-8 stroke-[2.2]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {isDoctor ? "Doctor Account Verified!" : "Email verified!"}
          </h2>
          <p className="text-sm sm:text-base text-secondary-text">
            {isDoctor
              ? "Your email address has been verified. Please proceed to upload your medical credentials and license to activate your profile."
              : "Your email has been successfully verified. You can now sign in and access all platform services."}
          </p>
        </div>
        <Link href={isDoctor ? "/doctor-verification" : "/login"} className="block pt-2">
          <Button className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
            <span>{isDoctor ? "Continue to Document Upload" : "Continue to Sign in"}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  // State 2: Verification error
  if (status === "error" || isManualError) {
    return (
      <div className="space-y-5 text-center py-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-8 w-8 stroke-[2.2]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Verification Failed</h2>
          <p className="text-sm sm:text-base text-secondary-text">
            {errorMessage || isManualError || "The verification link is invalid or has expired."}
          </p>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <Link href="/login">
            <Button className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl flex items-center justify-center gap-2">
              <span>Go to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // State 3: Arrived with token directly but not yet verified
  if (token) {
    return (
      <div className="space-y-5 text-center py-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
          <ShieldCheck className="h-8 w-8 stroke-[2.2]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Confirm Email Verification</h2>
          <p className="text-sm sm:text-base text-secondary-text">
            Click the button below to verify your email address and activate your account.
          </p>
        </div>
        <Button
          onClick={handleManualVerify}
          disabled={isManualVerifying}
          className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer"
        >
          {isManualVerifying && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isManualVerifying ? "Verifying..." : "Verify Email Now"}</span>
        </Button>
      </div>
    );
  }

  // State 4: Default awaiting verification state (e.g. just signed up)
  return (
    <div className="space-y-4 sm:space-y-5 text-center">
      {/* Mail Visual Graphic */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-secondary shadow-xs">
        <Mail className="h-8 w-8 text-primary" strokeWidth={1.75} />
      </div>

      {/* Target Email Display */}
      <div className="space-y-1.5">
        <p className="text-xs sm:text-sm text-secondary-text">
          We&apos;ve sent a verification link to
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-foreground font-medium text-xs sm:text-sm">
          <span>{email || "your registered email"}</span>
        </div>

        <p className="text-xs sm:text-sm text-secondary-text max-w-sm mx-auto leading-relaxed pt-1">
          Please check your inbox and click the verification link to continue.
        </p>
      </div>

      {/* Resend confirmation alert */}
      {resendSuccess && (
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 py-2 px-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>A fresh verification link has been sent to your email!</span>
        </div>
      )}

      {/* Resend Action Area */}
      <div className="pt-2 border-t border-border space-y-2.5">
        <p className="text-xs sm:text-sm text-secondary-text">Didn&apos;t receive the email?</p>

        <div className="flex items-center justify-center gap-2">
          {countdown > 0 ? (
            <Button
              type="button"
              variant="outline"
              disabled
              className="w-full sm:w-auto text-secondary-text bg-muted/50 border-border cursor-not-allowed font-normal text-xs sm:text-sm h-10"
            >
              Resend available in {countdown}s
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleResend}
              disabled={isResending || !email}
              className="w-full sm:w-auto border-border text-foreground hover:bg-muted font-medium text-xs sm:text-sm flex items-center gap-2 h-10 cursor-pointer"
            >
              {isResending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <RotateCw className="h-3.5 w-3.5 text-primary" />
              )}
              <span>{isResending ? "Resending..." : "Resend email"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Continue to sign in CTA */}
      <div className="pt-2">
        <p className="text-xs sm:text-sm text-secondary-text mb-1.5">Already verified?</p>
        <Button
          asChild
          className="w-full h-11 sm:h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)] active:scale-[0.995] flex items-center justify-center gap-2"
        >
          <Link href={isDoctor ? "/doctor-verification" : "/login"}>
            <span>{isDoctor ? "Continue to verification" : "Continue to sign in"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthSplitLayout
      headline="Healthcare that fits your life."
      subheadline="Connect with trusted doctors from wherever you are."
      trustBadge="Over 500,000+ appointments completed"
      title="Check your email"
      description="We have sent you a secure confirmation link."
    >
      <Suspense fallback={<div className="text-center py-10 text-secondary-text">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthSplitLayout>
  );
}

