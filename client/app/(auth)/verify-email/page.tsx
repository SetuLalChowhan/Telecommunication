import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth";
import { VerifyEmailContent } from "@/features/auth/components/VerifyEmailContent";

export const metadata: Metadata = {
  title: "Verify Email | DocConnect",
  description: "Verify your email address to access your DocConnect healthcare account.",
};

export default function VerifyEmailPage() {
  return (
    <AuthSplitLayout
      headline="Healthcare that fits your life."
      subheadline="Connect with trusted doctors from wherever you are."
      trustBadge="Over 500,000+ appointments completed"
      title="Check your email"
      description="We have sent you a secure confirmation link."
    >
      <Suspense
        fallback={
          <div className="text-center py-10 text-secondary-text">
            Loading verification...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthSplitLayout>
  );
}
