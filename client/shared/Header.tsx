"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  User as UserIcon,
  KeyRound,
  LogOut,
  ChevronRight,
  Stethoscope,
  Sparkles,
  HelpCircle,
  Info,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
import BrandLogo from "@/components/common/BrandLogo";
import { useAuth, getRoleDashboardRoute } from "@/lib/api";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Doctors" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About Us" },
];

export const Header: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isAuthenticated, isDoctor, isAdmin, isSessionLoading, logout, logoutMutation } = useAuth();
  const isLoggingOut = logoutMutation.isPending;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer upon route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const dashboardRoute = getRoleDashboardRoute(role);
  const profileRoute = isDoctor ? "/doctor/profile" : "/patient/profile";
  const settingsRoute = isDoctor ? "/doctor/settings" : "/patient/settings";

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

  const handleLogout = async () => {
    await logout();
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Global Logging Out Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-2xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-semibold text-foreground">Signing out securely...</span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
        <div className="max-w-[1920px] mx-auto section-padding-x flex h-18 sm:h-20 items-center justify-between">
          
          {/* MOBILE HEADER (Left: Hamburger, Center: Logo, Right: Avatar / Login) */}
          <div className="flex items-center justify-between w-full md:hidden">
            {/* 1. Left: Hamburger Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="h-10 w-10 rounded-xl text-foreground hover:bg-muted"
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* 2. Center: Logo */}
            <div className="flex items-center justify-center">
              <BrandLogo iconSize={18} />
            </div>

            {/* 3. Right: Avatar (if logged in) or Log in (if guest) */}
            <div className="flex items-center justify-end min-w-[40px]">
              {!mounted || isSessionLoading ? (
                <div className="h-9 w-9 rounded-full bg-muted/70 animate-pulse" />
              ) : isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="relative h-9.5 w-9.5 rounded-full border-2 border-primary/30 p-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all hover:border-primary"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user?.image || undefined} alt={user?.name || "User"} referrerPolicy="no-referrer" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60 p-1.5 rounded-2xl shadow-xl border border-border">
                    <DropdownMenuLabel className="p-3 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-foreground truncate">
                          {user?.name || "User"}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase">
                          {role || "PATIENT"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate">{user?.email || ""}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(dashboardRoute)} className="gap-2.5 p-2.5 rounded-xl cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 text-primary" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(profileRoute)} className="gap-2.5 p-2.5 rounded-xl cursor-pointer">
                      <UserIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(settingsRoute)} className="gap-2.5 p-2.5 rounded-xl cursor-pointer">
                      <KeyRound className="h-4 w-4 text-muted-foreground" />
                      <span>Change password</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="gap-2.5 p-2.5 rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-xs sm:text-sm px-3 h-9 rounded-xl text-primary hover:bg-primary/10">
                    Log in
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* DESKTOP HEADER (Brand Logo, Nav Links, Right CTA / Avatar) */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Left: Brand Logo */}
            <BrandLogo iconSize={20} />

            {/* Middle: Prominent Desktop Navigation Links */}
            <nav className="flex items-center gap-7 lg:gap-9">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-[15.5px] lg:text-base font-medium tracking-tight transition-colors py-1.5 relative",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-foreground/80 hover:text-primary"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Desktop CTA / Humanized Avatar Dropdown */}
            <div className="flex items-center gap-3.5 min-w-[160px] justify-end">
              {!mounted || isSessionLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-9 w-20 rounded-xl bg-muted/60 animate-pulse" />
                  <div className="h-9 w-28 rounded-xl bg-primary/20 animate-pulse" />
                </div>
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
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
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer font-medium text-sm"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link href="/login">
                    <Button variant="ghost" className="h-10 px-4 text-[15px] font-medium rounded-xl text-foreground hover:bg-muted">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="h-10 px-5 text-[15px] font-semibold rounded-xl bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/20 gap-1.5 transition-all">
                      <span>Get started</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER (Smooth backdrop + slide-in navigation) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 w-[82vw] max-w-sm bg-background border-r border-border shadow-2xl p-5 flex flex-col justify-between z-50 animate-in slide-in-from-left duration-300">
            {/* Top Area: Logo + Close Button */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/80">
                <BrandLogo iconSize={18} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                  aria-label="Close drawer"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground/80 hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions Area (Only for Guest) */}
            {!isAuthenticated && (
              <div className="pt-5 border-t border-border/80">
                <div className="flex flex-col gap-2.5">
                  <Link href="/register" onClick={() => setMobileDrawerOpen(false)}>
                    <Button className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl gap-1.5 shadow-sm shadow-primary/20">
                      <span>Get started</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/login" onClick={() => setMobileDrawerOpen(false)}>
                    <Button variant="outline" className="w-full h-11 border-border text-foreground font-semibold rounded-xl hover:bg-muted/60">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;