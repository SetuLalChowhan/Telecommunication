"use client";

import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout";

const threads = [
  {
    id: "t-1",
    name: "Dr. Sarah Ahmed",
    specialty: "Cardiology",
    preview: "See you at 4:30 PM today",
    avatar:
      "https://images.unsplash.com/photo-1594824813515-7798c1995815?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "t-2",
    name: "Dr. Farhana Rahman",
    specialty: "General medicine",
    preview: "CBC report reviewed.",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
  },
];

export default function PatientMessagesPage() {
  const active = threads[0];

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Care"
        title="Inbox"
        description="Secure clinical messaging about prescriptions and follow-ups."
      />

      <div className="panel grid h-[calc(100vh-13rem)] min-h-[420px] grid-cols-1 overflow-hidden md:grid-cols-[minmax(220px,280px)_1fr]">
        {/* Threads */}
        <div className="flex flex-col overflow-hidden border-b border-border md:border-b-0 md:border-r">
          <div className="panel-header">
            <h2 className="panel-title">Conversations</h2>
            <span className="text-[11px] text-muted-foreground">
              {threads.length}
            </span>
          </div>

          <ul className="flex-1 divide-y divide-border overflow-y-auto">
            {threads.map((thread, index) => (
              <li key={thread.id}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                    index === 0
                      ? "bg-accent"
                      : "hover:bg-muted"
                  }`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={thread.avatar} alt={thread.name} />
                    <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                      {thread.name.replace("Dr. ", "").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {thread.name}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {thread.preview}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Conversation */}
        <div className="flex min-h-0 flex-col">
          <div className="panel-header">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={active.avatar} alt={active.name} />
                <AvatarFallback className="bg-muted text-[11px] font-semibold text-foreground">
                  {active.name.replace("Dr. ", "").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {active.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {active.specialty}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              Available
            </span>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
            <div className="max-w-md rounded-lg bg-muted px-3 py-2 text-xs text-foreground">
              <p>
                Please have your blood pressure reading handy before our call at
                4:30 PM.
              </p>
              <span className="mt-1 block text-right text-[10px] text-muted-foreground">
                10:15 AM
              </span>
            </div>
            <div className="ml-auto max-w-md rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground">
              <p>Logged 128/82 mmHg this morning after breakfast.</p>
              <span className="mt-1 block text-right text-[10px] text-primary-foreground/70">
                10:20 AM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3">
            <Input
              aria-label="Message"
              placeholder="Write a message"
              className="h-9 rounded-md text-xs"
            />
            <Button
              size="icon"
              aria-label="Send message"
              className="h-9 w-9 shrink-0 rounded-md"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
