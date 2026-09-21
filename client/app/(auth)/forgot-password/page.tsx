import React from "react";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | DocConnect",
  description: "Request a password reset link for your DocConnect account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
