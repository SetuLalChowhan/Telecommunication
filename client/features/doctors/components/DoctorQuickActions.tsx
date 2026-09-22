"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  MessagesSquare,
  Users,
} from "lucide-react";

interface Shortcut {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const shortcuts: Shortcut[] = [
  {
    label: "Consultation queue",
    description: "Review and confirm requests",
    href: "/doctor/appointments",
    icon: CalendarDays,
  },
  {
    label: "Patient directory",
    description: "Consultation histories",
    href: "/doctor/patients",
    icon: Users,
  },
  {
    label: "Availability & leaves",
    description: "Set consulting hours",
    href: "/doctor/schedule",
    icon: Clock,
  },
  {
    label: "Patient messages",
    description: "Secure clinical messaging",
    href: "/doctor/messages",
    icon: MessagesSquare,
  },
];

export const DoctorQuickActions: React.FC = () => {
  return (
    <section className="panel overflow-hidden">
      <div className="panel-header">
        <h2 className="panel-title">Shortcuts</h2>
      </div>

      <ul className="divide-y divide-border">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {item.description}
                  </span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default DoctorQuickActions;
