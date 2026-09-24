import { buildQueryString, serverGetPage, ServerFetchOptions } from "@/lib/api/server";
import { CACHE } from "@/lib/cache/policy";
import {
  MedicalReport,
  MedicalReportsQueryParams,
  MedicalReportsResponse,
} from "../types";

/**
 * Server-side fetcher for the patient's medical reports.
 *
 * Cookie forwarding is handled once by the canonical server client, and a
 * backend outage propagates to the route error boundary rather than rendering
 * as "no reports".
 */
export async function getMyMedicalReportsServer(
  params?: MedicalReportsQueryParams,
  options?: ServerFetchOptions
): Promise<MedicalReportsResponse> {
  return serverGetPage<MedicalReport>(
    `/medical-reports/my-reports${buildQueryString(params)}`,
    { ...CACHE.private.server, ...options }
  );
}
