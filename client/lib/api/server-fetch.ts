import "server-only";
import { cookies } from "next/headers";

export type ServerFetchOptions = RequestInit & {
  revalidate?: number;
  tags?: string[];
  timeoutMs?: number;
};

/**
 * Helper to serialize ReadonlyRequestCookies into a valid HTTP Cookie header string
 */
export async function getSerializedCookies(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
  } catch {
    return "";
  }
}

/**
 * Server-Side Fetch Utility for Next.js Server Components.
 * Automatically injects authentication cookies and provides fail-safe timeouts.
 */
export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { revalidate, tags, timeoutMs = 8000, ...fetchOptions } = options;
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const cookieHeader = await getSerializedCookies();

  const nextOptions: { revalidate?: number; tags?: string[] } = {};
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;
  if (tags !== undefined) nextOptions.tags = tags;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers = new Headers(fetchOptions.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (cookieHeader && !headers.has("cookie")) {
      headers.set("cookie", cookieHeader);
    }

    const response = await fetch(`${baseUrl}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
      ...(Object.keys(nextOptions).length > 0
        ? {
            next: nextOptions,
          }
        : {}),
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      const message =
        errorBody?.message ||
        `API request failed: ${response.status} ${response.statusText}`;
      throw new Error(Array.isArray(message) ? message.join(", ") : message);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

export default serverFetch;
