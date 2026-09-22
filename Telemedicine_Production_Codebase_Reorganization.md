# Telemedicine Codebase --- Production Reorganization & Scalability Plan

**Repository reviewed:** `Telecommunication-main`\
**Reviewed:** 22 September 2026\
**Scope:** `client/` (Next.js 16), `server/` (NestJS 12 + Prisma),
`admin/` (Vite React), shared API contracts, caching, SSR/ISR/CSR,
hydration, validation, error handling, performance, security, and
repository hygiene.

------------------------------------------------------------------------

## 1. Executive Summary

The codebase is functional and already contains several good production
ideas:

-   Next.js App Router
-   TanStack Query v5
-   server-side prefetch + `HydrationBoundary`
-   NestJS modules
-   Prisma repositories
-   global validation
-   centralized exception formatting
-   request IDs
-   throttling
-   Swagger
-   feature-oriented frontend folders
-   characterization tests for some risky business logic

The main problem is **duplication and competing patterns**, not lack of
libraries.

The client currently has multiple HTTP abstractions:

``` text
features/*/api/client.ts
        ↓
lib/api/axios.ts

lib/http/client.ts
        ↓
axiosInstance

lib/api/server-fetch.ts

lib/http/server.ts
```

The result is repeated response unwrapping, repeated query-string
construction, repeated server cookie forwarding, repeated error
normalization, repeated fallback handling, and inconsistent caching.

The same issue exists at the hook level:

``` text
useDoctors(...)
useDoctorDetails(...)
useDoctorAvailability(...)
useMyDoctorProfile(...)
...
```

with many hooks grouped into very large files.

The server has the opposite problem: the API is already reasonably
modular, but several services are too large and mix orchestration,
persistence, business rules, external integrations, and formatting.

### Target principle

> **One responsibility, one canonical path, one source of truth.**

The target architecture should be:

``` text
Next.js Route
    ↓
Feature Screen
    ↓
Feature Hook
    ↓
Feature API function
    ↓
One HTTP client
    ↓
NestJS Controller
    ↓
Use-case Service
    ↓
Repository
    ↓
Prisma
```

For public read-heavy pages:

``` text
Next Server Component
    ↓
Cached server data function
    ↓
Nest API
    ↓
HydrationBoundary
    ↓
Client component + TanStack Query
```

For authenticated/private pages:

``` text
Next Server Component
    ↓
Request-time server fetch with cookies
    ↓
HydrationBoundary
    ↓
TanStack Query client cache
```

**Do not cache authenticated user-specific data in a shared Next.js
cache.**

------------------------------------------------------------------------

# 2. Current Repository Shape

## Applications

``` text
Telecommunication-main/
├── client/       # Next.js 16 frontend
├── server/       # NestJS 12 API
├── admin/        # Vite React admin application
├── docs/
└── scripts/
```

Approximate source inventory:

  Area        Files
  --------- -------
  Client        335
  Server        162
  Admin          77
  Docs            9
  Scripts         1

The repository is large enough that architectural consistency matters
more than adding more abstractions.

------------------------------------------------------------------------

# 3. Most Important Problems Found

## P0 --- Duplicate HTTP layers

### Current

``` text
lib/api/axios.ts
lib/http/client.ts
lib/http/server.ts
lib/api/server-fetch.ts
```

Both `apiClient` and `axiosInstance` perform similar work.

Both server fetch utilities:

-   forward cookies
-   build URLs
-   parse API envelopes
-   convert errors
-   support server requests

### Target

Delete the duplicate abstraction.

Use:

``` text
features/<feature>/api/client.ts
features/<feature>/api/server.ts
lib/api/client.ts
lib/api/server.ts
lib/api/error.ts
lib/api/types.ts
```

There should be exactly:

-   one browser HTTP client
-   one server HTTP client
-   one error type
-   one response contract

------------------------------------------------------------------------

# 4. P0 --- API Response Normalization Is Too Defensive

There are many patterns like:

``` ts
response.data?.data ?? response.data
```

and:

``` ts
if (Array.isArray(body)) ...
else if (body && typeof body === "object" && "data" in body) ...
else if (...)
```

and:

``` ts
const body = response.data;

const data = Array.isArray(body?.data)
  ? body.data
  : Array.isArray(body)
  ? body
  : [];
```

This is usually a sign that the frontend does not trust its backend
contract.

## Target

Define one API envelope:

``` ts
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
  timestamp: string;
}
```

Error:

``` ts
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}
```

Then the HTTP client unwraps the envelope once.

Feature API functions receive:

``` ts
Doctor[]
```

instead of:

``` ts
ApiResponse<Doctor[]>
```

No feature should manually inspect `success`, `data`, `meta`, or
alternative response shapes.

------------------------------------------------------------------------

# 5. P0 --- Client API Integration Is Too Large

Current examples:

``` text
client/features/doctors/api/client.ts     ~334 lines
client/features/doctors/api/queries.ts    ~443 lines
client/features/doctors/api/server.ts     ~329 lines
client/features/auth/api/queries.ts       ~319 lines
```

These files are doing too many jobs.

## Target

Example:

``` text
features/doctors/
├── api/
│   ├── doctors.client.ts
│   ├── doctors.server.ts
│   └── doctors.keys.ts
├── hooks/
│   ├── use-doctors.ts
│   ├── use-doctor.ts
│   ├── use-doctor-availability.ts
│   ├── use-my-doctor.ts
│   └── use-doctor-mutations.ts
├── types.ts
└── components/
```

Do not create a file for every two-line function just for the sake of
file count. Split by **resource responsibility**, not by arbitrary size.

------------------------------------------------------------------------

# 6. P0 --- Auth Has Two Sources of Truth

The client currently has:

``` text
Better Auth cookie/session
        +
Redux persisted auth state
```

The Better Auth session should be the authoritative authentication
state.

Redux should not persist an authentication token that duplicates the
HTTP-only session.

## Target

``` text
Better Auth
    ↓
session
    ↓
useSession()
    ↓
role / user
```

Redux should only remain if there is a real client-only state
requirement.

Do not store sensitive session credentials in localStorage.

------------------------------------------------------------------------

# 7. P0 --- Hardcoded OAuth Credential

`client/components/providers.tsx` contains a real Google client ID
fallback.

That must be removed.

Current pattern:

``` ts
const googleClientId =
  env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  'real-client-id';
```

Target:

``` ts
const googleClientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is required');
}
```

Development can use `.env.local`.

Production uses deployment environment variables.

Never put a real secret or credential fallback into source.

------------------------------------------------------------------------

# 8. P1 --- Server Fetchers Swallow Errors

Several server functions do this:

``` ts
try {
  ...
} catch {
  return [];
}
```

or:

``` ts
catch {
  return null;
}
```

This makes backend outages look like empty data.

That is dangerous because:

``` text
API DOWN
   ↓
[]
   ↓
"no doctors found"
```

The user cannot distinguish a real empty state from a server failure.

## Target

Server fetchers should normally throw `ApiError`.

Then:

``` text
page.tsx
   ↓
error.tsx
```

handles the failure.

Only optional content should have fallback behavior.

Example:

``` text
Critical doctor profile → throw
Critical blog article → notFound()
Optional CMS decoration → fallback defaults
```

------------------------------------------------------------------------

# 9. P1 --- Caching Is Inconsistent

Current server code mixes:

``` ts
revalidate
cache: "no-store"
```

with custom server fetch wrappers.

Some public resources are cached.

Some private resources are explicitly uncached.

This is directionally correct, but the policy is not centralized.

## Target Cache Policy

### Public static content

  Resource          Strategy
  ----------------- ----------
  CMS sections      cached
  specialties       cached
  public doctors    cached
  doctor detail     cached
  published blogs   cached
  blog detail       cached
  blog categories   cached

### User-specific content

  Resource               Strategy
  ---------------------- -----------------
  session                request-time
  doctor dashboard       no shared cache
  doctor profile         request-time
  doctor appointments    request-time
  doctor schedule        request-time
  patient dashboard      request-time
  patient appointments   request-time
  patient profile        request-time
  notifications          request-time
  medical reports        request-time
  Google connection      request-time

### Highly dynamic public data

``` text
appointment slots
availability for a specific date
```

should be short-lived or request-time because stale availability can
cause booking conflicts.

The database must remain the final authority for booking.

------------------------------------------------------------------------

# 10. Next.js 16 Cache Architecture

The project is on Next.js 16.

Next.js 16 provides Cache Components through:

``` ts
cacheComponents: true
```

and the newer model uses:

``` ts
'use cache'
cacheLife(...)
cacheTag(...)
```

rather than building a large collection of ad-hoc route-level caching
rules.

Official Next.js documentation:

-   `use cache`
-   `cacheLife`
-   `cacheTag`
-   `cacheComponents`

Use this model deliberately for public content.

## Recommended public data function

Conceptually:

``` ts
import { cacheLife, cacheTag } from 'next/cache';

export async function getPublicDoctors(params: DoctorQuery) {
  'use cache';

  cacheLife('minutes');
  cacheTag('doctors');

  return apiServer.get('/doctors', params);
}
```

For CMS:

``` ts
export async function getCmsSections() {
  'use cache';

  cacheLife('hours');
  cacheTag('cms');

  return apiServer.get('/cms/sections');
}
```

When an admin updates CMS:

``` text
CMS mutation
   ↓
database update
   ↓
invalidate "cms"
   ↓
next request receives fresh data
```

Do not blindly cache everything.

------------------------------------------------------------------------

# 11. Authenticated Caching Rule

Never do this for a user-specific request:

``` ts
'use cache';

const session = await cookies();
```

inside a shared cache scope.

Cookies and headers identify the current request.

Instead:

``` text
request-time server function
    ↓
read cookies
    ↓
send authenticated request
```

For authenticated screens, TanStack Query is the client-side cache.

That gives:

``` text
Server:
fresh authenticated data

Client:
short-lived in-memory query cache
```

without leaking one user's dashboard into another user's cache.

------------------------------------------------------------------------

# 12. SSR / SSG / ISR / CSR Strategy

Do not try to make every page ISR.

Choose the rendering model according to the data.

## A. Static / cached public

Examples:

``` text
/
 /about
 /blogs
 /blogs/[slug]
 /doctors
 /doctors/[id]
 /consult
```

Use:

``` text
Server Component
+
cached data
+
server-rendered HTML
```

Client components should only handle interaction.

------------------------------------------------------------------------

## B. Authenticated dashboard

Examples:

``` text
/doctor/dashboard
/doctor/appointments
/doctor/schedule
/doctor/patients

/patient/dashboard
/patient/appointments
/patient/profile
/patient/records
```

Use:

``` text
Server Component
    ↓
request-time authenticated fetch
    ↓
prefetch TanStack Query
    ↓
HydrationBoundary
    ↓
Client screen
```

No shared Next data cache.

------------------------------------------------------------------------

## C. Interactive client-only data

Examples:

``` text
doctor search suggestions
date-specific appointment slots
filters
modals
form mutations
notification actions
```

Use:

``` text
Client Component
+
useQuery/useMutation
```

No unnecessary SSR.

------------------------------------------------------------------------

# 13. TanStack Query Hydration Standard

The current code already uses:

``` tsx
dehydrate(queryClient)
```

and:

``` tsx
<HydrationBoundary>
```

That is the correct general architecture.

TanStack's current App Router guidance recommends server prefetching +
dehydration + hydration when React Query is used with Server Components.

Important rule:

> Server Components should prefetch. Client Components should own
> interactive query state.

Do not fetch the same data independently in both server and client code.

## Correct flow

``` text
page.tsx
   ↓
queryClient.prefetchQuery()
   ↓
dehydrate()
   ↓
HydrationBoundary
   ↓
useQuery()
```

The client query key must exactly match the server query key.

------------------------------------------------------------------------

# 14. Avoid Passing `initialData` Everywhere

Current code mixes:

``` ts
initialData
```

with:

``` tsx
HydrationBoundary
```

Prefer one strategy.

For pages already using:

``` tsx
HydrationBoundary
```

do:

``` ts
useQuery({
  queryKey,
  queryFn,
})
```

without manually passing `initialData`.

The hydrated query cache provides the initial data.

Use `initialData` when there is a specific reason to seed a query from
props without using hydration.

------------------------------------------------------------------------

# 15. Query Key Standard

Every feature should own its keys.

Example:

``` ts
export const doctorKeys = {
  all: ['doctors'] as const,

  lists: () => [...doctorKeys.all, 'list'] as const,

  list: (params: DoctorQuery) =>
    [...doctorKeys.lists(), params] as const,

  details: () => [...doctorKeys.all, 'detail'] as const,

  detail: (id: string) =>
    [...doctorKeys.details(), id] as const,

  availability: (id: string, date?: string) =>
    [...doctorKeys.all, 'availability', id, date] as const,

  me: () =>
    [...doctorKeys.all, 'me'] as const,
};
```

Never invalidate random strings such as:

``` ts
['auth']
['appointments', 'slots']
```

when a feature key already exists.

------------------------------------------------------------------------

# 16. Mutation Invalidation Standard

Do not invalidate the entire application after every mutation.

Bad:

``` ts
queryClient.invalidateQueries();
```

Better:

``` ts
queryClient.invalidateQueries({
  queryKey: doctorKeys.me(),
});
```

For appointment confirmation:

``` text
booking
dashboard
appointment summary
notifications
```

should be invalidated only when the mutation actually changes them.

------------------------------------------------------------------------

# 17. API Folder Standard

Use:

``` text
features/
└── doctors/
    ├── api/
    │   ├── client.ts
    │   ├── server.ts
    │   └── keys.ts
    ├── hooks/
    │   ├── use-doctors.ts
    │   ├── use-doctor.ts
    │   ├── use-doctor-availability.ts
    │   └── use-doctor-mutations.ts
    ├── components/
    ├── schemas/
    ├── types.ts
    └── index.ts
```

### `client.ts`

Only HTTP calls.

``` ts
export async function getDoctors(
  params: DoctorQuery
): Promise<DoctorList> {
  return api.get('/doctors', { params });
}
```

### `server.ts`

Only server-side fetching.

``` ts
import 'server-only';

export async function getDoctorsServer(
  params: DoctorQuery
) {
  return apiServer.get('/doctors', { params });
}
```

### hooks

Only React Query.

``` ts
export function useDoctors(params: DoctorQuery) {
  return useQuery({
    queryKey: doctorKeys.list(params),
    queryFn: () => getDoctors(params),
  });
}
```

No Axios code in hooks.

No parsing in hooks.

No URL construction in components.

------------------------------------------------------------------------

# 18. Remove Unnecessary `utils.ts`

The project currently has multiple utility files that are effectively
API-shape adapters.

Example:

``` text
features/blogs/utils.ts
features/cms/utils.ts
lib/time-utils.ts
```

Do not delete all utilities blindly.

Use this rule:

### Keep

Pure reusable domain logic:

``` text
formatTime()
calculateSlot()
createSlug()
mapBookingStatus()
```

### Remove

Functions that only compensate for inconsistent API responses:

``` text
normalizeBlogArray()
normalizeBlogList()
extractData()
unwrapResponse()
parseResponse()
```

if the API contract is made consistent.

This is the biggest opportunity to remove "garbage" without losing
functionality.

------------------------------------------------------------------------

# 19. Blog API Simplification

Current blog API has a lot of normalization:

``` text
normalizeBlogArray
normalizeBlogDetail
normalizeBlogList
toBlogPost
toMeta
```

Target:

``` text
Nest API
    ↓
stable response DTO
    ↓
client returns typed DTO
```

Example:

``` ts
export interface BlogListResponse {
  items: BlogPost[];
  meta: PaginationMeta;
}
```

Then:

``` ts
export async function getBlogs(
  params: BlogQuery
): Promise<BlogListResponse> {
  return api.get('/blogs', { params });
}
```

No second parser.

------------------------------------------------------------------------

# 20. Pagination Standard

Use one server DTO:

``` ts
export class PaginationDto {
  page = 1;
  limit = 10;
}
```

with:

``` text
1 <= page
1 <= limit <= 100
```

Use one response:

``` ts
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

Do not recreate fallback pagination objects in every frontend feature.

The API client should guarantee that the contract is valid.

------------------------------------------------------------------------

# 21. Backend Architecture

Current:

``` text
controller
service
repository
dto
```

is already a good base.

The problem is service size.

Examples currently include large modules such as:

``` text
appointments.service.ts
doctors.service.ts
google.service.ts
```

These should be decomposed by use case.

------------------------------------------------------------------------

# 22. Doctor Backend Target

Current:

``` text
doctors.service.ts
```

Target:

``` text
doctors/
├── doctors.module.ts
├── controllers/
│   ├── doctor-public.controller.ts
│   ├── doctor-profile.controller.ts
│   ├── doctor-availability.controller.ts
│   └── doctor-patients.controller.ts
├── services/
│   ├── get-doctors.service.ts
│   ├── get-doctor.service.ts
│   ├── update-doctor-profile.service.ts
│   ├── manage-availability.service.ts
│   ├── manage-days-off.service.ts
│   └── get-doctor-dashboard.service.ts
├── repositories/
│   └── doctor.repository.ts
├── dto/
└── policies/
    └── doctor-availability.policy.ts
```

Do not split just because a file is long.

Split when responsibilities are independent.

------------------------------------------------------------------------

# 23. Appointment Backend Target

Appointments are business-critical.

Target:

``` text
appointments/
├── controllers/
│   ├── appointment.controller.ts
│   └── slot.controller.ts
├── services/
│   ├── create-booking.service.ts
│   ├── cancel-booking.service.ts
│   ├── confirm-booking.service.ts
│   ├── complete-booking.service.ts
│   ├── get-bookings.service.ts
│   └── get-available-slots.service.ts
├── policies/
│   ├── booking-transition.policy.ts
│   └── slot-availability.policy.ts
├── repositories/
└── dto/
```

Pure booking rules should not depend on Prisma.

This makes them easy to test.

------------------------------------------------------------------------

# 24. Google Integration

Current Google service mixes:

``` text
OAuth URL
OAuth callback
token exchange
refresh token
Calendar
Meet
connection status
```

Target:

``` text
google/
├── application/
│   ├── connect-google.service.ts
│   ├── disconnect-google.service.ts
│   └── get-google-status.service.ts
├── infrastructure/
│   └── google-calendar/
│       ├── google-oauth.adapter.ts
│       ├── google-calendar.adapter.ts
│       └── google-meet.adapter.ts
└── repositories/
    └── google.repository.ts
```

The domain/application layer should not know Google SDK details.

------------------------------------------------------------------------

# 25. External Side Effects

Appointment confirmation currently involves database work plus external
integrations.

The dangerous pattern is:

``` text
DB transaction
   ↓
Google API
   ↓
fake fallback Meet URL
```

Never persist a fabricated external resource.

Correct direction:

``` text
validate booking
    ↓
commit booking state
    ↓
create external calendar/meeting
    ↓
persist real external ID/link
    ↓
notify patient
```

If Google fails:

``` text
booking = CONFIRMED
meetingStatus = FAILED
```

or use a retryable integration status.

Do not generate fake URLs.

------------------------------------------------------------------------

# 26. Database Access

Repositories should own Prisma access.

Services should not construct large Prisma queries repeatedly.

Use reusable select objects:

``` ts
export const doctorSummarySelect = {
  id: true,
  slug: true,
  fee: true,
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.DoctorProfileSelect;
```

Then:

``` ts
repository.findPublicDoctors(...)
```

returns the domain DTO.

------------------------------------------------------------------------

# 27. Avoid `any`

Current code has several:

``` ts
any
```

and:

``` ts
(tx as any)
```

These should be removed.

For Prisma transactions use:

``` ts
Prisma.TransactionClient
```

This keeps autocomplete and compile-time protection.

------------------------------------------------------------------------

# 28. Validation Strategy

The backend already has:

``` ts
ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
})
```

Keep this.

Do not add manual validation in controllers for fields already validated
by DTOs.

Avoid:

``` ts
if (!id) throw ...
if (!email) throw ...
if (!page) ...
```

when DTO / route validation already guarantees it.

------------------------------------------------------------------------

# 29. DTO Simplification

There are DTOs with very large validation surfaces.

Example:

``` text
update-doctor-profile.dto.ts
create-blog.dto.ts
```

Prefer composition.

Example:

``` ts
export class UpdateDoctorProfileDto extends PartialType(
  CreateDoctorProfileDto,
) {}
```

Only add validators where update semantics differ.

Avoid manually duplicating the same validation decorators across
create/update DTOs.

------------------------------------------------------------------------

# 30. Error Handling

Use one error pipeline.

``` text
Prisma error
Nest HttpException
AppException
       ↓
HttpExceptionFilter
       ↓
ApiErrorResponse
       ↓
ApiError
       ↓
React Query
       ↓
Error UI / Toast
```

Do not have every feature invent its own:

``` ts
getMutationErrorMessage()
```

Create one:

``` ts
getApiErrorMessage(error)
```

or expose the normalized `ApiError`.

------------------------------------------------------------------------

# 31. Toast Policy

Do not put toast handling in every API function.

API:

``` ts
return api.post(...)
```

Hook:

``` ts
useMutation({
  mutationFn: createBooking,
  onSuccess: () => toast.success(...),
});
```

This is correct.

But standardize the error extraction.

Also avoid a global QueryCache toast for every background error if a
local screen has a better error UI.

------------------------------------------------------------------------

# 32. Query Defaults

Current default:

``` ts
staleTime: 2 minutes
gcTime: 10 minutes
refetchOnWindowFocus: false
```

This is reasonable as a baseline, but not every feature should inherit
the same behavior.

Recommended:

``` text
Static public:
5–60 minutes

Profile:
5 minutes

Dashboard:
30–120 seconds

Notifications:
30–60 seconds

Appointment slots:
10–30 seconds

Search suggestions:
2–5 minutes

Mutations:
retry = 0
```

These are product freshness choices, not universal constants.

------------------------------------------------------------------------

# 33. Appointment Slot Safety

Client cache is never the authority.

Even with:

``` ts
staleTime: 30_000
```

two users can select the same slot.

Backend must enforce:

``` text
unique booking constraint
+
transaction
+
availability re-check
```

The final booking operation must revalidate availability in the database
transaction.

------------------------------------------------------------------------

# 34. Server Fetch Client

The target server client should be small.

Concept:

``` ts
import 'server-only';

export async function serverGet<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const response = await fetch(buildUrl(path, options.params), {
    headers: await authHeaders(),
    cache: options.cache,
    next: options.next,
  });

  return parseResponse<T>(response);
}
```

No:

``` text
duplicate cookie serializers
duplicate URL builders
duplicate envelope parsing
duplicate pagination parsing
```

------------------------------------------------------------------------

# 35. Browser Client

The target browser client:

``` ts
export const api = {
  get,
  post,
  patch,
  put,
  delete,
};
```

Axios is acceptable, but it is not necessary to expose both Axios and
another HTTP abstraction.

If Axios is retained:

``` text
one Axios instance
one interceptor
one ApiError parser
```

Nothing else.

------------------------------------------------------------------------

# 36. Client Route Structure

Target:

``` text
app/
├── (site)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   ├── doctors/
│   ├── blogs/
│   └── consult/
│
├── (auth)/
│   ├── layout.tsx
│   ├── login/
│   ├── register/
│   ├── verify-email/
│   └── reset-password/
│
├── (doctor)/
│   └── doctor/
│       ├── layout.tsx
│       ├── dashboard/
│       ├── appointments/
│       ├── schedule/
│       ├── patients/
│       └── settings/
│
├── (patient)/
│   └── patient/
│       ├── layout.tsx
│       ├── dashboard/
│       ├── appointments/
│       ├── records/
│       ├── notifications/
│       └── profile/
│
└── api/
    └── only true Next route handlers
```

Remove obsolete duplicate:

``` text
app/dashboard/
app/dashboard/patient/
app/dashboard/doctor/
```

if no longer required.

------------------------------------------------------------------------

# 37. Layout Rule

Do not manually render:

``` tsx
<DoctorLayout>
```

inside individual pages.

Use:

``` text
app/(doctor)/doctor/layout.tsx
```

and:

``` text
app/(patient)/patient/layout.tsx
```

Next route groups should own the layout.

------------------------------------------------------------------------

# 38. Route Protection

Authentication must be enforced server-side.

Use Next.js 16's current request interception convention where
appropriate for redirecting unauthenticated users.

But do not treat client-side redirects as security.

The Nest API must remain the actual authorization authority.

Security chain:

``` text
Next redirect
     +
Nest session verification
     +
Nest role guard
```

------------------------------------------------------------------------

# 39. Admin Application

The admin app has separate architectural problems.

## Current issues

``` text
ComponentsShowcase.tsx ~1010 lines
```

and duplicated Axios hooks.

There is also a mocked login flow.

The admin must not rely on:

``` text
mock JWT
```

for production.

------------------------------------------------------------------------

# 40. Admin API Standard

Replace generic:

``` ts
useClient('/admin/doctors')
```

with:

``` text
features/doctors/api.ts
features/doctors/queries.ts
```

Example:

``` ts
export function getAdminDoctors(params: DoctorQuery) {
  return api.get('/admin/doctors', { params });
}
```

Then:

``` ts
useQuery({
  queryKey: adminDoctorKeys.list(params),
  queryFn: () => getAdminDoctors(params),
});
```

------------------------------------------------------------------------

# 41. Admin Code Splitting

Use route-level lazy loading.

``` text
/dashboard
/doctors
/patients
/appointments
/reviews
/settings
```

should not load every page's JavaScript at startup.

The 1010-line showcase should be development-only or removed from
production.

------------------------------------------------------------------------

# 42. Mock Data Policy

Move all fixtures out of production feature paths.

Target:

``` text
client/
├── __fixtures__/
│   ├── doctors.ts
│   ├── dashboard.ts
│   └── patients.ts
```

Types must never originate from fixture files.

Bad:

``` ts
import { Patient } from '@/lib/dashboard-mock-data';
```

Good:

``` ts
import type { Patient } from '@/features/patients/types';
```

------------------------------------------------------------------------

# 43. Component Architecture

Use three levels.

## Screen

``` text
DoctorAppointmentsScreen
```

Owns:

-   hooks
-   filters
-   loading/error state
-   composition

## Feature components

``` text
AppointmentFilters
AppointmentTable
AppointmentDetailsDialog
```

## UI components

``` text
Button
Dialog
Table
Input
Select
```

The UI component should not know anything about doctors, appointments,
or API calls.

------------------------------------------------------------------------

# 44. Large Components to Refactor First

Current largest frontend production files include:

``` text
DoctorBlogManager.tsx
DoctorAppointmentsClient.tsx
PatientRecordsClient.tsx
PatientAppointmentsClient.tsx
UploadReportModal.tsx
RecordDetailsDialog.tsx
DoctorTodayScheduleTable.tsx
DoctorAvailabilityTable.tsx
```

Do not rewrite these from scratch.

Refactor incrementally:

``` text
existing component
      ↓
extract query logic
      ↓
extract form
      ↓
extract table
      ↓
extract dialogs
      ↓
keep existing behavior
```

------------------------------------------------------------------------

# 45. SEO / Public Pages

Public pages should remain server-first.

Good current examples include:

``` text
blogs/[slug]
consult
about
```

Keep:

-   Metadata
-   canonical URLs
-   JSON-LD
-   server-rendered headings
-   server-rendered content

Do not move SEO-critical content into client-only components.

------------------------------------------------------------------------

# 46. Search / Filter Pages

For:

``` text
/doctors
/blogs
```

URL search params should be the source of truth.

Example:

``` text
/doctors?q=cardio&specialty=cardiology&page=2
```

Server:

``` text
searchParams
    ↓
typed query object
    ↓
server prefetch
```

Client:

``` text
URL
    ↓
query key
    ↓
useQuery
```

Do not maintain a second independent filter state unless needed for
debouncing.

------------------------------------------------------------------------

# 47. Search Suggestions

Current doctor suggestions are already conceptually correct:

``` text
enabled when term >= 2
+
short staleTime
```

Keep this.

Do not send requests for:

``` text
empty string
1 character
```

Use debounce before network requests.

------------------------------------------------------------------------

# 48. Images

Keep `next/image`.

Only allow required remote domains.

Current remote patterns include:

``` text
Cloudinary
Google images
Unsplash
placehold.co
```

Remove domains that are not actually used.

------------------------------------------------------------------------

# 49. Environment Variables

Target:

``` text
.env.example
.env.local
.env.production
```

Never commit:

``` text
.env
real credentials
OAuth secrets
Cloudinary secrets
database URLs
```

Frontend only exposes variables prefixed with:

``` text
NEXT_PUBLIC_
```

Server secrets remain server-only.

------------------------------------------------------------------------

# 50. Database Performance

For production scalability:

### Index

Review indexes for:

``` text
DoctorProfile.slug
DoctorProfile.verified
DoctorProfile.specialty
Appointment.doctorId
Appointment.patientId
Appointment.slotStart
Appointment.status
Notification.userId
Notification.isRead
Blog.slug
Blog.status
Blog.publishedAt
```

Use compound indexes where query patterns require them.

Do not add indexes blindly.

Measure actual query patterns.

------------------------------------------------------------------------

# 51. Prisma Query Rules

Every list endpoint should:

1.  select only required fields
2.  paginate
3.  avoid unnecessary nested includes
4.  avoid N+1 queries
5.  use stable ordering
6.  use indexed filters

Avoid:

``` ts
include: {
  user: true,
  appointments: true,
  reviews: true,
  documents: true,
}
```

unless the screen actually needs all of them.

------------------------------------------------------------------------

# 52. API Endpoint Design

Keep the existing API contract during the refactor.

Do not change endpoint paths just to make folders prettier.

Refactor implementation first.

Later, if API redesign is needed, version it:

``` text
/api/v1/...
```

rather than silently breaking the client.

------------------------------------------------------------------------

# 53. Response Envelope

Recommended:

``` json
{
  "success": true,
  "data": {},
  "message": "Request successful",
  "timestamp": "..."
}
```

Paginated:

``` json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Do not return nested envelopes like:

``` json
{
  "data": {
    "data": []
  }
}
```

That is one of the current frontend normalization problems.

------------------------------------------------------------------------

# 54. Logging

Replace production:

``` ts
console.log()
console.error()
```

with structured logging.

Logs should contain:

``` text
requestId
userId when available
method
route
status
duration
error code
```

Never log:

``` text
password
session token
OAuth refresh token
medical document contents
private patient data
```

------------------------------------------------------------------------

# 55. Observability

The server already has:

``` text
request ID
structured logger
Nest Observe
```

Keep the concept.

Frontend errors should include:

``` text
route
query key
request ID
error code
```

This lets a client error be traced to the server request.

------------------------------------------------------------------------

# 56. Security

Critical items to resolve:

``` text
hardcoded Google client ID
committed .env
committed uploaded document
mock admin JWT
client-side token encryption
duplicate auth state
```

Client-side encryption of a token with a key shipped in the browser does
not make that token secret.

Use HTTP-only cookies.

------------------------------------------------------------------------

# 57. File Upload Architecture

Current code has multiple upload configurations.

Use:

``` text
upload/
├── upload-options.factory.ts
├── presets.ts
```

Example:

``` ts
createUploadOptions(UploadPreset.DOCTOR_DOCUMENT)
createUploadOptions(UploadPreset.MEDICAL_REPORT)
```

Keep file-specific validation:

``` text
mime
size
extension
```

at the upload boundary.

------------------------------------------------------------------------

# 58. Medical Report Security

The report file endpoint should not be publicly accessible merely
because the URL is hard to guess.

Current catalog shows:

``` text
GET /medical-reports/:id/file
```

marked public.

This needs a security review.

Medical documents should normally be authorized by:

``` text
patient
doctor with booking relationship
admin if explicitly required
```

Prefer signed, short-lived storage URLs or a protected streaming
endpoint.

------------------------------------------------------------------------

# 59. Booking Authorization

Every booking action must check:

``` text
authenticated user
+
role
+
booking ownership/relationship
+
valid state transition
```

Never trust:

``` text
doctorId
patientId
role
```

from the browser.

The server must derive the user identity from the session.

------------------------------------------------------------------------

# 60. Timezone Standard

Current code has UTC/local-time mixing.

Define one policy:

``` text
Database → UTC
API → ISO 8601 UTC
Client → user's display timezone
Doctor schedule → explicit business timezone
```

For Bangladesh-only product:

``` text
Asia/Dhaka
```

can be the product business timezone, but store actual instants in UTC.

Do not use:

``` ts
new Date().getDay()
```

for domain scheduling without a defined timezone.

------------------------------------------------------------------------

# 61. Caching Matrix

Use this as the canonical policy.

  Feature               Server cache        Client staleTime
  --------------------- ----------------- ------------------
  CMS                   1--6h + tag                      10m
  Specialties           1--6h + tag                      10m
  Public doctors        1--5m + tag                       2m
  Doctor detail         5--15m + tag                      5m
  Doctor availability   30--60s                      30--60s
  Blogs list            5--30m + tag                      5m
  Blog detail           15--60m + tag                     5m
  Categories            30--60m + tag                    10m
  Suggestions           request-time                   2--5m
  Patient dashboard     no shared cache                1--2m
  Doctor dashboard      no shared cache                1--2m
  Appointments          no shared cache             30--120s
  Slots                 no shared cache              10--30s
  Notifications         no shared cache              30--60s
  Medical reports       no shared cache                1--5m
  Profile               no shared cache                   5m

These values are starting points. Tune them using real traffic and
product freshness requirements.

------------------------------------------------------------------------

# 62. Target Data Flow

## Public doctor page

``` text
Browser
  ↓
Next Server Component
  ↓
cached getDoctor()
  ↓
Nest GET /doctors/:id
  ↓
Prisma
  ↓
HTML + RSC
  ↓
Browser
```

If the page contains interactive booking:

``` text
HTML
  ↓
Hydrated booking component
  ↓
TanStack Query
  ↓
GET /appointments/slots
```

------------------------------------------------------------------------

# 63. Target Dashboard Data Flow

``` text
Browser request
      ↓
Next Server Component
      ↓
cookies()
      ↓
server API client
      ↓
Nest session
      ↓
Prisma
      ↓
prefetch QueryClient
      ↓
dehydrate
      ↓
HydrationBoundary
      ↓
Client dashboard
```

No shared Next cache.

------------------------------------------------------------------------

# 64. Target Mutation Flow

``` text
Button
  ↓
useMutation
  ↓
feature API function
  ↓
Nest endpoint
  ↓
authorization
  ↓
use case
  ↓
repository / transaction
  ↓
external side effects if required
  ↓
response
  ↓
invalidate affected query keys
```

------------------------------------------------------------------------

# 65. Refactor Order

Do not refactor everything in one huge commit.

## Phase 1 --- Foundation

``` text
1. remove hardcoded credentials
2. fix environment configuration
3. choose one HTTP client
4. standardize API envelope
5. standardize ApiError
6. standardize pagination
```

## Phase 2 --- Client data layer

``` text
1. doctors
2. appointments
3. patients
4. blogs
5. notifications
6. medical reports
7. auth
```

For each:

``` text
client API
server API
query keys
hooks
types
```

## Phase 3 --- Rendering

``` text
1. public pages
2. public caching
3. server prefetch
4. hydration
5. dashboard SSR
6. route error boundaries
```

## Phase 4 --- Backend

``` text
1. appointments
2. doctors
3. google
4. patients
5. medical reports
6. blogs
7. admin
```

## Phase 5 --- Admin

``` text
1. real auth
2. single HTTP client
3. feature APIs
4. route lazy loading
5. error boundaries
6. remove showcase from production
```

## Phase 6 --- Performance

``` text
1. database indexes
2. query selection
3. N+1 audit
4. bundle audit
5. image audit
6. cache hit ratio
7. API latency
```

## Phase 7 --- Security

``` text
1. secrets
2. medical report authorization
3. OAuth security
4. upload validation
5. session security
6. CORS
7. rate limiting
```

------------------------------------------------------------------------

# 66. Refactor Rule: Do Not Change Behavior Accidentally

Every refactor should preserve:

``` text
endpoint
HTTP method
request shape
response shape
role
authorization
business rule
UI behavior
```

until a separate feature change is approved.

This is especially important for:

``` text
booking transitions
doctor verification
availability
Google Calendar
medical reports
auth
```

------------------------------------------------------------------------

# 67. Testing Strategy

## Backend

Minimum:

``` text
unit
integration
e2e
```

Critical business logic:

``` text
slot calculation
booking transition
double booking prevention
doctor verification
role authorization
medical report ownership
Google failure handling
```

## Frontend

Test:

``` text
query hooks
forms
URL filters
booking UI
error states
loading states
auth redirects
```

Do not write tests for every trivial presentational component.

------------------------------------------------------------------------

# 68. Definition of Done

A feature is production-ready when:

``` text
[ ] typed API function
[ ] typed response
[ ] no any
[ ] no duplicate response parser
[ ] query key exists
[ ] mutation invalidation is scoped
[ ] server/client ownership is clear
[ ] correct cache policy
[ ] loading state
[ ] error state
[ ] empty state
[ ] authorization checked server-side
[ ] no secrets in client
[ ] no unnecessary console logs
[ ] no duplicate utility
[ ] no mock production data
[ ] tests for critical behavior
```

------------------------------------------------------------------------

# 69. Target Final Repository

``` text
Telecommunication-main/
│
├── client/
│   ├── app/
│   │   ├── (site)/
│   │   ├── (auth)/
│   │   ├── (doctor)/
│   │   ├── (patient)/
│   │   └── api/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── doctors/
│   │   ├── patients/
│   │   ├── appointments/
│   │   ├── medical-reports/
│   │   ├── notifications/
│   │   ├── blogs/
│   │   ├── cms/
│   │   └── contact/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── feedback/
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   ├── error.ts
│   │   │   └── types.ts
│   │   ├── auth/
│   │   ├── query/
│   │   └── config/
│   │
│   ├── __fixtures__/
│   └── types/
│
├── server/
│   └── src/
│       ├── auth/
│       ├── users/
│       ├── doctors/
│       ├── patients/
│       ├── appointments/
│       ├── medical-reports/
│       ├── notifications/
│       ├── blogs/
│       ├── cms/
│       ├── reviews/
│       ├── specialties/
│       ├── contacts/
│       ├── admin/
│       ├── google/
│       ├── health/
│       ├── common/
│       └── infrastructure/
│
└── admin/
    └── src/
        ├── features/
        ├── components/
        ├── pages/
        ├── lib/
        └── router/
```

------------------------------------------------------------------------

# 70. What Should NOT Be Done

Do not turn the project into an abstraction-heavy framework.

Avoid:

``` text
GenericApiService
BaseRepository<T>
BaseCrudService<T>
UniversalQueryHook
UniversalResponseParser
UniversalFormBuilder
UniversalDataTable
```

These often make a medium-sized product harder to understand.

Prefer explicit code:

``` ts
getDoctors()
getDoctor()
updateDoctor()
```

over:

``` ts
genericResourceService.get(...)
```

The goal is **simple production code**, not maximum abstraction.

------------------------------------------------------------------------

# 71. The Ideal Standard

The final code should feel like this:

### Client

``` text
page
 ↓
screen
 ↓
hook
 ↓
api
 ↓
HTTP client
```

### Server

``` text
controller
 ↓
use case
 ↓
repository
 ↓
Prisma
```

### Cache

``` text
public → Next cache
private → request-time
interactive → TanStack Query
```

### Errors

``` text
server error
 ↓
ApiErrorResponse
 ↓
ApiError
 ↓
error boundary / toast
```

### Auth

``` text
Better Auth session
 ↓
server authorization
 ↓
role guard
```

### Booking

``` text
client slot display
 ↓
server re-check
 ↓
DB transaction
 ↓
confirmed booking
```

------------------------------------------------------------------------

# 72. Priority Checklist

## Must fix first

-   [ ] Remove duplicate HTTP clients
-   [ ] Remove hardcoded Google client ID
-   [ ] Remove committed secrets/files
-   [ ] Make Better Auth the auth source of truth
-   [ ] Standardize API response envelope
-   [ ] Standardize `ApiError`
-   [ ] Stop swallowing critical server errors
-   [ ] Secure medical report file access
-   [ ] Remove mock admin login
-   [ ] Fix appointment external side-effect failure handling

## Then

-   [ ] Split large feature API files
-   [ ] Split large hooks
-   [ ] Remove response normalization duplication
-   [ ] Move fixtures out of production
-   [ ] Extract large screen components
-   [ ] Standardize query keys
-   [ ] Standardize mutation invalidation
-   [ ] Standardize pagination
-   [ ] Move layouts to route groups

## Then performance

-   [ ] Enable and intentionally adopt Next.js Cache Components
-   [ ] Add `use cache` to public data functions
-   [ ] Add `cacheLife`
-   [ ] Add `cacheTag`
-   [ ] Invalidate tags after CMS/blog mutations
-   [ ] Keep private data uncached at Next server layer
-   [ ] Tune TanStack stale times
-   [ ] Audit Prisma queries and indexes
-   [ ] Remove unnecessary client JavaScript

------------------------------------------------------------------------

# 73. Final Assessment

The project does **not** need a rewrite.

It needs a controlled architectural cleanup.

The strongest path is:

``` text
KEEP
├── Next.js App Router
├── NestJS
├── Prisma
├── TanStack Query
├── Better Auth
├── feature folders
├── repository pattern
├── global validation
└── structured error handling

REMOVE / CONSOLIDATE
├── duplicate HTTP clients
├── duplicate server fetchers
├── duplicate response parsers
├── duplicate query builders
├── duplicated auth state
├── production mock data
├── hardcoded credentials
├── giant hook files
├── giant screen files
└── swallowed critical errors

ADD
├── explicit cache policy
├── Next 16 Cache Components for public data
├── cache tags
├── request-time private fetching
├── consistent hydration
├── typed API contracts
├── smaller use-case services
├── secure file authorization
└── measurable performance budgets
```

The desired result is **not more folders or more abstractions**.

The desired result is:

``` text
less code
less duplication
fewer transformations
fewer utilities
fewer sources of truth
clear data ownership
predictable caching
typed contracts
small feature modules
```

That is the production-level direction for this codebase.

------------------------------------------------------------------------

## Official technical references

1.  Next.js --- `use cache`\
    https://nextjs.org/docs/app/api-reference/directives/use-cache

2.  Next.js --- `cacheLife`\
    https://nextjs.org/docs/app/api-reference/functions/cacheLife

3.  Next.js --- `cacheTag`\
    https://nextjs.org/docs/app/api-reference/functions/cacheTag

4.  Next.js --- Cache Components\
    https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents

5.  TanStack Query --- Advanced Server Rendering / Next.js App Router\
    https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr

6.  TanStack Query --- Server Rendering & Hydration\
    https://tanstack.com/query/latest/docs/framework/react/guides/ssr
