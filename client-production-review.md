# Telemedicine Project — Client Production Readiness Review

**Review scope:** `client/` (Next.js) and `admin/` (Vite/React) from the supplied archive. This is a source-level static review; no live API, browser, accessibility, or deployed-environment test was run. Use this as a prioritized remediation document, then verify each item with automated tests.

## Executive summary

The project separates the patient/doctor-facing Next.js app from the admin SPA. Keep that separation if it matches deployment and team needs, but standardize API contracts, authentication handling, loading/error states, and shared UI behavior. Client-side checks are for user experience only; all permissions must be enforced by the server.

## 1. P0/P1 client risks

| Priority | Area | Required action |
|---|---|---|
| P0 | Auth/session | Ensure no session, bearer token, Google token, or sensitive patient data is stored in `localStorage` unless a deliberate threat model justifies it. Prefer secure, HttpOnly, SameSite cookies for browser sessions. |
| P0 | Route protection | Patient/doctor/admin route guards are UX, not authorization. Handle expired sessions and role mismatch centrally; server must authorize every API request. |
| P0 | Medical reports | Do not expose persistent public report URLs, cache report data in shared query caches, or log sensitive data. Use authenticated, short-lived access and no-store behavior. |
| P1 | API client | Centralize base URL, credentials, timeout, error parsing, request IDs and auth-expiry handling. Avoid duplicated ad-hoc fetch/axios logic and inconsistent response unwrapping. |
| P1 | Server/client boundaries | Keep secrets and privileged API calls in Next server-only modules. Never prefix secrets with `NEXT_PUBLIC_`. Do not import server-only modules into client components. |
| P1 | Query/cache | Use TanStack Query consistently for client-owned interactive data; invalidate narrowly after mutations. Do not persist/cache reports, auth responses, or sensitive profiles without an explicit policy. |
| P1 | Forms | Validate on the client for usability, but rely on server DTO validation. Prevent duplicate submissions, show field-level errors, and handle server validation errors. |
| P1 | UX states | Every API-driven screen needs loading, empty, error, retry, permission-denied and stale-data states. Avoid blank screens and swallowed errors. |
| P1 | Admin SPA | Check every admin route and API action against role, handle token refresh/expiry, and ensure deployment fallback does not expose secrets or break deep links. |
| P2 | Maintainability | Reduce duplicated API wrappers, oversized components, `any`, broad catch-and-ignore, hardcoded strings, and one-off loading/toast logic. |

## 2. Authentication and session handling

### Patient/doctor Next.js app
- Establish one documented auth model. If Better Auth uses cookies, configure same-origin/proxy behavior and `credentials: 'include'` as required; do not also invent a parallel token store.
- Server components should read the session using a server-only auth helper and make protected decisions before rendering where practical.
- Client route guards may redirect for UX, but protected API data must never be trusted merely because a route is hidden.
- Handle 401 (session missing/expired) and 403 (authenticated but not authorized) differently.
- Avoid putting session tokens in URLs, query strings, logs, analytics, error messages, or persisted query caches.
- Ensure sign-out clears client query state and user-specific in-memory state; prevent the previous user's data appearing after account switching.
- Use explicit role-aware navigation based on the authenticated server response, not a user-editable local value.

### Admin Vite app
- Verify how Better Auth bearer plugin token is received and stored. A bearer token in localStorage is exposed to any successful XSS; prefer secure cookies or a carefully documented short-lived in-memory token flow where supported.
- Never print tokens to console or include them in crash reports.
- On 401, clear user state and return to login; on 403, show a permission screen rather than retrying forever.
- Enforce admin authorization on every server endpoint, regardless of hidden buttons or protected routes.

## 3. API integration architecture

Use a small, predictable layout; avoid creating layers that only forward arguments.

### Suggested Next.js structure

```text
src/
  lib/
    api/
      server.ts       # server-only fetch, cookies/session, no-store defaults for private data
      client.ts       # browser fetch/axios instance, credentials, timeout, normalized errors
      errors.ts       # ApiError + safe message extraction
      routes.ts       # endpoint constants only when they add real value
    auth/
      server-session.ts
      permissions.ts  # UI capability helpers; not security enforcement
  features/
    appointments/
      api.ts          # feature endpoints
      queries.ts      # query keys + queryOptions
      mutations.ts
      types.ts
      components/
    doctors/
    patient/
    reports/
    notifications/
  components/
    ui/
    shared/
```

**Rules**
1. One API client per runtime (server/browser); no direct `fetch` scattered through components.
2. Server-only API calls should use `import 'server-only'` and never leak secrets to client bundles.
3. Normalize API errors once. Preserve HTTP status and validation field errors; do not return raw backend stack/provider messages to users.
4. Keep endpoint functions thin and typed. Avoid wrappers that simply rename `fetch`.
5. Do not automatically retry non-idempotent POST requests. Retry safe GETs selectively; use idempotency keys for booking and other retry-sensitive mutations.
6. Do not set `Content-Type: application/json` for `FormData`; allow the browser to set the multipart boundary.
7. Keep API response types aligned with the actual server response envelope. Do not use broad `as` casts to silence mismatches.

## 4. Next.js rendering, caching and hydration

- Use Server Components by default for static/layout composition and initial public data; use Client Components only for browser interaction, stateful forms, charts, and interactive widgets.
- Public doctor directory/blog/CMS content may use controlled revalidation if the data is genuinely public and the server supports it.
- Patient profile, appointments, notifications, doctor dashboard, reports and any personalized data should be private and use `no-store` or user-scoped cache keys with carefully verified isolation.
- Never use a shared server cache for data that varies by session unless the cache key and isolation are explicitly correct.
- For TanStack Query hydration, create a new `QueryClient` per server request, prefetch only appropriate data, dehydrate, and hydrate on the client. Do not use a module-global server QueryClient.
- Use stable query keys with all meaningful filters, page, date range and authenticated identity scope. Clear or invalidate user-scoped queries on logout/account switch.
- Avoid double-fetching the same data in a Server Component and `useQuery` without passing dehydrated state.
- Set sensible stale times for public reference data; do not use long stale times for appointment availability or booking status without a product-approved freshness model.
- Treat availability as advisory. The booking API remains authoritative and must return a clear conflict response when a slot is taken.

## 5. Booking, calendar and timezone UX

- Display the doctor's timezone and the patient's local timezone where relevant; send ISO timestamps with timezone/offset or canonical UTC instants to the API.
- Do not build dates by concatenating locale-formatted strings. Use a single date/time utility and explicit timezone conversion.
- Refresh availability after booking, cancellation, rescheduling and conflict responses.
- Disable submit while a request is pending, but also use server idempotency/concurrency controls.
- Show clear conflict, expired slot, Google Calendar disconnected, and calendar-sync-pending states.
- Do not imply a meeting is scheduled until the backend confirms the booking/calendar result according to its defined workflow.
- Avoid relying on browser system timezone for doctor schedule editing; expose the doctor's configured timezone.

## 6. Medical reports and privacy on the client

- Do not put report content or private signed URLs in localStorage, sessionStorage, IndexedDB, analytics, error trackers, or persistent TanStack Query storage.
- Use authenticated report endpoints or short-lived signed URLs. Avoid rendering untrusted HTML/SVG; use safe PDF/image viewers and appropriate sandboxing.
- Set sensitive pages to avoid browser/shared caching where supported. Do not prefetch reports.
- Revoke object URLs created for local previews when components unmount.
- Show upload progress, accepted file types/size, server validation errors, and retry states.
- Do not use filenames as trusted HTML. Render them as text and sanitize for download headers on the server.
- Ensure report lists are cleared when user logs out or changes accounts.

## 7. Forms, errors and UI quality

For all forms (signup, profile, availability, booking, reports, CMS/blog):
- Use a consistent form library and schema approach; avoid duplicated hand-written validation across components.
- Keep client validation concise and aligned with server DTO rules. Server remains authoritative.
- Map server field errors to fields; show a safe general error for unexpected failures.
- Prevent duplicate submits and preserve entered values after recoverable errors.
- Confirm destructive actions and provide pending/success/failure states.
- Use accessible labels, keyboard navigation, focus management, dialog semantics and visible focus states.
- Avoid toast-only errors for critical workflows; show inline persistent errors for booking/upload/auth.
- Format currency, dates and phone numbers consistently, with locale/timezone explicit.

## 8. Admin SPA review checklist

- Centralize API origin and auth handling in one client module.
- Ensure Vite environment variables are public by design; anything prefixed `VITE_` is bundled into the browser and must not contain secrets.
- Protect nested routes with a common layout guard, but still handle server 401/403 responses.
- Keep admin-only navigation and controls role-aware; never treat this as a security boundary.
- For tables, implement server-side pagination/filter/sort for large datasets; whitelist sort keys server-side.
- Provide confirmation and audit context for doctor verification/rejection, CMS changes and destructive actions.
- Handle empty/loading/error states in every dashboard card and chart; charts should not block core admin workflows.
- Configure SPA fallback for deep links and cache static assets immutably while keeping HTML/API responses appropriately uncached.
- Add a production build check and test deployed deep links, refresh, logout, and API CORS/cookie behavior.

## 9. Performance and maintainability

- Split feature screens by domain and keep reusable components generic only when two or more real use cases justify it.
- Lazy-load heavy charts, calendar widgets, rich text editors and PDF viewers.
- Use `next/image` for optimized public images; avoid optimizing private report URLs through public image services.
- Prevent unnecessary client-side global state. Use URL search params for shareable filters; query cache for server state; local component state for ephemeral UI.
- Avoid duplicating server state in Redux/Zustand and TanStack Query.
- Add error boundaries at route/feature boundaries and a not-found page for invalid doctor slugs or resources.
- Audit dependencies and bundle size; remove unused packages, demo assets and template code.
- Add loading skeletons only where they improve perceived performance; avoid layout shifts with fixed dimensions.

## 10. Client testing and release gates

- [ ] Typecheck, lint and production build pass for both `client/` and `admin/`.
- [ ] Auth tests cover logged-out, expired session, role mismatch, logout and account switching.
- [ ] API tests cover 400 validation, 401, 403, 404, 409 booking conflict, 429 and 500.
- [ ] E2E tests cover patient booking, cancellation, doctor availability, report upload/view, admin doctor verification and CMS publishing.
- [ ] Verify report URLs/tokens do not appear in browser storage, analytics, console or error reporting.
- [ ] Test responsive layouts, keyboard navigation, focus handling and screen-reader labels.
- [ ] Test slow network, offline/retry, double-click submit and stale availability.
- [ ] Verify production environment variables contain no secrets in client bundles.
- [ ] Verify direct navigation and page refresh for every admin and Next.js protected route.
- [ ] Confirm logout clears all user-specific client caches and state.

## Recommended implementation order

1. Close backend auth/authorization and report privacy issues first; the client cannot compensate for server weaknesses.
2. Establish a single auth/session strategy for Next and admin.
3. Consolidate API clients and normalized error handling.
4. Fix private-data caching and query hydration rules.
5. Add booking/report/admin E2E coverage.
6. Optimize components, bundle size and visual polish after correctness/security gates pass.

**Bottom line:** Keep the client thin and predictable. The browser should handle presentation and interaction; the server must remain authoritative for identity, roles, booking availability, medical-record access, and all sensitive operations.
