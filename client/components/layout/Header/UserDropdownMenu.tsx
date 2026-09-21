"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User as UserIcon,
  KeyRound,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserDropdownMenuProps {
  user: { name?: string | null; email?: string | null; image?: string | null } | null;
  role?: string | null;
  isDoctor: boolean;
  dashboardRoute: string;
  profileRoute: string;
  settingsRoute: string;
  isLoggingOut: boolean;
  onLogout: () => Promise<void>;
  variant?: "desktop" | "mobile";
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({
  user,
  role,
  isDoctor,
  dashboardRoute,
  profileRoute,
  settingsRoute,
  isLoggingOut,
  onLogout,
  variant = "desktop",
}) => {
  const router = useRouter();

  const getInitials = (name?: string | null) => {
    if (!name) return isDoctor ? "DR" : "PT";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "desktop" ? (
          <button
            type="button"
            className="flex items-center gap-2.5 py-1 px-1.5 rounded-full border border-border/90 hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
          >
            <div className="relative">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                <AvatarImage
                  src={user?.image || undefined}
                  alt={user?.name || "User"}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div className="flex flex-col text-left pr-2">
              <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[105px]">
                Hi, {firstName}
              </span>
              <span className="text-[10px] font-semibold text-primary uppercase leading-tight">
                {role || "PATIENT"}
              </span>
            </div>
          </button>
        ) : (
          <button
            type="button"
            className="relative h-9 w-9 rounded-full border-2 border-primary/30 p-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary"
          >
            <Avatar className="h-full w-full">
              <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} referrerPolicy="no-referrer" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-xl border border-border">
        <DropdownMenuLabel className="p-3 flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary/30">
              <AvatarImage
                src={user?.image || undefined}
                alt={user?.name || "User"}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground truncate">
                {user?.name || "User"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground truncate">{user?.email || ""}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push(dashboardRoute)}
          className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer hover:bg-muted font-medium text-sm text-foreground"
        >
          <LayoutDashboard className="h-4 w-4 text-primary" />
          <span>Dashboard ({role})</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push(profileRoute)}
          className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer hover:bg-muted font-medium text-sm text-foreground"
        >
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push(settingsRoute)}
          className="flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer hover:bg-muted font-medium text-sm text-foreground"
        >
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          <span>Change password</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          disabled={isLoggingOut}
          onClick={onLogout}
          className="flex items-center gap-2.5 p-2.5 rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
