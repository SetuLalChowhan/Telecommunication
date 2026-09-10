import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const preferencesSchema = z.object({
  language: z.string().min(1, "Please select a language"),
  theme: z.string().min(1, "Please select a theme"),
  timezone: z.string().min(1, "Please select a timezone"),
})

type PreferenceValues = z.infer<typeof preferencesSchema>

interface PreferenceFormProps {
  triggerToast: (msg: string) => void
}

const PreferenceForm: React.FC<PreferenceFormProps> = ({ triggerToast }) => {
  const preferenceForm = useForm<PreferenceValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: { language: "en", theme: "system", timezone: "utc+6" },
  })

  const onSavePreferences = (data: PreferenceValues) => {
    console.log("Saving preference data: ", data)
    triggerToast("System preferences saved!")
    
    // Theme toggle demonstration
    if (data.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (data.theme === "light") {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">System Preferences</CardTitle>
        <CardDescription className="text-xs">
          Change language formats, layout themes, and geographic timezone zones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={preferenceForm.handleSubmit(onSavePreferences)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Language select */}
            <div className="space-y-1.5">
              <Label htmlFor="language">Display Language</Label>
              <Select
                value={preferenceForm.watch("language")}
                onValueChange={(val) => preferenceForm.setValue("language", val)}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="es">Español (ES)</SelectItem>
                  <SelectItem value="fr">Français (FR)</SelectItem>
                  <SelectItem value="de">Deutsch (DE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Theme select */}
            <div className="space-y-1.5">
              <Label htmlFor="theme">Interface Theme</Label>
              <Select
                value={preferenceForm.watch("theme")}
                onValueChange={(val) => preferenceForm.setValue("theme", val)}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="system">System Preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timezone select */}
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Geographic Timezone</Label>
            <Select
              value={preferenceForm.watch("timezone")}
              onValueChange={(val) => preferenceForm.setValue("timezone", val)}
            >
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc-5">UTC-05:00 Eastern Standard Time</SelectItem>
                <SelectItem value="utc+0">UTC+00:00 Coordinated Universal Time</SelectItem>
                <SelectItem value="utc+1">UTC+01:00 Central European Time</SelectItem>
                <SelectItem value="utc+6">UTC+06:00 Bangladesh Standard Time</SelectItem>
                <SelectItem value="utc+8">UTC+08:00 Singapore Standard Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="font-semibold text-xs h-9 cursor-pointer">
              Save System Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PreferenceForm
