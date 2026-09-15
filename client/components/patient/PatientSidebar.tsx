"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/common/BrandLogo";
import { useAuth } from "@/lib/api";

interface PatientSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface NavItem {
  id: number;
  text: string;
  path: string;
  icon: React.ReactNode;
}

const PATIENT_NAV_ITEMS: NavItem[] = [
  {
    id: 1,
    icon: <LayoutDashboard className="h-5 w-5" />,
    text: "Patient Portal",
    path: "/patient/dashboard",
  },
  {
    id: 2,
    icon: <Stethoscope className="h-5 w-5" />,
    text: "Find a Doctor",
    path: "/doctors",
  },
  {
    id: 3,
    icon: <Calendar className="h-5 w-5" />,
    text: "My Appointments",
    path: "/patient/appointments",
  },
  {
    id: 4,
    icon: <FileText className="h-5 w-5" />,
    text: "Prescriptions & Reports",
    path: "/patient/records",
  },
  {
    id: 5,
    icon: <Settings className="h-5 w-5" />,
    text: "Settings",
    path: "/patient/settings",
  },
];

export const PatientSidebar: React.FC<PatientSidebarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const { logout } = useAuth();

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

        {/* Patient Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Healthcare Portal
          </div>
          {PATIENT_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <span className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground")}>
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout Footer */}
        <div className="p-4 border-t border-border shrink-0">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start gap-3.5 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default PatientSidebar;
