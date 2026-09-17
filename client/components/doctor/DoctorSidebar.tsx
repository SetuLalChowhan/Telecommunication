"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  FileCheck2,
  Settings,
  LogOut,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/common/BrandLogo";
import { useAuth } from "@/lib/api";

interface DoctorSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  id: number;
  text: string;
  path: string;
  icon: React.ReactNode;
}

const DOCTOR_NAV_ITEMS: NavItem[] = [
  {
    id: 1,
    icon: <LayoutDashboard className="h-5 w-5" />,
    text: "Overview",
    path: "/doctor/dashboard",
  },
  {
    id: 2,
    icon: <Calendar className="h-5 w-5" />,
    text: "Appointments",
    path: "/doctor/appointments",
  },
  {
    id: 3,
    icon: <Users className="h-5 w-5" />,
    text: "My Patients",
    path: "/doctor/patients",
  },
  {
    id: 4,
    icon: <Clock className="h-5 w-5" />,
    text: "My Schedule",
    path: "/doctor/schedule",
  },
  {
    id: 5,
    icon: <FileCheck2 className="h-5 w-5" />,
    text: "Verification",
    path: "/doctor-verification",
  },
  {
    id: 6,
    icon: <Settings className="h-5 w-5" />,
    text: "Settings",
    path: "/doctor/settings",
  },
];

export const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const { logout, logoutMutation } = useAuth();
  const isLoggingOut = logoutMutation.isPending;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          "xl:static xl:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border shrink-0">
          <BrandLogo iconSize={20} />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 xl:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Doctor Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-2.5">
          <div className="px-1.5 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Clinical Practice
          </div>
          {DOCTOR_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  isActive
                    ? "bg-primary text-white font-semibold border-primary shadow-xs"
                    : "bg-card border-border/80 text-secondary-text hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:border-primary/40 shadow-2xs"
                )}
              >
                <span className={cn(isActive ? "text-white" : "text-muted-foreground")}>
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout Footer */}
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

export default DoctorSidebar;
