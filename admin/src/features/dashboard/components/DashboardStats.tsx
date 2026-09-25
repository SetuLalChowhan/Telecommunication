import type { ReactNode } from "react";
import {
  Activity,
  CalendarCheck,
  CalendarClock,
  Layers,
  Stethoscope,
  ShieldCheck,
  Users,
  UserRoundCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/States";
import { useDashboardMetrics } from "../api/dashboard.queries";
import type { DashboardMetrics } from "../types";

interface StatDefinition {
  key: keyof DashboardMetrics;
  title: string;
  icon: ReactNode;
  accent?: string;
}

const STATS: StatDefinition[] = [
  { key: "totalUsers", title: "Total Users", icon: <Users className="h-4 w-4" />, accent: "text-primary" },
  { key: "totalDoctors", title: "Doctors", icon: <Stethoscope className="h-4 w-4" />, accent: "text-primary" },
  { key: "verifiedDoctors", title: "Verified Doctors", icon: <ShieldCheck className="h-4 w-4" />, accent: "text-emerald-600" },
  { key: "pendingDoctors", title: "Pending Verification", icon: <CalendarClock className="h-4 w-4" />, accent: "text-amber-600" },
  { key: "totalPatients", title: "Patients", icon: <UserRoundCheck className="h-4 w-4" />, accent: "text-primary" },
  { key: "totalSpecialties", title: "Specialties", icon: <Layers className="h-4 w-4" />, accent: "text-primary" },
  { key: "totalBookings", title: "Total Bookings", icon: <CalendarCheck className="h-4 w-4" />, accent: "text-primary" },
  { key: "todayBookings", title: "Today's Bookings", icon: <Activity className="h-4 w-4" />, accent: "text-blue-600" },
];

function StatCard({ title, value, icon, accent }: { title: string; value: number; icon: ReactNode; accent?: string }) {
  return (
    <Card className="border border-border/70 shadow-sm transition-colors hover:border-primary/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <span className={accent ?? "text-muted-foreground"}>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Live platform counters. Every value comes from `/admin/dashboard/metrics` —
 * there are no hardcoded figures here.
 */
export function DashboardStats() {
  const { data, isPending, isError, error, refetch } = useDashboardMetrics();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} title="Unable to load metrics" />;
  }

  if (isPending || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[104px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <StatCard
          key={stat.key}
          title={stat.title}
          value={data[stat.key]}
          icon={stat.icon}
          accent={stat.accent}
        />
      ))}
    </div>
  );
}

export default DashboardStats;
