"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MinaAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "speaking" | "listening" | "offline";
  className?: string;
  showBadge?: boolean;
}

export const MinaAvatar: React.FC<MinaAvatarProps> = ({
  size = "md",
  status = "online",
  className,
  showBadge = true,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-11 h-11 text-xs",
    lg: "w-16 h-16 text-sm",
    xl: "w-24 h-24 text-base",
  }[size];

  const badgeSize = {
    sm: "w-2.5 h-2.5 -bottom-0.5 -right-0.5 border-[1.5px]",
    md: "w-3.5 h-3.5 bottom-0 right-0 border-2",
    lg: "w-4.5 h-4.5 bottom-0.5 right-0.5 border-2",
    xl: "w-6 h-6 bottom-1 right-1 border-2",
  }[size];

  return (
    <div className={cn("relative inline-flex items-center justify-center shrink-0", className)}>
      {/* Outer audio pulse wave when speaking or listening */}
      {(status === "speaking" || status === "listening") && (
        <>
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping opacity-35",
              status === "speaking" ? "bg-[#97cde5]" : "bg-[#c8dfaa]"
            )}
          />
          <span
            className={cn(
              "absolute -inset-1 rounded-full animate-pulse opacity-40",
              status === "speaking" ? "bg-sky-400" : "bg-emerald-400"
            )}
          />
        </>
      )}

      {/* Main Avatar Container */}
      <div
        className={cn(
          sizeClasses,
          "relative overflow-hidden rounded-full border border-border shadow-sm flex items-center justify-center bg-gradient-to-b from-[#eaf4f8] via-[#f3f1eb] to-[#e4eed7] select-none"
        )}
      >
        {/* Custom Stylized Doctor Mina SVG Avatar */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle highlight */}
          <circle cx="50" cy="50" r="48" fill="#F4F8FA" />
          
          {/* Stethoscope neck curve */}
          <path
            d="M32 60 C32 78, 68 78, 68 60"
            stroke="#4a4a4c"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="50" cy="77" r="4" fill="#97cde5" stroke="#28262a" strokeWidth="2" />

          {/* Shoulders / Doctor Coat */}
          <path
            d="M16 98 C18 82, 32 74, 50 74 C68 74, 82 82, 84 98"
            fill="#ffffff"
            stroke="#dddcdd"
            strokeWidth="2"
          />
          {/* Inner Teal Scrub */}
          <path
            d="M39 74 L50 86 L61 74 Z"
            fill="#97cde5"
            opacity="0.85"
          />

          {/* Neck */}
          <path
            d="M44 60 L44 68 C44 71, 56 71, 56 68 L56 60 Z"
            fill="#F6D5C2"
          />

          {/* Hair back */}
          <path
            d="M26 44 C24 64, 27 75, 33 78 C36 68, 35 56, 36 50 C37 40, 63 40, 64 50 C65 56, 64 68, 67 78 C73 75, 76 64, 74 44 C72 26, 66 22, 50 22 C34 22, 28 26, 26 44 Z"
            fill="#28262A"
          />

          {/* Head / Face */}
          <ellipse cx="50" cy="46" rx="17" ry="19" fill="#FCE5D8" />

          {/* Hair bangs / front */}
          <path
            d="M33 38 C36 30, 48 27, 67 36 C64 30, 58 25, 50 25 C40 25, 34 30, 33 38 Z"
            fill="#28262A"
          />
          <path
            d="M33 38 C39 42, 46 36, 49 34 C43 32, 37 34, 33 38 Z"
            fill="#1E1D1F"
          />

          {/* Eyes & Eyebrows */}
          <circle cx="43.5" cy="45.5" r="2.2" fill="#28262A" />
          <circle cx="56.5" cy="45.5" r="2.2" fill="#28262A" />
          <circle cx="44.2" cy="44.8" r="0.7" fill="#ffffff" />
          <circle cx="57.2" cy="44.8" r="0.7" fill="#ffffff" />

          <path d="M40 41.5 C42 40, 46 40.5, 47 41.5" stroke="#28262A" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M53 41.5 C54 40.5, 58 40, 60 41.5" stroke="#28262A" strokeWidth="1.2" strokeLinecap="round" />

          {/* Gentle Blush */}
          <ellipse cx="40" cy="49" rx="2.5" ry="1.5" fill="#F8A5A5" opacity="0.6" />
          <ellipse cx="60" cy="49" rx="2.5" ry="1.5" fill="#F8A5A5" opacity="0.6" />

          {/* Friendly Smile */}
          <path
            d="M45.5 52 C47.5 55, 52.5 55, 54.5 52"
            stroke="#9C4444"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Headset with micro-microphone (indicates AI Telehealth Consultant) */}
          <path
            d="M31 43 C30 32, 38 23, 50 23 C62 23, 70 32, 69 43"
            stroke="#97cde5"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <rect x="29" y="41" width="4" height="8" rx="2" fill="#28262A" />
          <rect x="67" y="41" width="4" height="8" rx="2" fill="#28262A" />
          <path
            d="M31 47 C32 55, 38 58, 43 57"
            stroke="#28262A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="44" cy="57" r="1.8" fill="#97cde5" />
        </svg>
      </div>

      {/* Online / Active Badge Indicator */}
      {showBadge && (
        <span
          className={cn(
            "absolute rounded-full border-background",
            badgeSize,
            status === "online" && "bg-emerald-500",
            status === "speaking" && "bg-[#97cde5] animate-pulse",
            status === "listening" && "bg-[#c8dfaa] animate-bounce",
            status === "offline" && "bg-neutral-400"
          )}
          title={`Mina is ${status}`}
        />
      )}
    </div>
  );
};

