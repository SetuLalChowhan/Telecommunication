# Production Refactor — Findings Log (`FINDINGS.md`)

This document records suspected bugs, architectural defects, and behavioral discrepancies discovered during **Phase 0 Audit**.
Per §3 of the Master Prompt, **these are NOT fixed silently within refactor commits**. Each bug is tracked here with exact location, explanation, and proposed fix. They will be resolved in dedicated `fix:` commits only after explicit approval.

---

## 1. Server (NestJS) Findings

| ID | Severity | File & Line | Issue Description | Proposed Fix |
|---|---|---|---|---|
| **S1** | Medium | `server/src/doctors/doctors.service.ts` (714 lines)<br>`server/src/appointments/appointments.service.ts` (615 lines)<br>`server/src/patients/patients.service.ts` (390 lines) | Fat services handling multiple unrelated use cases. `doctors.service.ts` contains profile CRUD, availability, days-off, documents upload, dashboard stats, public directory, and patient registry in one class. | Split into single-responsibility use case services in Phase 3. |
| **S2** | Medium | `server/src/doctors/doctors.service.ts:79-251`<br>`server/src/appointments/appointments.service.ts:83-266` | Giant methods: `updateMyProfile` (~173 lines), `createBooking` (~183 lines), `getAvailableSlots` (~136 lines), `handleOAuthCallback` (~159 lines). | Break down into pure policy/calculator functions (e.g., slot calculation) and helper methods ≤ 30 lines. |
| **S3** | Medium | `server/src/doctors/doctors.service.ts`<br>`server/src/appointments/appointments.service.ts` | No repository layer. Database `include` shapes (such as `user: { select: { id, name, email, image, phone } }`) are duplicated across multiple queries and controllers. | Create reusable Prisma repositories with shared select/include fragments. |
| **S4** | Low | Server controllers (48 occurrences) | Repeated auth boilerplate: `@Roles('DOCTOR') @UseGuards(RolesGuard)` duplicated on almost every controller method. | Replace with composite `@Auth('DOCTOR')` decorator at class/method level. |
| **S5** | High | `server/src/doctors/doctors.service.ts:168`<br>`server/src/medical-reports/medical-reports.service.ts:60` | Heavy use of `any` and `(tx as any)` to bypass TypeScript checking inside Prisma transactions. | Use properly typed Prisma transaction client `Prisma.TransactionClient`. |
| **S6** | Low | `server/src/common/utils/file-upload.util.ts:8-48` | Redundant Multer configuration: 3 near-identical file upload options objects (`avatarUploadOptions`, `doctorDocumentUploadOptions`, `reportUploadOptions`). | Extract shared `createUploadOptions()` factory with presets. |
| **S7** | Critical | `server/src/appointments/appointments.service.ts:365-385`<br>`server/src/google/google.service.ts:254` | **Silent fake data on external failure:** When Google Meet link generation fails, code silently generates a fake URL `https://meet.google.com/tele-<randomId>` and commits it to DB, leading to invalid meeting links. Also, notification creation failures only do `console.error`. | Run external side effects after DB commit in retry-safe blocks; log failure explicitly without fabricating fake URLs, or record failure status. |
| **S8** | High | `server/src/auth/auth.ts:12-24` | **Two separate database connection pools:** `auth.ts` creates its own `new pg.Pool()` and `new PrismaClient()` beside `PrismaService`, doubling connection pool resource consumption on Neon/PostgreSQL. | Share a single Prisma instance / adapter pool across Better-Auth and NestJS. |
| **S9** | Medium | `server/src/auth/auth.ts:13,26`<br>`server/src/google/google.service.ts:28`<br>`server/src/main.ts:31,58` | Direct reads of `process.env` scattered across files with hardcoded localhost fallbacks (`:3000`, `:5000`, `:5173`) instead of fail-fast validated configuration. | Implement typed, Zod-validated `ConfigModule` (`env.schema.ts`). |
| **S10** | Low | `server/src/auth/auth.ts:85-96,115-126` | Inline HTML email templates hardcoded directly into the Better-Auth configuration file. | Extract to modular email template generators in `src/auth/emails/`. |
| **S11** | Low | `server/src/doctors/doctors.controller.ts:33-47` | Duplicate endpoints: `GET /doctors/dashboard` and `GET /doctors/dashboard/stats` execute the exact same method `getDoctorDashboard()`. | Keep both for backward compatibility; deprecate `stats` and route to single query service. |
| **S12** | High | `server/src/doctors/doctors.service.spec.ts`<br>`server/src/users/users.service.spec.ts` | **Failing baseline unit tests:** Both tests fail on `npm test` because `CloudinaryService` dependency was added to services without updating test module providers. | Provide mock providers for `CloudinaryService` and write comprehensive characterization tests. |
| **S13** | Medium | `server/src/appointments/appointments.service.ts:40-75` | **Timezone inconsistency:** Slot availability calculation parses dates in UTC (`getUTCDay()`), while dashboard today query uses server local time (`setHours(0,0,0,0)`). | Standardize datetime operations and timezone handling (log in FINDINGS, preserve behavior unless approved). |
| **S14** | Medium | `server/src/common/filters/http-exception.filter.ts` | Exception filter lacks error `code`, `requestId`, and flattens class-validator error arrays into unstructured strings. | Upgrade filter to return standard RFC-compliant error envelope with `code`, `requestId`, and `details`. |

---

## 2. Web Client (Next.js 16) Findings

| ID | Severity | File & Line | Issue Description | Proposed Fix |
|---|---|---|---|---|
| **C1** | High | `client/app/` | **Zero error/loading boundaries:** There are NO `error.tsx`, `loading.tsx`, `not-found.tsx`, or `global-error.tsx` files anywhere in the route tree. Any unhandled error white-screens the entire application. | Implement route-group level boundaries using Next 16 `unstable_retry` and `<QueryBoundary>`. |
| **C2** | High | `client/` root | **Missing route protection middleware:** No `proxy.ts` (Next 16 convention for `middleware.ts`) exists; role protection is implemented purely client-side inside individual page views. | Implement Next 16 `proxy.ts` for role-based redirects (`(doctor)` vs `(patient)`). |
| **C3** | High | `client/app/(doctor)/doctor/settings/DoctorSettingsClient.tsx:43`<br>`client/app/(auth)/doctor-verification/page.tsx:8` | Direct `apiClient` / Axios calls inside UI components, violating separation of concerns. | Encapsulate all network calls into feature hooks (`useDoctorSettings`, etc.). |
| **C4** | Medium | 10 client files | Giant monolithic components exceeding 400–1000 lines (e.g., `DoctorSettingsClient` 1028 lines, `DoctorBookingSidebar` 723 lines, `PatientRecordsClient` 546 lines, `Header` 410 lines). | Decompose into screen containers + presentational sub-components ≤ 120 lines. |
| **C5** | Critical | `client/lib/api/axios.ts:26-41` | Axios response interceptor converts every failure to `new Error(message)`, completely stripping HTTP status code, error code, request ID, and network/timeout classification. | Implement `ApiError` class and `toApiError()` parser preserving all error metadata. |
| **C6** | High | `client/features/doctors/api/server.ts:66-77`<br>`client/features/patients/api/server.ts:34-36` | RSC server fetchers catch exceptions and return empty arrays `[]` or `null`, hiding server outages from users. | Let server fetchers throw `ApiError` to trigger Next.js `error.tsx` boundaries. |
| **C7** | Low | `client/features/doctors/api/client.ts:26-38`<br>`client/features/doctors/api/server.ts:29-39` | Byte-identical 9-line query-string builder duplicated across client and server fetcher modules. | Extract single shared `toDoctorQuery()` helper in `doctors.query.ts`. |
| **C8** | Medium | `client/features/doctors/api/queries.ts` (371 lines)<br>`client/features/auth/api/queries.ts` (319 lines) | Massive multi-query files mixing queries and mutations in monolithic modules. | One hook per file in `features/<feature>/hooks/`. |
| **C9** | High | 19 production files | Production components import mock fixtures, and `features/patients/types.ts:1` imports production TypeScript types from `@/lib/dashboard-mock-data`. | Move fixtures to `__fixtures__/` and define genuine domain types in `types.ts`. |
| **C10** | Medium | `client/components/doctor/` vs `client/components/dashboard/doctor/`<br>`client/layouts/` vs `client/app/(group)/` | Duplicated navigation components and layout wrappers. 14 pages manually import `DoctorLayout`/`PatientLayout` inside component bodies instead of using Next.js group layouts. | Migrate to route group layouts `app/(doctor)/layout.tsx` and `app/(patient)/layout.tsx`. |
| **C11** | High | `client/lib/api/index.ts:13-30` | Circular dependency risk: `lib/api/index.ts` re-exports `features/auth` and `features/doctors`, while features import `lib/api/axios.ts`. | Remove barrel export; `lib/` must never import `features/`. |
| **C12** | Critical | `client/components/providers.tsx:27-29` | Hardcoded real Google OAuth Client ID fallback in source code. | Env-only configuration via `lib/config/env.ts` that fails fast if missing. |
| **C13** | Medium | `client/redux/slices/authSlice.ts`<br>`client/features/auth/api/queries.ts:40-55` | Two competing auth states: localStorage persisted via Redux vs. Better-Auth HTTP-only cookies. Leads to stale session desynchronization. | Better-Auth session as the single source of truth; eliminate redundant localStorage token caching. |
| **C14** | Low | `client/app/**/page.tsx` | Inline spinners duplicated in Suspense fallbacks across various pages. | Standardize with reusable skeleton components in `components/feedback/`. |
| **C15** | Medium | 16 lint errors in `client/` | 28 `any` type casts and 14 `console.*` statements across production files. | Eliminate `any` with strict typing and replace `console.*` with `reportError()`. |
| **C16** | Low | `client/app/api/auth/verify-email/route.ts`<br>`client/app/api/google/callback/route.ts` | Direct reads of `process.env` with hardcoded fallback `http://localhost:5000`. | Use centralized `lib/config/env.ts`. |

---

## 3. Admin SPA (Vite + React Router) Findings

| ID | Severity | File & Line | Issue Description | Proposed Fix |
|---|---|---|---|---|
| **A1** | Medium | `admin/src/hooks/useClient.tsx` | Generic data-fetching hook takes raw endpoint strings (e.g. `url: "/admin/doctors"`), scattering API contracts across UI components. | Create feature-specific API modules with typed query keys. |
| **A2** | High | `admin/src/hooks/useAxiosSecure.tsx:8`<br>`admin/src/hooks/useClient.tsx:20` | `axios.create()` is executed inside the custom hook body on every single render. Furthermore, `useClient` conditionally calls hooks: `isPrivate ? useAxiosSecure() : useAxiosPublic()`, violating React Rules of Hooks. | Create a single Axios instance outside React; read auth token via `store.getState()`. |
| **A3** | Critical | `admin/src/pages/sites/Login.tsx:48-50` | **Login is completely mocked:** Submitting login waits 1200ms and commits `"mock_jwt_token_payload_xyz123"` to Redux without calling the server API. | Integrate genuine Better-Auth admin authentication or API endpoint. |
| **A4** | High | `admin/src/lib/secure.ts:1-38` | Pseudo-security: Encrypts localStorage tokens using `CryptoJS.AES` with `VITE_SECURE_KEY`, which is bundled into client-side JavaScript. | Remove client-side encryption; rely on secure HTTP-only cookies and proper storage. |
| **A5** | Critical | `admin/.env` (tracked in git) | Committed `.env` file containing API endpoint and encryption key tracked in repository. | Remove from git tracking, add to `.gitignore`, and ship `.env.example` only. |
| **A6** | Medium | `admin/src/pages/admin/ComponentsShowcase.tsx` (1010 lines) | A massive internal UI component showcase page is bundled into the production route `/dashboard/showcase`. | Gate under `import.meta.env.DEV` and lazy load. |
| **A7** | Medium | `admin/src/router/router.tsx` | Zero route-level code splitting (`React.lazy()`) and no `errorElement` on any router definitions. | Introduce `lazy()` route loading with dedicated error boundaries. |
| **A8** | Low | `admin/src/pages/admin/SideBar.tsx`<br>`admin/src/pages/admin/CommonNavbar.tsx` | Layout components placed inside `pages/` directory. | Move to `components/layout/`. |
| **A9** | Medium | `admin/` root | `admin/node_modules` not installed; build script fails immediately because TypeScript compiler is missing. | Document in Phase 0 audit and ensure dependencies are installed before Phase 5. |

---

## 4. Repo Hygiene & Security Findings

| ID | Severity | Location | Issue Description | Proposed Fix |
|---|---|---|---|---|
| **H1** | Critical | `server/uploads/documents/doc-1789029941881-52918743.pdf` | Real uploaded user verification document committed into git repository. | Remove from git history, add `server/uploads/` to `.gitignore`. |
| **H2** | Medium | `admin/tsconfig.tsbuildinfo`<br>`client/tsconfig.tsbuildinfo`<br>`server/tsconfig.build.tsbuildinfo` | TypeScript build cache files committed into repository. | Remove and add `*.tsbuildinfo` to root `.gitignore`. |
| **H3** | High | Auth protocol discrepancy | Admin app sends `Authorization: Bearer <token>`, while web client sends Better-Auth session cookies. Server needs consistent session verification for admin users. | Standardize admin authentication with Better-Auth or verify Bearer plugin setup. |
