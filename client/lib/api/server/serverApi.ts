import { cookies } from "next/headers";

export interface ServerFetchOptions extends RequestInit {
  /** Revalidation interval in seconds for ISR (or false to disable) */
  revalidate?: number | false;
  /** Cache tags for on-demand ISR revalidation (revalidateTag) */
  tags?: string[];
  /** Whether to forward incoming user session cookies (default: true) */
  forwardCookies?: boolean;
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function serverFetch<T = any>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const {
    revalidate,
    tags,
    forwardCookies = true,
    headers: customHeaders,
    ...fetchOptions
  } = options;

  // 1. Extract cookies in Server Component context (Node.js runtime)
  let cookieHeader = "";
  if (forwardCookies) {
    try {
      const cookieStore = await cookies();
      cookieHeader = cookieStore.toString();
    } catch {
      // In build-time SSG contexts where no request exists, cookies() will safely catch
      cookieHeader = "";
    }
  }

  // 2. Build target URL
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseURL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  // 3. Configure Next.js ISR / Cache settings
  const nextConfig: { revalidate?: number | false; tags?: string[] } = {};
  if (typeof revalidate !== "undefined") {
    nextConfig.revalidate = revalidate;
  }
  if (tags && tags.length > 0) {
    nextConfig.tags = tags;
  }

  // 4. Perform fetch request
  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...customHeaders,
    },
    ...(Object.keys(nextConfig).length > 0 ? { next: nextConfig } : {}),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    const message = errorJson?.message || `Server request failed with HTTP ${res.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  const json = await res.json();
  // Unwrap NestJS TransformInterceptor { success, statusCode, message, data }
  if (json && typeof json === "object" && "data" in json) {
    return json.data as T;
  }
  return json as T;
}

export default serverFetch;
