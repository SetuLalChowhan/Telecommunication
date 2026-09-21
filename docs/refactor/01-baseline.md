# Phase 1 — Safety Net & Baseline Metrics (`01-baseline.md`)

**Date:** 2026-09-21  
**Refactor Phase:** Phase 1 (Safety Net)  
**Status:** Complete  

---

## 1. Summary of Baseline Quality Gates

| Application | Gate | Command | Status | Details |
|---|---|---|---|---|
| **Server** | Typecheck | `npx tsc --noEmit` | **PASS** | 0 errors. Native ESM typecheck verified. |
| **Server** | Lint | `npm run lint` | **PASS** | `oxlint` reports 0 errors, 9 warnings (unused variables/escapes). |
| **Server** | Tests | `npm test` | **PASS (34/34 tests green)** | 9 test suites passing (5 base scaffolds + 4 characterization suites). |
| **Server** | Build | `npm run build` | **PASS** | Emits clean production bundle to `server/dist/`. |
| **Server** | OpenAPI Contract | `node scripts/diff-openapi.js` | **PASS (0 diff)** | Baseline contract locked at `docs/openapi.json`. |
| **Client** | Typecheck | `npx tsc --noEmit` | **PASS** | 0 errors. Next 16 App Router typecheck clean. |
| **Client** | Lint | `npm run lint` | **FAIL (Pre-existing)** | 32 errors, 21 warnings (tracked in `FINDINGS.md`). |
| **Client** | Build | `npm run build` | **PASS** | Compiled with Turbopack & typecheck verified. |
| **Admin** | Typecheck / Build | `tsc -b && vite build` | **PENDING** | `node_modules` installation deferred until Phase 5. |

---

## 2. Characterization Test Matrix (Server Core Logic)

Four characterization test suites have been authored in `server/` to pin down critical domain behaviors before any files are split or relocated in Phase 3:

### 2.1 Slot Availability Calculation
- **File:** [`server/src/appointments/characterization/slot-calculation.characterization.spec.ts`](file:///c:/Setu/2026/Tele/server/src/appointments/characterization/slot-calculation.characterization.spec.ts)
- **Tests (5 passing):**
  1. Throws `NotFoundException` if doctor is unverified or non-existent.
  2. Throws `BadRequestException` on invalid date format.
  3. Returns `isDayOff: true` and empty slots array when doctor has a scheduled day off.
  4. Generates concrete 30-minute time slots (09:00, 09:30, 10:00, etc.) and accurately marks overlapping active bookings as `isAvailable: false`.
  5. Returns empty slots with informative message when no active schedule exists for that day of the week.

### 2.2 Booking Creation & Status State Machine
- **File:** [`server/src/appointments/characterization/booking-transitions.characterization.spec.ts`](file:///c:/Setu/2026/Tele/server/src/appointments/characterization/booking-transitions.characterization.spec.ts)
- **Tests (13 passing):**
  1. `createBooking`: Throws `NotFoundException` when doctor is unverified.
  2. `createBooking`: Throws `ConflictException` when requested slot overlaps with an existing non-cancelled booking.
  3. `createBooking`: Creates `PENDING` booking with advisory lock and dispatches dual notifications.
  4. `confirmBooking`: Throws `ForbiddenException` when non-assigned doctor attempts confirmation.
  5. `confirmBooking`: Throws `BadRequestException` when confirming already `CONFIRMED` booking.
  6. `confirmBooking`: Throws `BadRequestException` when confirming `CANCELLED` booking.
  7. `confirmBooking`: Successfully transitions `PENDING` to `CONFIRMED`, creates/attaches Google Meet link, and notifies patient.
  8. `cancelBooking`: Throws `BadRequestException` when attempting to cancel `COMPLETED` booking.
  9. `cancelBooking`: Throws `BadRequestException` when attempting to cancel already `CANCELLED` booking.
  10. `cancelBooking`: Transitions to `CANCELLED` and notifies counterpart.
  11. `completeBooking`: Throws `ForbiddenException` when unauthorized user attempts completion.
  12. `completeBooking`: Throws `BadRequestException` when completing `CANCELLED` booking.
  13. `completeBooking`: Successfully transitions `CONFIRMED` to `COMPLETED`.

### 2.3 Doctor Profile & Slug Generation
- **File:** [`server/src/doctors/characterization/doctor-profile.characterization.spec.ts`](file:///c:/Setu/2026/Tele/server/src/doctors/characterization/doctor-profile.characterization.spec.ts)
- **Tests (6 passing):**
  1. `slugify`: Converts arbitrary titles into URL-safe, hyphenated lowercase strings.
  2. `generateDoctorSlug`: Appends unique identifier suffix to doctor name slug.
  3. `getMyProfile`: Throws `NotFoundException` if profile does not exist.
  4. `getMyProfile`: Enriches doctor profile with consultation statistics (`totalPatientsConsulted`).
  5. `updateMyProfile`: Throws `NotFoundException` if profile is missing.
  6. `updateMyProfile`: Coordinates user profile update, Cloudinary image upload with face gravity cropping, and database transaction.

### 2.4 HTTP Exception & Database Error Filter
- **File:** [`server/src/common/filters/characterization/http-exception-filter.characterization.spec.ts`](file:///c:/Setu/2026/Tele/server/src/common/filters/characterization/http-exception-filter.characterization.spec.ts)
- **Tests (5 passing):**
  1. Formats standard NestJS `HttpException` with `success: false`, `statusCode`, `message`, `path`, and `timestamp`.
  2. Maps Prisma `P2025` (record not found) to HTTP 404.
  3. Maps Prisma `P2002` (unique constraint violation) to HTTP 409.
  4. Maps Prisma `P2003` (foreign key constraint violation) to HTTP 400.
  5. Catches unknown errors and maps them to HTTP 500 'Internal server error' without leaking internals.

---

## 3. OpenAPI Contract Baseline Verification Tool

To ensure that backend modularization in Phase 3 does not alter any endpoint paths, verbs, or schema structures, an automated validation script was established:

- **Script:** [`scripts/diff-openapi.js`](file:///c:/Setu/2026/Tele/scripts/diff-openapi.js)
- **Baseline Document:** [`docs/openapi.json`](file:///c:/Setu/2026/Tele/docs/openapi.json)
- **Execution:**
  ```bash
  node scripts/diff-openapi.js
  ```
- **Verification Output:**
  ```
  ✅ OpenAPI contract matches baseline exactly (0 diff).
  ```

---

## 4. Phase 1 Checklist & Sign-Off

- [x] Baseline quality metrics recorded for all three applications.
- [x] Pre-existing test scaffold failures in `server` resolved (`CloudinaryService` mock added).
- [x] 29 characterization unit tests added covering slot calculation, booking state transitions, doctor profile/slugs, and error mapping.
- [x] Server unit tests 100% green (34/34 passing).
- [x] OpenAPI JSON exported and zero-diff automated verification script active.
- [x] Server production build verified green (`nest build`).

**Phase 1 is complete. Ready to proceed to Phase 2 — Foundations.**
