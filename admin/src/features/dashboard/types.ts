/**
 * Metrics returned by `GET /admin/dashboard/metrics`.
 * Mirrors `AdminService.getDashboardMetrics` exactly.
 */
export interface DashboardMetrics {
  totalUsers: number;
  totalDoctors: number;
  verifiedDoctors: number;
  pendingDoctors: number;
  totalPatients: number;
  totalSpecialties: number;
  totalBookings: number;
  todayBookings: number;
}

export const dashboardKeys = {
  all: ["admin", "dashboard"] as const,
  metrics: () => [...dashboardKeys.all, "metrics"] as const,
};
