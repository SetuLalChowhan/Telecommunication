import { serverFetch, ServerFetchOptions } from "@/lib/api/server-fetch";
import { cookies } from "next/headers";
import {
  MedicalReportsQueryParams,
  MedicalReportsResponse,
} from "../types";

/**
 * Server-Side fetcher for patient's medical reports
 */
export async function getMyMedicalReportsServer(
  params?: MedicalReportsQueryParams,
  options?: ServerFetchOptions
): Promise<MedicalReportsResponse> {
  try {
    let cookieHeader = "";
    try {
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch {}

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set("page", String(params.page));
    if (params?.limit) queryParams.set("limit", String(params.limit));

    const queryStr = queryParams.toString();
    const endpoint = queryStr
      ? `/medical-reports/my-reports?${queryStr}`
      : "/medical-reports/my-reports";

    const response = await serverFetch<MedicalReportsResponse>(endpoint, {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: "no-store",
      ...options,
    });

    return {
      data: response.data || [],
      meta: response.meta || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: response.data?.length || 0,
        totalPages: 1,
      },
    };
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
