"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Stethoscope,
  User,
  LogOut,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/common/BrandLogo";
import { useAuth } from "@/lib/api";

interface PatientSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/patient/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Bookings",
    path: "/patient/appointments",
    icon: Calendar,
  },
  {
    label: "Medical Reports",
    path: "/patient/records",
    icon: FileText,
  },
  {
    label: "Find Doctors",
    path: "/doctors",
    icon: Stethoscope,
  },
  {
    label: "My Profile",
    path: "/patient/profile",
    icon: User,
  },
];

export const PatientSidebar: React.FC<PatientSidebarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const { logout, logoutMutation } = useAuth();
  const isLoggingOut = logoutMutation.isPending;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-300 xl:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out select-none",
          "xl:static xl:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header with top border/padding */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border shrink-0">
          <BrandLogo iconSize={19} />
          <Button
            variant="ghost"
            size="icon"
            className="h-8.5 w-8.5 xl:hidden text-muted-foreground hover:text-foreground rounded-xl"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-2.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  isActive
                    ? "bg-primary text-white font-semibold border-primary shadow-xs"
                    : "bg-card border-border/80 text-secondary-text hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-primary/40 shadow-2xs"
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-muted-foreground"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Sign Out Area */}
        <div className="p-3.5 border-t border-border shrink-0">
          <Button
            variant="ghost"
            disabled={isLoggingOut}
            onClick={logout}
            className="w-full justify-start gap-2.5 text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20 bg-destructive/5 rounded-xl h-10 px-3.5 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default PatientSidebar;
