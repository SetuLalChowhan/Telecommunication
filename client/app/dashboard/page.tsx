"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, getRoleDashboardRoute } from "@/features/auth/api/queries";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, role, isSessionLoading } = useAuth();

  useEffect(() => {
    if (!isSessionLoading) {
      if (user && user.emailVerified === false) {
        router.replace(
          `/verify-email?email=${encodeURIComponent(user.email)}&role=${encodeURIComponent(role)}`
        );
        return;
      }
      router.replace(getRoleDashboardRoute(role, user?.doctorProfile?.verified));
    }
  }, [user, role, isSessionLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span>Redirecting to your dashboard...</span>
      </div>
    </div>
  );
}
