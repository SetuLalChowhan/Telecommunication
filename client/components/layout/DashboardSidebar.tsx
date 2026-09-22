"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  User,
  Settings,
  Clock,
  ShieldCheck,
  Users,
  FileText,
  LogOut,
  Loader2,
  Bell,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BrandLogo from "@/components/common/BrandLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/api";

export type DashboardRole = "PATIENT" | "DOCTOR" | "ADMIN";

interface NavLink {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavLink[];
}

interface DashboardSidebarProps {
  role?: DashboardRole;
  onItemClick?: () => void;
  className?: string;
}

const patientGroups: NavGroup[] = [
  {
    label: "Care",
    items: [
      { label: "Overview", path: "/patient/dashboard", icon: LayoutDashboard },
      { label: "Appointments", path: "/patient/appointments", icon: CalendarDays },
      { label: "Find doctors", path: "/doctors", icon: Stethoscope },
      { label: "Medical records", path: "/patient/records", icon: FileText },
    ],
  },
  {
    label: "Messages",
    items: [
      { label: "Inbox", path: "/patient/messages", icon: MessagesSquare },
      { label: "Notifications", path: "/patient/notifications", icon: Bell },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", path: "/patient/profile", icon: User },
      { label: "Settings", path: "/patient/settings", icon: Settings },
    ],
  },
];

const doctorGroups: NavGroup[] = [
  {
    label: "Clinical",
    items: [
      { label: "Overview", path: "/doctor/dashboard", icon: LayoutDashboard },
      { label: "Consultation queue", path: "/doctor/appointments", icon: CalendarDays },
      { label: "Patients", path: "/doctor/patients", icon: Users },
      { label: "Availability & leaves", path: "/doctor/schedule", icon: Clock },
    ],
  },
  {
    label: "Messages",
    items: [
      { label: "Inbox", path: "/doctor/messages", icon: MessagesSquare },
      { label: "Notifications", path: "/doctor/notifications", icon: Bell },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile & practice", path: "/doctor/settings", icon: Settings },
      { label: "BMDC verification", path: "/doctor-verification", icon: ShieldCheck },
    ],
  },
];

const isPathActive = (pathname: string, path: string) => {
  if (pathname === path) return true;
  // Nested routes stay highlighted, but a bare list route like /doctors should not
  // swallow its detail pages under a sibling item.
  return pathname.startsWith(`${path}/`);
};

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  role = "PATIENT",
  onItemClick,
  className,
}) => {
  const pathname = usePathname();
  const { user, logout, logoutMutation } = useAuth();
  const isLoggingOut = logoutMutation.isPending;

  const isDoctor = role === "DOCTOR";
  const groups = isDoctor ? doctorGroups : patientGroups;

  const displayName = user?.name || (isDoctor ? "Doctor" : "Patient");
  const displayRole = isDoctor ? "Doctor" : "Patient";

  return (
    <div
      className={cn(
        "flex h-full select-none flex-col bg-card text-foreground",
        className
      )}
    >
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
        <BrandLogo iconSize={16} compact />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3">
        {groups.map((group, groupIndex) => (
          <div key={group.label} className={cn(groupIndex > 0 && "mt-5")}>
            <p className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = isPathActive(pathname, item.path);

                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={onItemClick}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "nav-item",
                        isActive && "nav-item-active"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Account footer */}
      <div className="shrink-0 border-t border-border p-2.5">
        <div className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.image || ""} alt={displayName} />
            <AvatarFallback
              className="bg-muted text-[11px] font-semibold text-foreground"
              suppressHydrationWarning
            >
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-xs font-semibold text-foreground"
              suppressHydrationWarning
            >
              {displayName}
            </p>
            <p
              className="truncate text-[11px] text-muted-foreground"
              suppressHydrationWarning
            >
              {user?.email || displayRole}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            disabled={isLoggingOut}
            aria-label="Sign out"
            title="Sign out"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
