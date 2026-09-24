# 02 — Project-Specific Production Refactor Prompt

## Purpose

This is a copy-paste prompt for an AI coding agent to refactor the current Telecommunication / Telemedicine repository into a clean, production-level architecture **without changing product behavior**.

---

# MASTER PROMPT

You are a senior full-stack architect and production code reviewer.

You are working on this repository:

```text
Telecommunication/
├── client/     # Next.js 16 App Router
├── server/     # NestJS 12 + Prisma 7
├── admin/      # Vite 7 + React 19
└── docs/
```

Read the ENTIRE repository before making changes.

Do not make assumptions from filenames alone.

Read:

- all source files
- package.json files
- existing architecture docs
- existing refactor docs
- auth implementation
- API integration
- query/hydration implementation
- all modules
- tests
- configuration
- route structure
- shared components
- mock data
- utilities
- admin implementation

The current project is a telemedicine system with:

```text
Public website
Authentication
Patient portal
Doctor portal
Admin portal
Doctor verification
Appointments
Availability
Day off
Medical reports
Notifications
Blogs
CMS
Contacts
Reviews
Specialties
Google integration
Cloudinary uploads
Better Auth
PostgreSQL / Prisma
```

Your job is to make the architecture simpler, cleaner and reusable for future production projects.

---

# NON-NEGOTIABLE RULES

## 1. Do not redesign the product

Do NOT:
- remove features
- change business rules
- change routes unnecessarily
- change API contracts without a documented reason
- change visual design unless required by architecture
- replace libraries just because another library exists
- introduce abstractions that do not solve a real problem

Preserve existing behavior.

---

# 2. First perform an audit

Before editing anything, produce an internal inventory:

```text
Client:
- route structure
- features
- API files
- query files
- server fetchers
- hooks
- components
- shared components
- utilities
- state management
- auth
- caching
- hydration

Server:
- modules
- controllers
- services
- repositories
- DTOs
- guards
- decorators
- common infrastructure
- external integrations
- error handling
- pagination
- tests

Admin:
- routes
- auth
- API clients
- hooks
- state
- layouts
- components
- forms
- tables
```

Identify duplication and unnecessary abstractions before refactoring.

---

# 3. Client target architecture

Use a simple feature-oriented architecture.

Target:

```text
client/
├── app/
│   ├── (site)/
│   ├── (auth)/
│   ├── (doctor)/
│   └── (patient)/
│
├── features/
│   ├── auth/
│   ├── appointments/
│   ├── doctors/
│   ├── patients/
│   ├── medical-reports/
│   ├── notifications/
│   ├── blogs/
│   ├── cms/
│   └── contact/
│
├── components/
│   ├── ui/
│   ├── common/
│   ├── feedback/
│   └── layout/
│
├── lib/
│   ├── api/
│   ├── query/
│   ├── auth/
│   ├── config/
│   └── utils/
│
└── types/
```

Do not create folders merely to satisfy architecture.

---

# 4. Client API architecture

Use one simple pattern.

```text
features/doctors/
├── api/
│   ├── client.ts
│   ├── server.ts
│   └── queries.ts
└── types.ts
```

Responsibilities:

### client.ts

Browser-side API functions.

```ts
export async function getDoctors(params: DoctorQuery) {
  return apiClient.get<DoctorListResponse>('/doctors', { params });
}
```

### server.ts

Only for server-side fetching when request context/caching differs.

```ts
export async function getDoctorsServer(params: DoctorQuery) {
  return apiServer.get<DoctorListResponse>('/doctors', params);
}
```

Do not create a `server.ts` if it provides no real server-specific behavior.

### queries.ts

TanStack Query definitions.

```ts
export const doctorsQueryOptions = (params: DoctorQuery) =>
  queryOptions({
    queryKey: ['doctors', params],
    queryFn: () => getDoctors(params),
  });
```

Do not create unnecessary wrappers such as:

```text
query.ts
mapper.ts
resolver.ts
helper.ts
service.ts
utils.ts
```

unless they have a real responsibility.

---

# 5. SSR / hydration

For public data:

```text
page.tsx
  ↓
server fetch / cached function
  ↓
prefetchQuery
  ↓
dehydrate
  ↓
HydrationBoundary
  ↓
client component
  ↓
useQuery
```

For simple pages where hydration provides no value, do not force TanStack Query.

Use the simplest correct rendering strategy.

Authenticated data must not enter a shared public cache.

---

# 6. Caching

Create one clear caching policy.

### Cache

```text
public doctors
public doctor details
published blogs
CMS content
specialties
public static content
```

### Request-time

```text
session
patient dashboard
doctor dashboard
appointments
notifications
medical reports
profile
Google connection
```

### Dynamic/short-lived

```text
appointment availability
booking slots
```

Never cache user-specific data in a shared cache.

Use Next.js cache APIs deliberately.

---

# 7. Error handling

Never silently convert backend failure into an empty result.

Bad:

```ts
catch {
  return [];
}
```

Good:

```ts
throw new ApiError(...);
```

Use:

```text
loading.tsx
error.tsx
notFound()
```

according to the actual failure type.

Only optional content may have a deliberate fallback.

---

# 8. Remove garbage abstractions

Audit and remove:

```text
unused utils
duplicate types
duplicate API wrappers
duplicate hooks
duplicate mock data
unused Redux state
unused server fetchers
duplicate layouts
duplicate headers
duplicate components
unnecessary mapper files
unnecessary index.ts barrels
dead code
unused dependencies
```

Do not delete something just because it is small.

Delete it when its responsibility is duplicated, unnecessary, or unused.

---

# 9. Authentication

Centralize authentication knowledge.

Client should have a predictable API such as:

```text
useSession()
useCurrentUser()
useRequireAuth()
useRequireRole()
```

Only create hooks that are actually reused.

Keep role checks explicit:

```text
ADMIN
DOCTOR
PATIENT
```

Do not duplicate role logic across pages.

The server remains the final authority for authorization.

---

# 10. Forms

Use:

```text
React Hook Form
+
Zod
```

for complex forms.

Do not create a validation abstraction for every field.

Prefer local schemas:

```text
features/auth/schemas/login.schema.ts
features/doctors/schemas/profile.schema.ts
```

only when the schema has real reuse or meaningful complexity.

---

# 11. Server architecture

Keep the current clean three-layer model:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
```

Rules:

### Controller

HTTP only.

### Service

Business logic and orchestration.

### Repository

Database access only.

Never inject Prisma directly into services.

---

# 12. Server module structure

Target:

```text
src/
├── common/
│   ├── auth/
│   ├── errors/
│   ├── filters/
│   ├── interceptors/
│   ├── pagination/
│   ├── validation/
│   └── http/
│
├── config/
├── prisma/
│
├── auth/
├── users/
├── doctors/
├── patients/
├── appointments/
├── medical-reports/
├── notifications/
├── blogs/
├── cms/
├── contacts/
├── reviews/
├── specialties/
└── integrations/
    ├── google/
    ├── cloudinary/
    └── email/
```

Do not move a module just for aesthetics if the existing organization is already correct.

---

# 13. Server DTOs

DTOs should represent transport validation.

Do not put business logic inside DTOs.

Avoid duplicate validation.

Centralize global validation configuration.

---

# 14. Pagination

Use one pagination implementation.

Standard response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Do not create different pagination shapes per module without a real requirement.

---

# 15. Error architecture

Keep one application error format.

Example:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Invalid request",
  "path": "/api/v1/doctors"
}
```

Prisma errors should be mapped centrally.

Controllers should not contain repetitive try/catch blocks when the global filter can handle them.

---

# 16. External integrations

Create clear boundaries:

```text
integrations/google
integrations/cloudinary
integrations/email
```

Domain services may orchestrate them.

Do not spread provider-specific code throughout business modules.

---

# 17. State management

Use the smallest state mechanism appropriate to the state.

Use TanStack Query for:

```text
server state
API data
cache
loading
mutations
```

Use local React state for:

```text
modal open
selected tab
form UI
temporary UI state
```

Use Redux only for genuine cross-application client state that cannot reasonably live elsewhere.

Do not store server data in Redux.

---

# 18. Admin application

The current admin is a separate Vite application.

Refactor it toward:

```text
admin/src/
├── app/
├── features/
│   ├── auth/
│   ├── doctors/
│   ├── users/
│   ├── cms/
│   └── settings/
├── components/
│   ├── ui/
│   ├── layout/
│   └── common/
├── lib/
│   ├── api/
│   ├── auth/
│   └── query/
└── routes/
```

Use TanStack Query for server state.

Remove duplicated Axios hooks if one configured API client can handle the same responsibility.

---

# 19. Shared UI

Keep design-system primitives centralized:

```text
Button
Input
Dialog
Table
Select
Calendar
Badge
Avatar
Skeleton
```

Domain components stay inside features.

Do not place business-specific components into global `components/`.

---

# 20. Loading and error UI

Create reusable:

```text
PageSkeleton
TableSkeleton
CardSkeleton
EmptyState
ErrorState
QueryBoundary
```

But do not create a component for every single loading variation.

---

# 21. File naming

Use predictable naming.

```text
doctor-card.tsx
doctor-filters.tsx
doctors-api.ts
doctors-query.ts
use-doctors.ts
```

If the repository already uses PascalCase consistently, standardize intentionally rather than mixing styles.

---

# 22. Testing

Do not remove existing characterization tests before understanding what behavior they protect.

After refactoring:

```text
npm test
npm run test:cov
npm run test:e2e
npm run lint
npm run build
```

Add missing tests for:

```text
auth
RBAC
appointments
booking conflicts
medical reports
admin doctor verification
critical frontend forms
```

---

# 23. Dependency cleanup

After refactoring:

```text
find unused dependencies
find duplicate libraries
find packages used only by deleted code
```

Do not remove a dependency until imports have been checked across the entire app.

---

# 24. Output requirements

After the audit and refactor, provide:

```text
1. Architecture audit
2. Problems found
3. Files removed
4. Files moved
5. Files merged
6. Files created
7. API architecture changes
8. Auth changes
9. Caching changes
10. Testing changes
11. Dependency changes
12. Remaining technical debt
```

Do not hide changes.

---

# 25. Definition of Done

The refactor is complete only when:

```text
✓ no dead code
✓ no duplicate API abstraction
✓ no duplicate auth logic
✓ no Prisma in services
✓ no HTTP calls inside UI components
✓ no server data in Redux
✓ no silent API failure converted to empty data
✓ public caching is deliberate
✓ private data is request-time
✓ hydration is used only where useful
✓ pagination is standardized
✓ errors are standardized
✓ tests protect critical business rules
✓ admin follows the same principles
✓ lint passes
✓ typecheck passes
✓ tests pass
✓ production builds pass
```

Do not optimize for fewer files.

Optimize for:

```text
clarity
predictability
maintainability
security
testability
scalability
```

---

# FINAL INSTRUCTION

Do not blindly rewrite the repository.

First understand it.

Then simplify it.

Preserve behavior.

Prefer boring, obvious, production code over clever architecture.
