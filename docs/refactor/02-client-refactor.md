# Phase 4 — Web Client Refactor (`client/`)

**Date:** 2026-09-24
**Refactor Phase:** Phase 4 (Next.js 16 web client)
**Status:** Complete — lint/typecheck/build green

---

## 1. Summary of the Phase 4 Definition of Done

| Gate | Before | After |
|---|---|---|
| `npx tsc --noEmit` | PASS | **PASS (0 errors)** |
| `npm run lint` | **FAIL (12 errors, 197 warnings)** | **PASS (0 errors, 189 warnings)** |
| `npm run build` | PASS | **PASS** |

---

## 2. Structural Consolidation

### 2.1 Single layout layer (finding C10)

`client/layouts/*` was deleted; each route group now owns its shell directly:

- `app/(site)/layout.tsx` — Header + Footer + `<main>`
- `app/(auth)/layout.tsx` — auth shell
- `app/(doctor)/doctor/layout.tsx` — `<DashboardShell role="DOCTOR">`
- `app/(patient)/patient/layout.tsx` — `<DashboardShell role="PATIENT">`

### 2.2 Duplicate Header re-export removed

`client/shared/` was deleted. `shared/Header.tsx` was a pure re-export of
`components/layout/Header/Header`. The footer moved to the canonical
`components/layout/Footer.tsx` and both are re-exported from
`components/layout/index.ts`.

### 2.3 Mock fixtures removed from production code (finding C9)

Only four interfaces from the mock modules were ever used by production code.
They now live in their feature:

- `DashboardAppointment`, `DoctorScheduleItem` → `features/appointments/types.ts`
- `AvailabilitySlot`, `DoctorDocument` → `features/doctors/types.ts`
- `RecommendedDoctor` → `features/patients/types.ts`

Deleted: `lib/dashboard-mock-data.ts`, `lib/doctor-mock-data.ts`,
`lib/patient-mock-data.ts`, `lib/mock-data/`, `constants/mockDoctors.ts`,
`constants/`, `types/` (thin re-export shims), `utils/` (dead `Data.tsx`).

### 2.4 Duplicate auth state removed (finding C13)

Redux was only ever used to cache an auth user/token next to Better Auth — and
`redux-persist` wrote that token to `localStorage`. All of it was removed:

- Deleted `redux/` (`store.ts`, `hooks.ts`, `slices/authSlice.ts`).
- `features/auth/api/queries.ts` no longer dispatches; Better Auth's session is
  the single source of truth, `/users/me` is the profile query, and logout calls
  `queryClient.clear()`.
- Removed `@reduxjs/toolkit`, `react-redux`, `redux-persist` from `package.json`.
- `components/providers.tsx` no longer wraps the tree in a Redux `Provider`.

### 2.5 Dead code removed

- `features/auth/api/client.ts` — unused `loginWithEmail`, `registerWithEmail`,
  `logoutUser` helpers and their credential interfaces (the query hooks call the
  Better Auth client directly).
- Unused dependencies: `react-icons`.
- `features/doctors/components/settings/DoctorDocumentsTab.tsx` now imports the
  canonical `DoctorDocument` type instead of re-declaring it.

---

## 3. Error Handling (findings C1, C6, C14)

### 3.1 Server fetchers no longer swallow failures (C6)

`getDoctorsServer`, `getDoctorAvailabilityServer`, `getSpecialtiesServer`,
`getBlogsServer`, `getFeaturedBlogsServer`, `getAdminBlogsServer`,
`getBlogCategoriesServer`, `getBookingSummaryServer`, the doctor self-service
fetchers, `getPatientDashboardServer`, `getPatientBookingsServer`,
`getPatientProfileServer`, `getMyMedicalReportsServer` and
`getNotificationsServer` now propagate `ApiError`.

Deliberate, documented fallbacks remain only where a real empty state exists
(is the exact behaviour we want):

| Fetcher | Fallback | Why |
|---|---|---|
| `getDoctorByIdOrSlugServer` | `null` on 404 only | page renders its not-found state |
| `getMyDoctorProfileServer` | `null` on 404 only | "not verified yet" is a state |
| `getBlogBySlugServer` | `{ post: null, ... }` on 404 only | page calls `notFound()` |
| `getPatientDashboardServer` | `null` on 404 only | no dashboard yet |
| `getPatientProfileServer` | `null` on 404 only | profile not created yet |
| `getProfileServer` | `null` on 401 only | signed-out is not an outage |
| `getSessionServer` | `null` on failure | fail-closed as signed out |
| `getCmsSectionsServer` | `{}` | optional CMS content with hard-coded defaults |

`isNotFound(error)` was added to `lib/api/error.ts` to keep that distinction in
one place.

### 3.2 Reusable route error boundary (C1, C14)

All 19 `error.tsx` files were reduced to a thin wrapper around a single new
`components/feedback/RouteError.tsx`, and Next 16's `unstable_retry` replaced the
deprecated `reset` prop. `app/(site)/error.tsx` was added so public pages
(including `/consult`) have a boundary.

---

## 4. Lint Errors Fixed

| File | Problem | Fix |
|---|---|---|
| `lib/time.ts` | `prefer-const` | `let h` → `const h` |
| `features/doctors/types.ts` | `no-explicit-any` | typed `documents: DoctorDocument[]` |
| `app/api/google/callback/route.ts` | `no-explicit-any` | `catch (err: unknown)` |
| `features/auth/components/RoleSelectorTabs.tsx` | unescaped `'` | `I&apos;m a …` |
| `components/common/TopProgressBar.tsx` | setState in effect | route completion derived during render |
| `components/site/home/SearchBar.tsx` | setState in effect | active index clamped during render |
| `components/site/doctors/details/DoctorBookingSidebar.tsx` | setState in effect | seed-once phone during render |
| `app/(doctor)/doctor/settings/DoctorSettingsClient.tsx` | setState in effect | sync form during render |
| `app/(patient)/patient/profile/PatientProfileClient.tsx` | setState in effect | sync form during render |
| `features/doctors/components/DoctorBlogManager.tsx` | setState in effect | reset dialog during render |
| `features/appointments/components/doctor/AddWeeklySlotDialog.tsx` | impure `Date.now()` | id derived from submitted values |

---

## 5. Deliberate Non-Changes

- **`components/site/**` kept as the public marketing layer.** It is not a
  duplicate of any feature folder and the Phase 0 audit did not flag it. Its
  `doctors/**` and `blogs/**` UI is site-presentation, not portal domain UI.
- **`features/<x>/query.ts` and `features/blogs/mapper.ts` kept.** Each has one
  real responsibility: a single filter serialization shared by the browser
  fetcher and the server prefetch (so cache keys cannot drift), and one
  DTO → view-model mapper.
- **189 lint warnings remain** (`max-lines`, `complexity`, `no-console`). These
  are the "split oversized screens" work and stay warnings per the Phase 6 plan
  to flip lint to errors only once the splits are done.

---

## 6. Remaining Technical Debt (Phase 4 follow-up)

1. ~52 components still exceed the 150-line / 120-line-function budget. Splitting
   them is mechanical but large; the highest-value targets are
   `DoctorSettingsClient`, `DoctorBookingSidebar`, `PatientRecordsClient`,
   `DoctorAppointmentsClient`, `PatientAppointmentsClient`, `PatientProfileClient`.
2. No client test runner is configured. Critical flows (booking, RBAC redirects,
   profile forms) still lack tests.
3. Route protection is still client-side; Next 16 `proxy.ts` role redirects are
   not implemented (finding C2).
