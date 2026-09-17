import { serverFetch, ServerFetchOptions } from "@/lib/api/server-fetch";
import { cookies } from "next/headers";

import { SessionUser, ServerSessionResponse } from "../types";
export type { SessionUser, ServerSessionResponse };

/**
 * Fetch Better-Auth session from Server Component
 */
export async function getSessionServer(
  options?: ServerFetchOptions
): Promise<ServerSessionResponse | null> {
  try {
    let cookieHeader = "";
    try {
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch {}

    const res = await serverFetch<ServerSessionResponse>("/api/auth/get-session", {
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      ...options,
    });

    return res;
  } catch {
    return null;
  }
}
