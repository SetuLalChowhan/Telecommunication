"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientMessagesPage() {
  return (
    <div className="mx-auto max-w-lg py-16 px-4 text-center">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">
          Direct messaging is not available yet
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          We are working on enabling direct messages between patients and doctors. In the meantime, please discuss any questions or share reports during your scheduled consultation.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/patient/appointments">
            <Button variant="default" size="sm" className="h-9 px-4 text-xs font-medium rounded-lg">
              View appointments
            </Button>
          </Link>
          <Link href="/patient/dashboard">
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

