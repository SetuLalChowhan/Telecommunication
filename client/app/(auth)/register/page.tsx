"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AuthSplitLayout,
  GoogleAuthButton,
  AuthDivider,
  RoleSelectorTabs,
  RegisterForm,
} from "@/features/auth";

export default function RegisterPage() {
  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");

  return (
    <AuthSplitLayout
      title="Create your account"
      description="Join Bangladesh's premier digital healthcare network"
      headline="Healthcare at Your Fingertips."
      subheadline="Connect with verified doctors and specialist practitioners from anywhere."
    >
      <div className="space-y-5">
        <RoleSelectorTabs role={role} onChange={setRole} />

        <GoogleAuthButton label="Sign up with Google" />

        <AuthDivider text="Or register with email" />

        <RegisterForm role={role} />

        <p className="text-center text-xs text-muted-foreground pt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-semibold hover:text-primary-dark underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
