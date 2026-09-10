"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Menu, User, Settings, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuth } from "@/redux/slices/authSlice";
import { clearUiState } from "@/redux/slices/userSlice";
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

interface DashNavbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DashNavbar: React.FC<DashNavbarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get user profile from Redux state
  const currentUser = useSelector((state: any) => state.user.user);

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(clearUiState());
    router.push("/login");
  };

  // Format path for breadcrumb display name (e.g. /dashboard/admin-list -> Admin List)
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    const segment = pathname.split("/").pop() || "";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-8 shrink-0">
      {/* Left section: Mobile Toggle & Page Title */}
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
        <h1 className="text-xl font-bold text-foreground truncate capitalize">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right section: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications Icon Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full border border-border p-0 cursor-pointer overflow-hidden"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name || "User Avatar"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {getInitials(currentUser?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1">
            <DropdownMenuLabel className="p-3.5 flex flex-col gap-0.5">
              <span className="font-semibold text-sm text-foreground leading-none">
                {currentUser?.name || "User"}
              </span>
              <span className="text-xs text-muted-foreground leading-none truncate">
                {currentUser?.email || ""}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings")}
              className="flex items-center gap-2 p-2.5"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 p-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashNavbar;