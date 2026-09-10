import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  CheckCircle2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import modular settings sub-components
import ProfileForm from "@/components/settings/ProfileForm"
import SecurityForm from "@/components/settings/SecurityForm"
import NotificationForm from "@/components/settings/NotificationForm"
import PreferenceForm from "@/components/settings/PreferenceForm"

const Settings: React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = location.pathname.split("/").pop() || "profile"

  const handleTabChange = (val: string) => {
    navigate(`/dashboard/settings/${val}`)
  }

  const triggerToast = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure security credentials, notification channels, and global user profiles.
        </p>
      </div>

      {/* Dynamic Alert Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 mb-4 text-sm text-emerald-800 rounded-lg bg-emerald-50 border border-emerald-200 transition-all">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Tabs list wrapper */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col md:flex-row gap-6">
        <TabsList className="flex flex-row md:flex-col h-auto md:w-60 bg-muted/30 border border-border p-1.5 rounded-xl justify-start items-stretch gap-1 shrink-0 overflow-x-auto">
          <TabsTrigger value="profile" className="flex items-center justify-start gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg cursor-pointer data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-left">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            Profile Details
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center justify-start gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg cursor-pointer data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-left">
            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
            Security & Access
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center justify-start gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg cursor-pointer data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-left">
            <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center justify-start gap-2.5 px-4 py-2.5 text-xs font-semibold rounded-lg cursor-pointer data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-left">
            <SettingsIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            Preferences
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          {/* PROFILE FORM */}
          <TabsContent value="profile" className="m-0">
            <ProfileForm triggerToast={triggerToast} />
          </TabsContent>

          {/* SECURITY FORM */}
          <TabsContent value="security" className="m-0">
            <SecurityForm triggerToast={triggerToast} />
          </TabsContent>

          {/* NOTIFICATIONS FORM */}
          <TabsContent value="notifications" className="m-0">
            <NotificationForm triggerToast={triggerToast} />
          </TabsContent>

          {/* PREFERENCES FORM */}
          <TabsContent value="preferences" className="m-0">
            <PreferenceForm triggerToast={triggerToast} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default Settings
