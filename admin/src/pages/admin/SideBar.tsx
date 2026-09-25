import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { LogOut, X, Box, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/features/auth/api/auth.queries"

export interface SidebarItem {
  id: number
  text: string
  path?: string
  activePaths?: string[] | string
  icon?: React.ReactNode
  sublink?: { id: number; path: string; text: string }[]
}

interface SideBarProps {
  sidebar: SidebarItem[]
  open: boolean
  setOpen: (open: boolean) => void
}

const SideBar: React.FC<SideBarProps> = ({ sidebar, open, setOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useLogout()
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({})

  // Automatically expand dropdown groups containing the active sublink
  useEffect(() => {
    sidebar.forEach((item) => {
      if (item.sublink?.some((sub) => location.pathname === sub.path)) {
        setOpenGroups((prev) => ({ ...prev, [item.id]: true }))
      }
    })
  }, [location.pathname, sidebar])

  const isActive = (paths?: string[] | string) => {
    if (!paths) return false
    const pathArray = Array.isArray(paths) ? paths : [paths]
    return pathArray.some((path) =>
      // A trailing `/*` opts into prefix matching (used by detail routes).
      path.endsWith("/*")
        ? location.pathname === path.slice(0, -2) ||
            location.pathname.startsWith(path.slice(0, -1))
        : location.pathname === path,
    )
  }

  const toggleGroup = (id: number) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {/* Mobile Sidebar Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card text-card-foreground transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 font-bold text-lg text-foreground tracking-tight"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Box className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span>AdminPanel</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1.5">
            {sidebar.map((item) => {
              const hasSublinks = item.sublink && item.sublink.length > 0
              const isGroupOpen = !!openGroups[item.id]
              const active = isActive(item.activePaths) || 
                (hasSublinks && item.sublink!.some((sub) => location.pathname === sub.path))

              if (hasSublinks) {
                return (
                  <div key={item.id} className="space-y-0.5">
                    {/* Collapsible Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleGroup(item.id)}
                      aria-expanded={isGroupOpen}
                      className={cn(
                        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 font-semibold text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <span className="flex items-center gap-3.5">
                        {item.icon && (
                          <span className={cn("shrink-0", active ? "text-primary" : "text-muted-foreground")}>
                            {item.icon}
                          </span>
                        )}
                        <span>{item.text}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          active ? "text-primary" : "text-muted-foreground/70",
                          isGroupOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Sublinks dropdown drawer — grid-rows animation avoids the
                        clipping/jumpy max-height trick and keeps an aligned rail. */}
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                        isGroupOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-[1.375rem] space-y-0.5 border-l border-border pb-1 pl-[1.5rem]">
                          {item.sublink!.map((sub) => {
                            const subActive = location.pathname === sub.path
                            return (
                              <Link
                                key={sub.id}
                                to={sub.path}
                                onClick={() => setOpen(false)}
                                className={cn(
                                  "block rounded-md px-3 py-2 text-[13px] font-medium transition-colors",
                                  subActive
                                    ? "bg-primary font-semibold text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                              >
                                {sub.text}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              // Simple Link
              return (
                <div key={item.id} className="space-y-1">
                  <Link
                    to={item.path || "/"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon && (
                      <span className={cn("shrink-0", active ? "text-primary-foreground" : "text-muted-foreground")}>
                        {item.icon}
                      </span>
                    )}
                    <span>{item.text}</span>
                  </Link>
                </div>
              )
            })}
          </nav>
        </div>

        {/* Footer Settings/Logout Section */}
        <div className="p-4 border-t border-border mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            disabled={logout.isPending}
            onClick={() => logout.mutate(undefined, { onSuccess: () => navigate("/login") })}
          >
            <LogOut className="h-5 w-5" />
            <span>{logout.isPending ? "Signing out…" : "Log Out"}</span>
          </Button>
        </div>
      </aside>
    </>
  )
}

export default SideBar
