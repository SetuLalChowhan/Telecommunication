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
 * Cookie forwarding is handled once by the canonical server client.
 */
export async function getMyMedicalReportsServer(
  params?: MedicalReportsQueryParams,
  options?: ServerFetchOptions
): Promise<MedicalReportsResponse> {
  try {
    return await serverGetPage<MedicalReport>(
      `/medical-reports/my-reports${buildQueryString(params)}`,
      { ...CACHE.private.server, ...options }
    );
  } catch (error) {
    console.error("Failed to fetch medical reports on server:", error);
    return {
      data: [],
      meta: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0,
        totalPages: 1,
      },
    };
  }
}
