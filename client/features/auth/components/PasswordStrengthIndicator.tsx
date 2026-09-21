"use client";

import React from "react";
import { Check } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  rules: {
    hasLength: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
  };
  strengthPercent: number;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  rules,
  strengthPercent,
}) => {
  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground font-medium">Password Strength</span>
        <span
          className={`font-bold ${
            strengthPercent === 100
              ? "text-emerald-600"
              : strengthPercent > 33
              ? "text-amber-600"
              : "text-red-500"
          }`}
        >
          {strengthPercent === 100 ? "Strong" : strengthPercent > 33 ? "Medium" : "Weak"}
        </span>
      </div>

      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            strengthPercent === 100
              ? "bg-emerald-500"
              : strengthPercent > 33
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
          style={{ width: `${strengthPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-muted-foreground">
        <span className={`flex items-center gap-1 ${rules.hasLength ? "text-emerald-600 font-semibold" : ""}`}>
          <Check className={`h-3 w-3 ${rules.hasLength ? "opacity-100" : "opacity-30"}`} />
          8+ chars
        </span>
        <span className={`flex items-center gap-1 ${rules.hasUppercase ? "text-emerald-600 font-semibold" : ""}`}>
          <Check className={`h-3 w-3 ${rules.hasUppercase ? "opacity-100" : "opacity-30"}`} />
          1 uppercase
        </span>
        <span className={`flex items-center gap-1 ${rules.hasNumber ? "text-emerald-600 font-semibold" : ""}`}>
          <Check className={`h-3 w-3 ${rules.hasNumber ? "opacity-100" : "opacity-30"}`} />
          1 number
        </span>
      </div>
    </div>
  );
};
