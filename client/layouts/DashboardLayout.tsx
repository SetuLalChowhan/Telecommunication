"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashNavbar from "@/components/dashboard/common/DashNavbar";
import SideBar, { type SidebarItem } from "@/components/dashboard/common/SideBar";
import { LayoutDashboard, UserCog } from "lucide-react";
import useUserProfile from "@/api/hooks/useUserProfile";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  useUserProfile();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const sideBarItems: SidebarItem[] = [
    {
      id: 1,
      icon: <LayoutDashboard className="h-5 w-5" />,
      text: "Dashboard",
      path: "/dashboard",
      activePaths: ["/dashboard", "/dashboard/settings", "/dashboard/analytics"],
    },
    {
      id: 2,
      icon: <UserCog className="h-5 w-5" />,
      text: "Admin Management",
      path: "/dashboard/admin-list",
      sublink: [
        { id: 1, text: "Admin List", path: "/dashboard/admin-list" },
        { id: 2, text: "Add New Admin", path: "/dashboard/asdasd" },
      ],
    },
  ];

  return (
    <div className="flex h-screen min-h-screen w-full bg-background text-foreground overflow-hidden">
      <SideBar open={open} setOpen={setOpen} sidebar={sideBarItems} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashNavbar open={open} setOpen={setOpen} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-muted/20">
          <div className="w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;