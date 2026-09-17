export type ServerFetchOptions = RequestInit & {
  revalidate?: number;
  tags?: string[];
};

/**
 * Server-Side Fetch Utility for Next.js Server Components.
 */
export async function serverFetch<T>(
  endpoint: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { revalidate, tags, ...fetchOptions } = options;
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000";

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const nextOptions: { revalidate?: number; tags?: string[] } = {};
  if (revalidate !== undefined) nextOptions.revalidate = revalidate;
  if (tags !== undefined) nextOptions.tags = tags;

  const response = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...(Object.keys(nextOptions).length > 0
      ? {
          next: nextOptions,
        }
      : {}),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.message ||
      `API request failed: ${response.status} ${response.statusText}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return response.json();
}

export default serverFetch;
