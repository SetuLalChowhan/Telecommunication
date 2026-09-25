import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyTheme } from "@/lib/theme";
import { useUpdateSettings } from "../api/settings.queries";
import {
  LANGUAGE_OPTIONS,
  THEME_OPTIONS,
  TIMEZONE_OPTIONS,
  type UserSettings,
} from "../types";

/** Mounted with `key={settings.updatedAt}` so saved values re-seed the fields. */
function PreferencesForm({ settings }: { settings: UserSettings }) {
  const updateSettings = useUpdateSettings();
  const [language, setLanguage] = useState(settings.language);
  const [theme, setTheme] = useState(settings.theme);
  const [timezone, setTimezone] = useState(settings.timezone);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    updateSettings.mutate(
      { language, theme, timezone },
      {
        onSuccess: (saved) => {
          // Apply the theme immediately so the change is visible without reload.
          applyTheme(saved.theme);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Display language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Interface theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              {THEME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Timezone</Label>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Used to display appointment times across the dashboard.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          className="h-9 cursor-pointer gap-1.5 text-xs font-semibold"
          disabled={updateSettings.isPending}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          {updateSettings.isPending ? "Saving…" : "Save preferences"}
        </Button>
      </div>
    </form>
  );
}

export function PreferencesSection({ settings }: { settings: UserSettings }) {
  return (
    <Card className="border border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold">System preferences</CardTitle>
        <CardDescription className="text-xs">
          Language, theme and timezone. Stored on the server against your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PreferencesForm key={settings.updatedAt} settings={settings} />
      </CardContent>
    </Card>
  );
}

export default PreferencesSection;
