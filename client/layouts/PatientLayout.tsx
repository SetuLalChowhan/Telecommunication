"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashNavbar from "@/components/dashboard/common/DashNavbar";
import SideBar, { type SidebarItem } from "@/components/dashboard/common/SideBar";
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  FileText,
  Clock,
  User,
} from "lucide-react";
import useUserProfile from "@/lib/hooks/useUserProfile";

interface PatientLayoutProps {
  children: React.ReactNode;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
  useUserProfile();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const patientNavItems: SidebarItem[] = [
    {
      id: 1,
      icon: <LayoutDashboard className="h-5 w-5" />,
      text: "Patient Portal",
      path: "/dashboard",
      activePaths: ["/dashboard"],
    },
    {
      id: 2,
      icon: <Stethoscope className="h-5 w-5" />,
      text: "Find a Doctor",
      path: "/doctors",
    },
    {
      id: 3,
      icon: <Calendar className="h-5 w-5" />,
      text: "My Appointments",
      path: "/dashboard/appointments",
    },
    {
      id: 4,
      icon: <FileText className="h-5 w-5" />,
      text: "Prescriptions & Records",
      path: "/dashboard/records",
    },
    {
      id: 5,
      icon: <Clock className="h-5 w-5" />,
      text: "Consultation History",
      path: "/dashboard/history",
    },
    {
      id: 6,
      icon: <User className="h-5 w-5" />,
      text: "My Profile",
      path: "/dashboard/profile",
    },
  ];

  return (
    <div className="flex h-screen min-h-screen w-full bg-background text-foreground overflow-hidden">
      <SideBar open={open} setOpen={setOpen} sidebar={patientNavItems} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashNavbar open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-muted/20">
          <div className="w-full space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
