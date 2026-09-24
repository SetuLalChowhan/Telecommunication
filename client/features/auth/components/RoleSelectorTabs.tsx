"use client";

import React from "react";
import { User, Stethoscope } from "lucide-react";

interface RoleSelectorTabsProps {
  role: "PATIENT" | "DOCTOR";
  onChange: (role: "PATIENT" | "DOCTOR") => void;
  disabled?: boolean;
}

export const RoleSelectorTabs: React.FC<RoleSelectorTabsProps> = ({
  role,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("PATIENT")}
        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
          role === "PATIENT"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User className="h-4 w-4 text-primary" />
        <span>I&apos;m a Patient</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("DOCTOR")}
        className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
          role === "DOCTOR"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Stethoscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span>I&apos;m a Doctor</span>
      </button>
    </div>
  );
};
