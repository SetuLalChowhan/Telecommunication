import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Lock, Settings as SettingsIcon, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/States";
import { ProfileSection } from "@/features/settings/components/ProfileSection";
import { SecuritySection } from "@/features/settings/components/SecuritySection";
import { PreferencesSection } from "@/features/settings/components/PreferencesSection";
import { NotificationsSection } from "@/features/settings/components/NotificationsSection";
import { useSettings } from "@/features/settings/api/settings.queries";
import { applyTheme } from "@/lib/theme";

const VALID_TABS = ["profile", "security", "notifications", "preferences"] as const;
type SettingsTab = (typeof VALID_TABS)[number];

const TAB_ITEMS: Array<{ value: SettingsTab; label: string; icon: React.ReactNode }> = [
  { value: "profile", label: "Profile details", icon: <User className="h-4 w-4 shrink-0" /> },
  { value: "security", label: "Security & access", icon: <Lock className="h-4 w-4 shrink-0" /> },
  { value: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4 shrink-0" /> },
  { value: "preferences", label: "Preferences", icon: <SettingsIcon className="h-4 w-4 shrink-0" /> },
];

/** Renders a loader / error around a section that needs server settings. */
function SettingsBoundary({
  children,
}: {
  children: (settings: NonNullable<ReturnType<typeof useSettings>["data"]>) => React.ReactNode;
}) {
  const { data, isPending, isError, error, refetch } = useSettings();

  if (isError) {
    return (
      <Card className="border border-border/70 shadow-sm">
        <CardContent className="pt-6">
          <ErrorState error={error} onRetry={() => refetch()} title="Unable to load settings" />
        </CardContent>
      </Card>
    );
  }

  if (isPending || !data) {
    return (
      <Card className="border border-border/70 shadow-sm">
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-32 self-end" />
        </CardContent>
      </Card>
    );
  }

  return <>{children(data)}</>;
}

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const segment = location.pathname.split("/").pop() ?? "profile";
  const activeTab: SettingsTab = (VALID_TABS as readonly string[]).includes(segment)
    ? (segment as SettingsTab)
    : "profile";

  // Apply the stored theme globally (DOM-only side effect).
  const { data: settings } = useSettings();
  useEffect(() => {
    if (settings) applyTheme(settings.theme);
  }, [settings]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account profile, security, notifications and interface preferences.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => navigate(`/dashboard/settings/${value}`)}
        className="flex w-full flex-col gap-6 md:flex-row"
      >
        <TabsList className="flex h-auto shrink-0 flex-row items-stretch justify-start gap-1.5 overflow-x-auto rounded-xl border border-border bg-muted/30 p-2 md:w-64 md:flex-col">
          {TAB_ITEMS.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className="cursor-pointer items-center justify-start gap-3 rounded-lg border border-transparent px-3.5 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground data-[state=active]:border-border/70 data-[state=active]:bg-card data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-sm [&_svg]:shrink-0"
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1">
          <TabsContent value="profile" className="m-0">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="security" className="m-0">
            <SecuritySection />
          </TabsContent>

          <TabsContent value="notifications" className="m-0">
            <SettingsBoundary>{(data) => <NotificationsSection settings={data} />}</SettingsBoundary>
          </TabsContent>

          <TabsContent value="preferences" className="m-0">
            <SettingsBoundary>{(data) => <PreferencesSection settings={data} />}</SettingsBoundary>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
