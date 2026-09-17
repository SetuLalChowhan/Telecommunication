"use client";

import React from "react";
import DoctorLayout from "@/layouts/DoctorLayout";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DoctorMessagesPage() {
  return (
    <DoctorLayout>
      <div className="w-full space-y-6 sm:space-y-7">
        <div className="pb-4 border-b border-border/70 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Patient Messages
          </h1>
          <p className="text-sm text-secondary-text">
            Direct clinical communication with registered patients regarding consultations and triage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 rounded-2xl border border-border/70 bg-card overflow-hidden h-[540px]">
          {/* Left conversations list */}
          <div className="border-r border-border/60 p-3 space-y-2 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3 cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">SC</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">Setulal Chowhan</p>
                <p className="text-[11px] text-muted-foreground truncate">Logged 128/82 mmHg morning BP</p>
              </div>
            </div>

            <div className="p-3 rounded-xl hover:bg-muted/60 transition-colors flex items-center gap-3 cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">MK</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">Maria Khan</p>
                <p className="text-[11px] text-muted-foreground truncate">Ready for 11:00 AM call</p>
              </div>
            </div>
          </div>

          {/* Right chat panel */}
          <div className="md:col-span-2 flex flex-col justify-between p-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-bold">SC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-bold text-foreground">Setulal Chowhan</p>
                <p className="text-[11px] text-muted-foreground">Appointment: Today · 4:30 PM (Video Consultation)</p>
              </div>
            </div>

            <div className="flex-1 py-4 space-y-3 overflow-y-auto">
              <div className="max-w-xs ml-auto p-3 rounded-2xl bg-primary text-white text-xs space-y-1">
                <p>Hello Setulal, please have your blood pressure reading handy before our call at 4:30 PM.</p>
                <span className="text-[10px] text-white/70 block text-right">10:15 AM</span>
              </div>
              <div className="max-w-xs p-3 rounded-2xl bg-muted/60 text-xs text-foreground space-y-1">
                <p>Sure doctor, I logged 128/82 mmHg this morning after breakfast.</p>
                <span className="text-[10px] text-muted-foreground block text-right">10:20 AM</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/60 flex items-center gap-2">
              <Input
                placeholder="Type your clinical instruction or response..."
                className="h-10 text-xs rounded-xl"
              />
              <Button size="icon" className="h-10 w-10 shrink-0 rounded-xl">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}
