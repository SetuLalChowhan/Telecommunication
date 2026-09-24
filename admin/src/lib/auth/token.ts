/**
 * The single place the admin app stores its Better Auth session token.
 *
 * The token is the same Better Auth session token the server issues in the
 * session cookie; the admin SPA sends it as `Authorization: Bearer <token>`
 * (see the server `bearer()` plugin). It is never decoded for authorization —
 * the NestJS RolesGuard stays authoritative.
 */
const TOKEN_KEY = "telemed.admin.bearer_token";

let inMemoryToken: string | null = null;

export function getAuthToken(): string | null {
  if (inMemoryToken !== null) {
    return inMemoryToken;
  }
  try {
    inMemoryToken = window.localStorage.getItem(TOKEN_KEY);
  } catch {
    inMemoryToken = null;
  }
  return inMemoryToken;
}

export function setAuthToken(token: string | null): void {
  inMemoryToken = token;
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode / SSR). In-memory value still works.
  }
}

export function clearAuthToken(): void {
  setAuthToken(null);
}
