"use client";

import React from "react";
import { Bell, Menu, Settings, LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientNavbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const PatientNavbar: React.FC<PatientNavbarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, logoutMutation } = useAuth();
  const isLoggingOut = logoutMutation.isPending;

  const handleLogout = async () => {
    await logout();
  };

  const getPageTitle = () => {
    if (pathname === "/patient/dashboard") return "Patient Portal";
    const segment = pathname.split("/").pop() || "";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "PT";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Global signing-out overlay banner */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-semibold text-foreground">Signing out securely...</span>
          </div>
        </div>
      )}

      <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-8 shrink-0">
        {/* Mobile Toggle & Page Title */}
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 xl:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-foreground truncate capitalize">
              {getPageTitle()}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <UserIcon className="h-3 w-3" />
              Patient
            </span>
          </div>
        </div>

        {/* Notifications & Patient Profile Dropdown */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full border border-border p-0 cursor-pointer overflow-hidden"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.image || undefined} alt={user?.name || "Patient"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1">
              <DropdownMenuLabel className="p-3.5 flex flex-col gap-0.5">
                <span className="font-semibold text-sm text-foreground leading-none">
                  {user?.name || "Patient"}
                </span>
                <span className="text-xs text-muted-foreground leading-none truncate">
                  {user?.email || ""}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/patient/settings")}
                className="flex items-center gap-2 p-2.5 cursor-pointer"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex items-center gap-2 p-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                <span>{isLoggingOut ? "Signing out..." : "Log Out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default PatientNavbar;
