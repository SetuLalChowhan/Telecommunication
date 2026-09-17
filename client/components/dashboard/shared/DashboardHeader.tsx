"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  User,
  Lock,
  LogOut,
  Loader2,
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
import { DashboardSidebar } from "./DashboardSidebar";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { useAuth } from "@/lib/api";

interface DashboardHeaderProps {
  role?: "PATIENT" | "DOCTOR" | "ADMIN";
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  role = "PATIENT",
}) => {
  const router = useRouter();
  const { user, logout, logoutMutation } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const isLoggingOut = logoutMutation.isPending;

  const isDoctor = role === "DOCTOR";
  const rawName = user?.name || (isDoctor ? "Dr. Sarah Ahmed" : "Setulal");
  const firstName = rawName.split(" ")[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const profilePath = isDoctor ? "/doctor/settings" : "/patient/profile";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 sm:h-15 items-center justify-between px-4 sm:px-8 bg-background/95 backdrop-blur-md border-b border-border/40">
        {/* Left: Mobile Drawer Trigger & Greeting */}
        <div className="flex items-center gap-3 min-w-0">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 xl:hidden rounded-xl text-muted-foreground hover:text-foreground"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r border-border/50">
              <DashboardSidebar
                role={role}
                onItemClick={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
              {getGreeting()}, {firstName}
            </span>
          </div>
        </div>

        {/* Right: User Menu with Profile & Password */}
        <div className="flex items-center gap-3 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer focus:outline-none"
              >
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 ring-1 ring-primary/20">
                  <AvatarImage src={user?.image || ""} alt={rawName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs sm:text-sm">
                    {rawName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-1.5 shadow-xl border-border">
              <div className="px-2.5 py-2">
                <p className="text-sm font-bold text-foreground truncate">{rawName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
              </div>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push(profilePath)}
                className="rounded-xl text-xs sm:text-sm cursor-pointer py-2 gap-2.5 font-medium"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>My Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setChangePasswordOpen(true)}
                className="rounded-xl text-xs sm:text-sm cursor-pointer py-2 gap-2.5 font-medium"
              >
                <Lock className="h-4 w-4 text-muted-foreground" />
                <span>Change Password</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={isLoggingOut}
                onClick={logout}
                className="rounded-xl text-xs sm:text-sm cursor-pointer py-2 gap-2.5 font-medium text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Change Password Modal */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </>
  );
};

export default DashboardHeader;
