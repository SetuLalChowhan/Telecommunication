import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth/auth-client";

const MIN_PASSWORD_LENGTH = 8;

interface FieldErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/**
 * Password change goes through Better Auth's own endpoint (the same session
 * system the rest of the app uses), not a bespoke Nest route — so password
 * hashing, validation and session revocation stay in one place.
 */
export function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, setIsPending] = useState(false);

  const resetFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!currentPassword) next.currentPassword = "Current password is required.";
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      next.newPassword = `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (newPassword !== confirmPassword) {
      next.confirmPassword = "New passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsPending(true);
    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      });

      if (res.error) {
        const message = res.error.message || "Unable to update your password.";
        setErrors({ currentPassword: message });
        toast.error(message);
        return;
      }

      toast.success("Password updated successfully.");
      resetFields();
    } catch {
      toast.error("Unable to update your password. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Security &amp; access</CardTitle>
        <CardDescription className="text-xs">
          Change your password. Sessions are managed by Better Auth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {errors.currentPassword && (
              <p className="text-xs font-medium text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && (
                <p className="text-xs font-medium text-destructive">{errors.newPassword}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-start gap-3 pr-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground">
                  Sign out other devices
                </span>
                <p className="text-xs text-muted-foreground">
                  Revoke every other active session after changing your password.
                </p>
              </div>
            </div>
            <Switch checked={revokeOtherSessions} onCheckedChange={setRevokeOtherSessions} />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="h-9 cursor-pointer gap-1.5 text-xs font-semibold"
              disabled={isPending}
            >
              <KeyRound className="h-3.5 w-3.5" />
              {isPending ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default SecuritySection;
