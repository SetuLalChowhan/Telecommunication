"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowRight, RotateCw, CheckCircle2, Edit2, Loader2 } from "lucide-react";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/api";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const initialEmail = searchParams.get("email") || "patient@telehealth.com";

  const { verifyEmail, verifyEmailMutation } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(initialEmail);

  const isVerifyingToken = verifyEmailMutation.isPending;
  const verificationSuccess = verifyEmailMutation.isSuccess;
  const verificationError = verifyEmailMutation.error?.message || null;

  // 42-second countdown timer requested by user
  const [countdown, setCountdown] = useState(42);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Auto-verify when arriving with a token in the URL
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);


  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setResendSuccess(false);

    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setCountdown(42); // Reset countdown
    }, 1200);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempEmail && tempEmail.includes("@")) {
      setEmail(tempEmail);
      setIsEditingEmail(false);
      setCountdown(42);
      setResendSuccess(true);
    }
  };

  if (isVerifyingToken) {
    return (
      <div className="space-y-4 text-center py-6">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <h2 className="text-xl font-bold text-foreground">Verifying your email...</h2>
        <p className="text-sm text-secondary-text">Please wait a moment while we confirm your email address.</p>
      </div>
    );
  }

  if (verificationSuccess) {
    return (
      <div className="space-y-5 text-center py-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Email verified!</h2>
          <p className="text-sm sm:text-base text-secondary-text">
            Your email has been successfully verified. You can now access all services.
          </p>
        </div>
        <Link href="/login" className="block pt-2">
          <Button className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl">
            <span>Continue to Sign in</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 text-center">
      {/* Mail Visual Graphic */}
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-secondary shadow-xs">
        <Mail className="h-8 w-8 text-primary" strokeWidth={1.75} />
      </div>

      {/* Target Email Display & Typo correction option */}
      <div className="space-y-1.5">
        <p className="text-xs sm:text-sm text-secondary-text">
          We&apos;ve sent a verification link to
        </p>

        {isEditingEmail ? (
          <form onSubmit={handleSaveEmail} className="flex gap-2 max-w-sm mx-auto pt-1">
            <Input
              type="email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              className="h-9 text-xs sm:text-sm"
              placeholder="Enter correct email"
              autoFocus
            />
            <Button type="submit" size="sm" className="h-9 px-3.5 bg-primary text-white text-xs">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditingEmail(false)}
              className="h-9 px-2.5 text-xs"
            >
              Cancel
            </Button>
          </form>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-foreground font-medium text-xs sm:text-sm">
            <span>{email}</span>
            <button
              type="button"
              onClick={() => {
                setTempEmail(email);
                setIsEditingEmail(true);
              }}
              className="text-secondary-text hover:text-primary transition-colors p-0.5 rounded"
              title="Change email"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          </div>
        )}

        <p className="text-xs sm:text-sm text-secondary-text max-w-sm mx-auto leading-relaxed pt-1">
          Please check your inbox and click the verification link to continue.
        </p>
      </div>

      {/* Resend confirmation toast/alert */}
      {resendSuccess && (
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-success bg-success/10 py-2 px-3 rounded-lg border border-success/20 animate-in fade-in duration-200">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>A fresh verification link has been sent!</span>
        </div>
      )}

      {/* Resend Action Area */}
      <div className="pt-2 border-t border-border space-y-2.5">
        <p className="text-xs sm:text-sm text-secondary-text">Didn&apos;t receive the email?</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
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
              disabled={isResending}
              className="w-full sm:w-auto border-border text-foreground hover:bg-muted font-medium text-xs sm:text-sm flex items-center gap-2 h-10"
            >
              {isResending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <RotateCw className="h-3.5 w-3.5 text-primary" />
              )}
              <span>{isResending ? "Resending..." : "Resend email"}</span>
            </Button>
          )}

          {!isEditingEmail && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setTempEmail(email);
                setIsEditingEmail(true);
              }}
              className="w-full sm:w-auto text-secondary-text hover:text-foreground text-xs sm:text-sm h-10"
            >
              Change email
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
          <Link href="/login">
            <span>Continue to sign in</span>
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
