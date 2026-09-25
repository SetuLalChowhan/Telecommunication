import { http } from "@/lib/api/client";
import type { DashboardMetrics } from "../types";

/**
 * GET /admin/dashboard/metrics
 * Returns platform-wide counts for the operations dashboard.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return http.get<DashboardMetrics>("/admin/dashboard/metrics");
}
