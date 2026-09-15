"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashNavbar from "@/components/dashboard/common/DashNavbar";
import SideBar, { type SidebarItem } from "@/components/dashboard/common/SideBar";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  FileCheck,
  Settings,
} from "lucide-react";
import useUserProfile from "@/lib/hooks/useUserProfile";

interface DoctorLayoutProps {
  children: React.ReactNode;
}

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
  useUserProfile();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const doctorNavItems: SidebarItem[] = [
    {
      id: 1,
      icon: <LayoutDashboard className="h-5 w-5" />,
      text: "Doctor Console",
      path: "/dashboard",
      activePaths: ["/dashboard"],
    },
    {
      id: 2,
      icon: <Calendar className="h-5 w-5" />,
      text: "Appointments",
      path: "/dashboard/appointments",
    },
    {
      id: 3,
      icon: <Users className="h-5 w-5" />,
      text: "My Patients",
      path: "/dashboard/patients",
    },
    {
      id: 4,
      icon: <Clock className="h-5 w-5" />,
      text: "Weekly Schedule",
      path: "/dashboard/schedule",
    },
    {
      id: 5,
      icon: <FileCheck className="h-5 w-5" />,
      text: "Verification Documents",
      path: "/doctor-verification",
    },
    {
      id: 6,
      icon: <Settings className="h-5 w-5" />,
      text: "Consultation Settings",
      path: "/dashboard/settings",
    },
  ];

  return (
    <div className="flex h-screen min-h-screen w-full bg-background text-foreground overflow-hidden">
      <SideBar open={open} setOpen={setOpen} sidebar={doctorNavItems} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashNavbar open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-muted/20">
          <div className="w-full space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
