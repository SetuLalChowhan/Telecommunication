import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

const notificationsSchema = z.object({
  emailAlerts: z.boolean(),
  pushAlerts: z.boolean(),
  weeklyDigest: z.boolean(),
  marketingEmails: z.boolean(),
})

type NotificationValues = z.infer<typeof notificationsSchema>

interface NotificationFormProps {
  triggerToast: (msg: string) => void
}

const NotificationForm: React.FC<NotificationFormProps> = ({ triggerToast }) => {
  const notificationForm = useForm<NotificationValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: { emailAlerts: true, pushAlerts: true, weeklyDigest: false, marketingEmails: false },
  })

  const onSaveNotifications = (data: NotificationValues) => {
    console.log("Saving notification data: ", data)
    triggerToast("Notification preferences updated!")
  }

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Notification Prefs</CardTitle>
        <CardDescription className="text-xs">
          Choose which alerts you want to receive across communication channels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={notificationForm.handleSubmit(onSaveNotifications)} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5 pr-4">
                <Label className="text-sm font-semibold">Email Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Receive notifications when system triggers exceptions via Email.
                </p>
              </div>
              <Switch
                checked={notificationForm.watch("emailAlerts")}
                onCheckedChange={(val) => notificationForm.setValue("emailAlerts", val)}
              />
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="space-y-0.5 pr-4">
                <Label className="text-sm font-semibold">Push Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Receive live notifications inside browser alerts.
                </p>
              </div>
              <Switch
                checked={notificationForm.watch("pushAlerts")}
                onCheckedChange={(val) => notificationForm.setValue("pushAlerts", val)}
              />
            </div>

            <div className="flex items-start space-x-3.5 pt-2">
              <Checkbox
                id="weeklyDigest"
                checked={notificationForm.watch("weeklyDigest")}
                onCheckedChange={(val) => notificationForm.setValue("weeklyDigest", !!val)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="weeklyDigest" className="text-sm font-semibold text-foreground cursor-pointer">
                  Weekly Analytics Digest
                </label>
                <p className="text-xs text-muted-foreground">
                  Receive an aggregate performance email summary every Monday.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 pt-2">
              <Checkbox
                id="marketingEmails"
                checked={notificationForm.watch("marketingEmails")}
                onCheckedChange={(val) => notificationForm.setValue("marketingEmails", !!val)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="marketingEmails" className="text-sm font-semibold text-foreground cursor-pointer">
                  Product Releases and Tips
                </label>
                <p className="text-xs text-muted-foreground">
                  Receive newsletters about updates and tutorials.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" className="font-semibold text-xs h-9 cursor-pointer">
              Save Notification Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default NotificationForm
