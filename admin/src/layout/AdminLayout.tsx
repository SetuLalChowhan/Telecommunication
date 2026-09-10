import React, { useEffect, useState } from "react"
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom"
import CommonNavbar from "../pages/admin/CommonNavbar"
import SideBar, { type SidebarItem } from "../pages/admin/SideBar"
import { LayoutDashboard, Settings, Layers } from "lucide-react"
import useUserProfile from "@/hooks/fetchUserProfile"

const AdminLayout: React.FC = () => {
  // Sync profile data
  useUserProfile()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Scroll to top on navigation changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.pathname])

  const sidebarNavigation: SidebarItem[] = [
    {
      id: 1,
      icon: <LayoutDashboard className="h-5 w-5" />,
      text: "Dashboard",
      path: "/dashboard",
      activePaths: ["/dashboard"],
    },
    {
      id: 2,
      icon: <Layers className="h-5 w-5" />,
      text: "Components Showcase",
      path: "/dashboard/showcase",
      activePaths: ["/dashboard/showcase"],
    },
    {
      id: 3,
      icon: <Settings className="h-5 w-5" />,
      text: "Settings",
      path: "/dashboard/settings/profile",
      activePaths: [
        "/dashboard/settings",
        "/dashboard/settings/profile",
        "/dashboard/settings/security",
      ],
      sublink: [
        { id: 1, path: "/dashboard/settings/profile", text: "Profile Settings" },
        { id: 2, path: "/dashboard/settings/security", text: "Security Credentials" },
      ],
    },
  ]

  return (
    <>
      <ScrollRestoration />
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        {/* Sidebar wrapper */}
        <SideBar open={sidebarOpen} setOpen={setSidebarOpen} sidebar={sidebarNavigation} />

        {/* Content Shell */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <CommonNavbar open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* Core scrollable viewport - Full Width */}
          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 bg-muted/20">
            <div className="w-full space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default AdminLayout
