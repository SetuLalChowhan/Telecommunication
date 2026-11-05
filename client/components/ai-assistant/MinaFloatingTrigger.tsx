"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, X, Sparkles } from "lucide-react";
import { MinaAvatar } from "./MinaAvatar";
import { cn } from "@/lib/utils";

interface MinaFloatingTriggerProps {
  isOpen: boolean;
  onOpenChat: () => void;
  language: "bn" | "en";
}

export const MinaFloatingTrigger: React.FC<MinaFloatingTriggerProps> = ({
  isOpen,
  onOpenChat,
  language,
}) => {
  const [showGreetingTooltip, setShowGreetingTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setShowGreetingTooltip(true);
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowGreetingTooltip(false);
      setHasInteracted(true);
    }
  }, [isOpen]);

  if (isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 select-none">
      {/* Friendly Speech Bubble Greeting */}
      {showGreetingTooltip && (
        <div className="relative mb-0.5 flex items-start gap-2 max-w-[270px] rounded-2xl border border-border/80 bg-card p-2.5 shadow-xl animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-primary">
              <Sparkles size={11} />
              <span>{language === "bn" ? "ডক্টর মিনা এআই" : "Dr. Mina AI"}</span>
            </div>
            <p className="mt-0.5 text-xs text-foreground leading-snug">
              {language === "bn"
                ? "আসসালামু আলাইকুম! স্বাস্থ্য পরামর্শ বা ডাক্তার বুকিংয়ে সাহায্য পেতে ক্লিক করুন।"
                : "Assalamu Alaikum! Need doctor booking or health guidance? Chat with me anytime!"}
            </p>
          </div>
          <button
            onClick={() => {
              setShowGreetingTooltip(false);
              setHasInteracted(true);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
            title="Dismiss"
          >
            <X size={12} />
          </button>
          <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-r border-b border-border/80 bg-card" />
        </div>
      )}

      {/* Clean Single Modern Floating Capsule */}
      <button
        onClick={() => {
          setHasInteracted(true);
          setShowGreetingTooltip(false);
          onOpenChat();
        }}
        className={cn(
          "group relative flex items-center gap-2.5 rounded-full border border-border/80 bg-card p-1.5 pr-4 text-foreground shadow-lg hover:shadow-xl hover:border-primary/50 active:scale-95 transition-all"
        )}
        title="Chat with Dr. Mina"
      >
        {/* Subtle glowing ring aura */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[#97cde5]/40 to-[#c8dfaa]/40 opacity-70 blur-xs -z-10 group-hover:opacity-100 transition-opacity" />

        <MinaAvatar size="md" status="online" />

        <div className="flex flex-col text-left">
          <span className="text-xs font-bold leading-tight text-foreground flex items-center gap-1">
            Mina
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight font-medium">
            {language === "bn" ? "এআই ডাক্তার" : "TeleHealth AI"}
          </span>
        </div>

        <div className="h-4 w-px bg-border/60 ml-0.5" />

        <MessageSquare
          size={16}
          className="text-primary group-hover:scale-110 transition-transform"
        />
      </button>
    </div>
  );
};
