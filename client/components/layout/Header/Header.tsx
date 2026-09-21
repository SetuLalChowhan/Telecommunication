"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Menu, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/common/BrandLogo";
import { useAuth, getRoleDashboardRoute } from "@/lib/api";
import { DesktopNavigation } from "./DesktopNavigation";
import { UserDropdownMenu } from "./UserDropdownMenu";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";

export const Header: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { user, role, isAuthenticated, isDoctor, isSessionLoading, logout, logoutMutation } = useAuth();
  const isLoggingOut = logoutMutation.isPending;

  useEffect(() => {
    document.body.style.overflow = mobileDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const dashboardRoute = getRoleDashboardRoute(role);
  const profileRoute = isDoctor ? "/doctor/profile" : "/patient/profile";
  const settingsRoute = isDoctor ? "/doctor/settings" : "/patient/settings";

  const handleLogout = async () => {
    await logout();
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-2xl">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-semibold text-foreground">Signing out securely...</span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
        <div className="max-w-[1920px] mx-auto section-padding-x flex h-16 sm:h-18 items-center justify-between">
          {/* Mobile Header */}
          <div className="flex items-center justify-between w-full md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="h-9.5 w-9.5 rounded-xl text-foreground hover:bg-muted"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <BrandLogo iconSize={18} />

            <div className="flex items-center justify-end min-w-[40px]">
              {!mounted || isSessionLoading ? (
                <div className="h-9 w-9 rounded-full bg-muted/70 animate-pulse" />
              ) : isAuthenticated ? (
                <UserDropdownMenu
                  user={user}
                  role={role}
                  isDoctor={isDoctor}
                  dashboardRoute={dashboardRoute}
                  profileRoute={profileRoute}
                  settingsRoute={settingsRoute}
                  isLoggingOut={isLoggingOut}
                  onLogout={handleLogout}
                  variant="mobile"
                />
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-xs sm:text-sm px-3 h-8.5 rounded-xl text-primary hover:bg-primary/10">
                    Log in
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between w-full">
            <BrandLogo iconSize={19} />
            <DesktopNavigation />
            <div className="flex items-center gap-3.5 min-w-[160px] justify-end">
              {!mounted || isSessionLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-9 w-20 rounded-xl bg-muted/60 animate-pulse" />
                  <div className="h-9 w-28 rounded-xl bg-primary/20 animate-pulse" />
                </div>
              ) : isAuthenticated ? (
                <UserDropdownMenu
                  user={user}
                  role={role}
                  isDoctor={isDoctor}
                  dashboardRoute={dashboardRoute}
                  profileRoute={profileRoute}
                  settingsRoute={settingsRoute}
                  isLoggingOut={isLoggingOut}
                  onLogout={handleLogout}
                  variant="desktop"
                />
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

      <MobileNavigationDrawer
        isOpen={mobileDrawerOpen}
        isAuthenticated={isAuthenticated}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  );
};

export default Header;
