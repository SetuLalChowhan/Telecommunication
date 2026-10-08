import { Link } from "react-router-dom";
import { CalendarDays, Stethoscope, UserRoundCheck, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";

const QUICK_LINKS = [
  {
    to: "/dashboard/doctors",
    title: "Doctors",
    description: "Review registrations and verify credentials.",
    icon: <Stethoscope className="h-4 w-4" />,
  },
  {
    to: "/dashboard/patients",
    title: "Patients",
    description: "Browse and manage patient accounts.",
    icon: <UserRoundCheck className="h-4 w-4" />,
  },
  {
    to: "/dashboard/appointments",
    title: "Appointments",
    description: "Oversee consultations and their status.",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    to: "/dashboard/reviews",
    title: "Reviews",
    description: "Moderate patient feedback.",
    icon: <Star className="h-4 w-4" />,
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-normal tracking-[-0.03em] text-foreground">
          Platform <span className="text-[#97cde5]">Overview</span>
        </h2>
        <p className="text-sm text-secondary-text mt-1">
          Live operational clinical metrics and management portals.
        </p>
      </div>

      {/* Real counters from /admin/dashboard/metrics — no static figures. */}
      <DashboardStats />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Card key={link.to} className="border border-border bg-card rounded-2xl transition-colors hover:border-[#cbcbcb]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium tracking-tight">{link.title}</CardTitle>
              <span className="text-muted-foreground">{link.icon}</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-xs text-secondary-text">{link.description}</CardDescription>
              <Button asChild variant="outline" size="sm" className="h-8 rounded-full text-xs font-normal cursor-pointer">
                <Link to={link.to}>Open portal</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
