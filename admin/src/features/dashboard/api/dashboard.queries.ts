import { queryOptions, useQuery } from "@tanstack/react-query";
import { CACHE } from "@/lib/query/policy";
import { dashboardKeys } from "../types";
import { getDashboardMetrics } from "./dashboard.api";

export const dashboardMetricsQueryOptions = () =>
  queryOptions({
    queryKey: dashboardKeys.metrics(),
    queryFn: getDashboardMetrics,
    staleTime: CACHE.dashboard.staleTime,
  });

export function useDashboardMetrics() {
  return useQuery(dashboardMetricsQueryOptions());
}
