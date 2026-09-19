"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  User,
  Settings,
  Clock,
  ShieldCheck,
  Users,
  FileText,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/common/BrandLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/api";

interface DashboardSidebarProps {
  role?: "PATIENT" | "DOCTOR" | "ADMIN";
  onItemClick?: () => void;
  className?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  role = "PATIENT",
  onItemClick,
  className,
}) => {
  const pathname = usePathname();
  const { user, logout, logoutMutation } = useAuth();
  const isLoggingOut = logoutMutation.isPending;

  const isDoctor = role === "DOCTOR";

  const primaryNavItems = isDoctor
    ? [
        { label: "Overview", path: "/doctor/dashboard", icon: LayoutDashboard },
        { label: "Consultation Queue", path: "/doctor/appointments", icon: Calendar },
        { label: "Availability & Leaves", path: "/doctor/schedule", icon: Clock },
        { label: "My Patients", path: "/doctor/patients", icon: Users },
        { label: "BMDC Verification", path: "/doctor-verification", icon: ShieldCheck },
      ]
    : [
        { label: "Overview", path: "/patient/dashboard", icon: LayoutDashboard },
        { label: "My Appointments", path: "/patient/appointments", icon: Calendar },
        { label: "Find Doctors", path: "/doctors", icon: Stethoscope },
        { label: "Medical Records", path: "/patient/records", icon: FileText },
      ];

  const secondaryNavItems = isDoctor
    ? [
        { label: "Profile & Practice", path: "/doctor/settings", icon: Settings },
      ]
    : [
        { label: "My Profile", path: "/patient/profile", icon: User },
        { label: "Settings", path: "/patient/settings", icon: Settings },
      ];

  const displayName =
    user?.name || (isDoctor ? "Doctor Portal" : "Patient Portal");
  const displayRole = isDoctor ? "Doctor / Specialist" : "Patient";

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-slate-50/70 dark:bg-slate-900/30 text-foreground select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 sm:h-18 items-center px-6 shrink-0">
        <BrandLogo iconSize={22} />
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Primary Links */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {isDoctor ? "Clinical Workspace" : "Health Services"}
          </div>

          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-secondary-text hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-border/60 mx-3" />

        {/* Secondary Links */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Account
          </div>

          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.label}
                href={item.path}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-secondary-text hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div className="p-4 border-t border-border/40 shrink-0 space-y-2">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
          <Avatar className="h-9 w-9 ring-1 ring-primary/20 shrink-0">
            <AvatarImage src={user?.image || ""} alt={displayName} />
            <AvatarFallback
              className="bg-primary/10 text-primary font-bold text-xs"
              suppressHydrationWarning
            >
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-semibold text-foreground truncate"
              suppressHydrationWarning
            >
              {displayName}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {displayRole}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          disabled={isLoggingOut}
          onClick={logout}
          className="w-full justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-9 px-3 text-xs font-medium transition-colors"
        >
          {isLoggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
          ) : (
            <LogOut className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
