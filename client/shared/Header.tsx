"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/common/BrandLogo";
import { useAuth } from "@/lib/api";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Find Doctors" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isDoctor, isSessionLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const dashboardRoute = isDoctor ? "/doctor/dashboard" : "/patient/dashboard";
  const firstName = user?.name ? user.name.split(" ")[0] : "Dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <BrandLogo showTagline={false} />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA / Auth buttons */}
        <div className="hidden md:flex items-center gap-3 min-w-[140px] justify-end">
          {!mounted || (isSessionLoading && !isAuthenticated) ? (
            <div className="flex items-center gap-2">
              <div className="h-9 w-20 rounded-xl bg-muted/60 animate-pulse" />
              <div className="h-9 w-28 rounded-xl bg-primary/20 animate-pulse" />
            </div>
          ) : isAuthenticated ? (
            <Link href={dashboardRoute}>
              <Button size="sm" className="gap-2 rounded-xl transition-all duration-200">
                <User className="h-4 w-4" />
                <span>Dashboard ({firstName})</span>
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-sm font-medium rounded-xl">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1.5 rounded-xl">
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="rounded-xl"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card px-4 py-5 md:hidden space-y-4">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {!mounted || (isSessionLoading && !isAuthenticated) ? (
              <div className="h-10 w-full rounded-xl bg-muted/50 animate-pulse" />
            ) : isAuthenticated ? (
              <Link href={dashboardRoute} onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full gap-2 rounded-xl">
                  <User className="h-4 w-4" />
                  <span>Go to Dashboard ({firstName})</span>
                </Button>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;