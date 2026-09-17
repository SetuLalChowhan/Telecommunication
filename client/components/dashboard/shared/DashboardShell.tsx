"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardShellProps {
  role?: "PATIENT" | "DOCTOR" | "ADMIN";
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  role = "PATIENT",
  children,
}) => {
  return (
    <div className="flex h-screen min-h-screen w-full bg-background text-foreground overflow-hidden antialiased">
      {/* Desktop Integrated Sidebar */}
      <aside className="hidden xl:flex flex-col w-[250px] shrink-0 border-r border-border/40 bg-slate-50/70 dark:bg-slate-900/30">
        <DashboardSidebar role={role} />
      </aside>

      {/* Main Content Area with balanced spacing */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader role={role} />
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 bg-background">
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
