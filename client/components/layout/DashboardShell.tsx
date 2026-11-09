"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DashboardSidebar, type DashboardRole } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useAuth } from "@/features/auth/api/queries";
import { Loader2 } from "lucide-react";

interface DashboardShellProps {
  role?: DashboardRole;
  children: React.ReactNode;
}

/**
 * Fixed application frame for both portals: a persistent navigation rail, a
 * compact topbar, and a single scrolling content region.
 *
 * All dashboard pages render inside this frame, so vertical rhythm and
 * horizontal gutters are defined here instead of per page.
 */
export const DashboardShell: React.FC<DashboardShellProps> = ({
  role = "PATIENT",
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname || "/dashboard")}`);
      return;
    }

    if (user && user.emailVerified === false) {
      router.replace(
        `/verify-email?email=${encodeURIComponent(user.email)}&role=${encodeURIComponent(user.role || role)}`
      );
      return;
    }
  }, [user, isAuthenticated, isAuthLoading, router, pathname, role]);

  if (isAuthLoading || !isAuthenticated || (user && user.emailVerified === false)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3 text-xs text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>Verifying session permissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-screen w-full overflow-hidden bg-background text-foreground antialiased">
      {/* Persistent rail (desktop) */}
      <aside className="hidden w-[236px] shrink-0 border-r border-border lg:flex lg:flex-col">
        <DashboardSidebar role={role} />
      </aside>

      {/* Working area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader role={role} />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container-dashboard space-y-4 px-3 py-4 sm:space-y-5 sm:px-4 sm:py-5 lg:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
