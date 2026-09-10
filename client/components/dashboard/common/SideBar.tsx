"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, Box, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SubLink {
  id: number;
  path: string;
  text: string;
}

export interface SidebarItem {
  id: number;
  text: string;
  path?: string;
  activePaths?: string[] | string;
  icon?: React.ReactNode;
  sublink?: SubLink[];
}

interface SideBarProps {
  sidebar: SidebarItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ sidebar, open, setOpen }) => {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});

  // Automatically expand dropdown groups containing the active sublink
  useEffect(() => {
    sidebar.forEach((item) => {
      if (item.sublink?.some((sub) => pathname === sub.path)) {
        setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [pathname, sidebar]);

  const isActive = (paths?: string[] | string) => {
    if (!paths) return false;
    const pathArray = Array.isArray(paths) ? paths : [paths];
    return pathArray.some((path) => pathname === path);
  };

  const toggleGroup = (id: number) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card text-card-foreground transition-transform duration-300 ease-in-out xl:static xl:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Box className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span>Dashboard</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 xl:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1.5">
            {sidebar.map((item) => {
              const hasSublinks = item.sublink && item.sublink.length > 0;
              const isGroupOpen = !!openGroups[item.id];
              const active =
                isActive(item.activePaths) ||
                (hasSublinks && item.sublink!.some((sub) => pathname === sub.path));

              if (hasSublinks) {
                return (
                  <div key={item.id} className="space-y-1">
                    {/* Collapsible Trigger */}
                    <button
                      onClick={() => toggleGroup(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer text-left",
                        active
                          ? "bg-primary/5 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        {item.icon && (
                          <span className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground")}>
                            {item.icon}
                          </span>
                        )}
                        <span>{item.text}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
                          isGroupOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Sublinks dropdown drawer */}
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200 pl-9 pr-2 space-y-1",
                        isGroupOpen ? "max-h-40 opacity-100 py-1" : "max-h-0 opacity-0 py-0"
                      )}
                    >
                      {item.sublink!.map((sub) => {
                        const subActive = pathname === sub.path;
                        return (
                          <Link
                            key={sub.id}
                            href={sub.path}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "block rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors",
                              subActive
                                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            {sub.text}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // Simple Link
              return (
                <div key={item.id} className="space-y-1">
                  <Link
                    href={item.path || "/"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon && (
                      <span className={cn("shrink-0", active ? "text-primary-foreground" : "text-muted-foreground")}>
                        {item.icon}
                      </span>
                    )}
                    <span>{item.text}</span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer Settings/Logout Section */}
        <div className="p-4 border-t border-border mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={() => {
              console.log("Logged out");
            }}
          >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;