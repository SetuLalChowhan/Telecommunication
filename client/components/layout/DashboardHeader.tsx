"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  User,
  Lock,
  LogOut,
  Loader2,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar, type DashboardRole } from "./DashboardSidebar";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { useAuth } from "@/features/auth/api/queries";
import { useUnreadNotificationCount } from "@/features/notifications/api/queries";

interface DashboardHeaderProps {
  role?: DashboardRole;
}

/** Route -> breadcrumb label. Longest matching prefix wins. */
const routeLabels: Record<string, string> = {
  "/patient/dashboard": "Overview",
  "/patient/appointments": "Appointments",
  "/patient/records": "Medical records",
  "/patient/messages": "Inbox",
  "/patient/notifications": "Notifications",
  "/patient/profile": "Profile",
  "/patient/settings": "Settings",
  "/doctor/dashboard": "Overview",
  "/doctor/appointments": "Consultation queue",
  "/doctor/patients": "Patients",
  "/doctor/schedule": "Availability & leaves",
  "/doctor/messages": "Inbox",
  "/doctor/notifications": "Notifications",
  "/doctor/settings": "Profile & practice",
  "/doctor-verification": "BMDC verification",
  "/doctors": "Find doctors",
};

const resolvePageLabel = (pathname: string) => {
  let bestMatch = "";
  for (const route of Object.keys(routeLabels)) {
    const matches =
      pathname === route || pathname.startsWith(`${route}/`);
    if (matches && route.length > bestMatch.length) bestMatch = route;
  }
  return bestMatch ? routeLabels[bestMatch] : "Dashboard";
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  role = "PATIENT",
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, logoutMutation } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const isLoggingOut = logoutMutation.isPending;

  const isDoctor = role === "DOCTOR";
  const rawName = user?.name || "";
  const profilePath = isDoctor ? "/doctor/settings" : "/patient/profile";
  const notificationsPath = isDoctor
    ? "/doctor/notifications"
    : "/patient/notifications";
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const workspaceLabel = isDoctor ? "Doctor console" : "Patient portal";
  const currentLabel = resolvePageLabel(pathname);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/95 px-3 backdrop-blur-md sm:px-4 lg:px-6">
        {/* Left: drawer trigger + breadcrumb */}
        <div className="flex min-w-0 items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground lg:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4.5 w-4.5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[248px] border-r border-border p-0">
              <DashboardSidebar
                role={role}
                onItemClick={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
            <Link
              href={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"}
              className="hidden text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              {workspaceLabel}
            </Link>
            <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/60 sm:inline" />
            <span
              className="truncate text-[13px] font-semibold text-foreground"
              suppressHydrationWarning
            >
              {currentLabel}
            </span>
          </nav>
        </div>

        {/* Right: notifications + account */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => router.push(notificationsPath)}
            className="relative rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="View notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span
                suppressHydrationWarning
                className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full p-0.5 transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Account menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || ""} alt={rawName || "User"} />
                  <AvatarFallback
                    className="bg-muted text-[11px] font-semibold text-foreground"
                    suppressHydrationWarning
                  >
                    {(rawName || (isDoctor ? "DR" : "PT")).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-60 rounded-lg border-border p-1.5 shadow-lg"
            >
              <div className="px-2.5 py-2">
                <p
                  className="truncate text-sm font-semibold text-foreground"
                  suppressHydrationWarning
                >
                  {rawName || (isDoctor ? "Doctor" : "Patient")}
                </p>
                <p
                  className="truncate text-xs text-muted-foreground"
                  suppressHydrationWarning
                >
                  {user?.email || "—"}
                </p>
              </div>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push(profilePath)}
                className="cursor-pointer gap-2.5 rounded-md py-2 text-sm font-medium"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{isDoctor ? "Profile & practice" : "My profile"}</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setChangePasswordOpen(true)}
                className="cursor-pointer gap-2.5 rounded-md py-2 text-sm font-medium"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Change password</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={isLoggingOut}
                onClick={logout}
                className="cursor-pointer gap-2.5 rounded-md py-2 text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </>
  );
};

export default DashboardHeader;
