import React from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | DocConnect",
  description: "Sign in to your DocConnect patient or doctor account to access telemedicine services.",
};

export default function LoginPage() {
  return <LoginForm />;
}
