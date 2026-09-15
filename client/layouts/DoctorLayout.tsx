"use client";

import React, { useState } from "react";
import DoctorNavbar from "@/components/doctor/DoctorNavbar";
import DoctorSidebar from "@/components/doctor/DoctorSidebar";
import { useClient } from "@/lib/api";

interface DoctorLayoutProps {
  children: React.ReactNode;
}

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  useClient({ queryKey: ["user", "me"], url: "/users/me", isPrivate: true });
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-screen w-full bg-background text-foreground overflow-hidden">
      <DoctorSidebar open={open} setOpen={setOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DoctorNavbar open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-muted/20">
          <div className="w-full space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
