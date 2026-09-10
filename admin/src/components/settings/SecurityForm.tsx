import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
    enable2FA: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  })

type SecurityValues = z.infer<typeof securitySchema>

interface SecurityFormProps {
  triggerToast: (msg: string) => void
}

const SecurityForm: React.FC<SecurityFormProps> = ({ triggerToast }) => {
  const securityForm = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "", enable2FA: true },
  })

  const onSaveSecurity = (data: SecurityValues) => {
    console.log("Saving security data: ", data)
    triggerToast("Security settings updated successfully!")
    securityForm.reset({ currentPassword: "", newPassword: "", confirmPassword: "", enable2FA: data.enable2FA })
  }

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Security Credentials</CardTitle>
        <CardDescription className="text-xs">
          Review authentication passwords and set up secondary security checkpoints.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={securityForm.handleSubmit(onSaveSecurity)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" placeholder="••••••••" {...securityForm.register("currentPassword")} />
            {securityForm.formState.errors.currentPassword && (
              <p className="text-xs text-destructive font-medium mt-1">
                {securityForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" placeholder="••••••••" {...securityForm.register("newPassword")} />
              {securityForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {securityForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" {...securityForm.register("confirmPassword")} />
              {securityForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {securityForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* 2FA Switch */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4 mt-6">
            <div className="space-y-0.5 pr-4">
              <span className="text-sm font-semibold text-foreground">Two-Factor Authentication</span>
              <p className="text-xs text-muted-foreground">
                Require an auth security code on each login attempt.
              </p>
            </div>
            <Switch
              checked={securityForm.watch("enable2FA")}
              onCheckedChange={(val) => securityForm.setValue("enable2FA", val)}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" className="font-semibold text-xs h-9 cursor-pointer">
              Update Password & 2FA
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SecurityForm
