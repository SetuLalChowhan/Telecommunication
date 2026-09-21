"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ResetPasswordSuccessCard: React.FC = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 sm:p-10 text-center shadow-card border border-border/70 animate-in zoom-in-95 duration-200">
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
};
