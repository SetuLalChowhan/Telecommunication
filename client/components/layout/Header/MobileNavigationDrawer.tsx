"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/common/BrandLogo";
import { NAV_LINKS } from "./DesktopNavigation";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  isAuthenticated: boolean;
  onClose: () => void;
}

export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  isAuthenticated,
  onClose,
}) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 w-[82vw] max-w-sm bg-background border-r border-border shadow-2xl p-5 flex flex-col justify-between z-50 animate-in slide-in-from-left duration-300">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <BrandLogo iconSize={18} />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex flex-col space-y-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
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

        {!isAuthenticated && (
          <div className="pt-5 border-t border-border/80">
            <div className="flex flex-col gap-2.5">
              <Link href="/register" onClick={onClose}>
                <Button className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl gap-1.5 shadow-sm shadow-primary/20">
                  <span>Get started</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/login" onClick={onClose}>
                <Button variant="outline" className="w-full h-11 border-border text-foreground font-semibold rounded-xl hover:bg-muted/60">
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
