import React from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { Bell, Menu, User, Settings, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface CommonNavbarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const CommonNavbar: React.FC<CommonNavbarProps> = ({ open, setOpen }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Generate dynamic breadcrumbs based on pathname
  const pathnames = location.pathname.split("/").filter((x) => x)

  const handleLogout = () => {
    // Navigate back to login
    navigate("/login")
  }

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-card px-4 md:px-8 shrink-0">
      {/* Left side: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Dynamic Breadcrumbs */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join("/")}`
              const isLast = index === pathnames.length - 1
              const formattedName = value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ")

              return (
                <React.Fragment key={to}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-semibold text-foreground truncate max-w-[120px] md:max-w-[200px]">
                        {formattedName}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={to} className="text-muted-foreground hover:text-foreground capitalize">
                          {formattedName}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side: Global search, notifications, profile */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative w-40 md:w-60 hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search..."
            className="pl-9 h-8 text-xs bg-muted/40 border-border focus-visible:ring-primary"
          />
        </div>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-destructive p-0 text-[10px] text-destructive-foreground hover:bg-destructive shadow-sm">
                3
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <DropdownMenuLabel className="p-4 font-semibold text-sm">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="p-4 border-b border-border flex flex-col items-start gap-1 cursor-pointer">
                <div className="flex justify-between w-full">
                  <span className="font-medium text-xs text-foreground">New User Signup</span>
                  <span className="text-[10px] text-muted-foreground">5m ago</span>
                </div>
                <p className="text-xs text-muted-foreground">User Setu Lal registered a new account.</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 border-b border-border flex flex-col items-start gap-1 cursor-pointer">
                <div className="flex justify-between w-full">
                  <span className="font-medium text-xs text-foreground">Server CPU Spike</span>
                  <span className="text-[10px] text-muted-foreground">2h ago</span>
                </div>
                <p className="text-xs text-muted-foreground">CPU utilization exceeded 90% threshold.</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 flex flex-col items-start gap-1 cursor-pointer">
                <div className="flex justify-between w-full">
                  <span className="font-medium text-xs text-foreground">Backup Finished</span>
                  <span className="text-[10px] text-muted-foreground">1d ago</span>
                </div>
                <p className="text-xs text-muted-foreground">Daily database backup successfully uploaded.</p>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2 text-center border-t">
              <Link to="/dashboard" className="text-xs text-primary font-medium hover:underline block py-1">
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 cursor-pointer">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" alt="Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal flex flex-col p-3">
              <span className="font-semibold text-sm text-foreground">Setu Lal</span>
              <span className="text-xs text-muted-foreground mt-0.5">setu@example.com</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/dashboard/settings" className="flex items-center gap-2 w-full py-1.5">
                <User className="h-4 w-4 text-muted-foreground" />
                Profile Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/dashboard/settings" className="flex items-center gap-2 w-full py-1.5">
                <Settings className="h-4 w-4 text-muted-foreground" />
                System Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer py-1.5">
              <div className="flex items-center gap-2 w-full">
                <LogOut className="h-4 w-4" />
                Log Out
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default CommonNavbar
