"use client";

import React, { useState } from "react";
import PatientNavbar from "@/components/patient/PatientNavbar";
import PatientSidebar from "@/components/patient/PatientSidebar";
import { useClient } from "@/lib/api";

interface PatientLayoutProps {
  children: React.ReactNode;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  useClient({ queryKey: ["user", "me"], url: "/users/me", isPrivate: true });
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-screen w-full bg-background text-foreground overflow-hidden">
      <PatientSidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PatientNavbar open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-muted/20">
          <div className="w-full space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;

