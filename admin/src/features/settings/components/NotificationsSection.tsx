import { useState } from "react";
import { BellRing } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateSettings } from "../api/settings.queries";
import type { UserSettings } from "../types";

/** Mounted with `key={settings.updatedAt}` so saved values re-seed the toggles. */
function NotificationsForm({ settings }: { settings: UserSettings }) {
  const updateSettings = useUpdateSettings();
  const [emailAlerts, setEmailAlerts] = useState(settings.emailAlerts);
  const [pushAlerts, setPushAlerts] = useState(settings.pushAlerts);
  const [weeklyDigest, setWeeklyDigest] = useState(settings.weeklyDigest);
  const [marketingEmails, setMarketingEmails] = useState(settings.marketingEmails);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateSettings.mutate({ emailAlerts, pushAlerts, weeklyDigest, marketingEmails });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-0.5 pr-4">
          <Label className="text-sm font-semibold">Email alerts</Label>
          <p className="text-xs text-muted-foreground">
            Receive an email when the platform raises an exception.
          </p>
        </div>
        <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
      </div>

      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-0.5 pr-4">
          <Label className="text-sm font-semibold">Push alerts</Label>
          <p className="text-xs text-muted-foreground">
            Receive live notifications inside the dashboard.
          </p>
        </div>
        <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
      </div>

      <div className="flex items-start gap-3.5">
        <Checkbox
          id="weekly-digest"
          checked={weeklyDigest}
          onCheckedChange={(value) => setWeeklyDigest(Boolean(value))}
        />
        <div className="grid gap-1 leading-none">
          <label htmlFor="weekly-digest" className="cursor-pointer text-sm font-semibold text-foreground">
            Weekly analytics digest
          </label>
          <p className="text-xs text-muted-foreground">
            An aggregate performance summary every Monday.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3.5">
        <Checkbox
          id="marketing-emails"
          checked={marketingEmails}
          onCheckedChange={(value) => setMarketingEmails(Boolean(value))}
        />
        <div className="grid gap-1 leading-none">
          <label htmlFor="marketing-emails" className="cursor-pointer text-sm font-semibold text-foreground">
            Product updates and tips
          </label>
          <p className="text-xs text-muted-foreground">
            Occasional newsletters about updates and tutorials.
          </p>
        </div>
      </div>

      <div className="flex justify-end border-t pt-4">
        <Button
          type="submit"
          className="h-9 cursor-pointer gap-1.5 text-xs font-semibold"
          disabled={updateSettings.isPending}
        >
          <BellRing className="h-3.5 w-3.5" />
          {updateSettings.isPending ? "Saving…" : "Save notifications"}
        </Button>
      </div>
    </form>
  );
}

export function NotificationsSection({ settings }: { settings: UserSettings }) {
  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">Notification preferences</CardTitle>
        <CardDescription className="text-xs">
          Choose which alerts you receive. Stored on the server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationsForm key={settings.updatedAt} settings={settings} />
      </CardContent>
    </Card>
  );
}

export default NotificationsSection;
