"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DoctorMessagesPage() {
  return (
    <div className="mx-auto max-w-lg py-16 px-4 text-center">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">
          Patient messaging is not available yet
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Direct messaging with patients will be enabled in an upcoming release. Please use the appointment schedule and consultation notes for patient management.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/doctor/appointments">
            <Button variant="default" size="sm" className="h-9 px-4 text-xs font-medium rounded-lg">
              View schedule
            </Button>
          </Link>
          <Link href="/doctor/dashboard">
            <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-medium rounded-lg gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

