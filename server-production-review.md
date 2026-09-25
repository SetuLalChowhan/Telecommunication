# Telemedicine Project — Server Production Readiness Review

**Review scope:** `server/` in the supplied `Telecommunication-main` archive. This is a source-level static review, not a successful production certification. I did not run the app against your real database, Google, Cloudinary, SMTP, or deployed environment. Findings below distinguish directly visible risks from items that require runtime verification.

## Executive summary

The backend has a sensible NestJS feature-module layout, DTO validation, repositories/services, Better Auth integration, and dedicated modules for appointments, doctors, reports, Google Calendar, CMS, blogs, and admin. It is a good working foundation, but **do not treat it as production-ready for real patient records or appointment payments/booking until the P0/P1 items below are resolved and tested.**

### Priority summary

| Priority | Area | Finding / required action |
|---|---|---|
| P0 | Auth / role assignment | `role` is a Better Auth additional field with a default, and the user-create hook trusts `user.role`. Verify server-side role assignment cannot be controlled by signup payload or social-login input. Public signup must never create ADMIN accounts. |
| P0 | Medical reports | Cloudinary upload uses `resourceType: 'auto'`; report URLs and file access need private-by-default storage and strict MIME/size validation. Returning a public URL or relying on an unguessable URL is not adequate for PHI. |
| P0 | Booking concurrency | Confirm booking uses a database-enforced atomic reservation strategy (unique constraint/transaction/locking), not only a prior availability check. Concurrent requests must never double-book a doctor/slot. |
| P0 | Google OAuth | Verify state is single-use, expiring, user-bound and validated; protect refresh tokens with authenticated encryption and key rotation; handle refresh-token omission/revocation and provider errors. |
| P1 | Authorization | Audit every controller/service for ownership and role checks, especially admin, doctor profile/availability, appointment transitions, report deletion, and notifications. Never rely on frontend route protection. |
| P1 | Validation / uploads | `bodyParser: false` is configured in `main.ts`; confirm required JSON and multipart parsers are explicitly registered and upload limits/MIME checks are enforced. |
| P1 | Environment | Several production secrets/integrations are optional or default to localhost/empty values. Fail fast in production for missing secrets, allowed origins, OAuth, storage, SMTP and encryption keys. |
| P1 | Observability | Ensure request logs redact tokens, authorization headers, medical data, OAuth codes, email/phone and report URLs. Add structured error reporting and readiness checks. |
| P1 | Database lifecycle | Better Auth creates its own `pg.Pool` and `PrismaClient` in `auth.ts`; ensure both are closed on shutdown and avoid unmanaged duplicate pools/clients. |
| P2 | Maintainability | Remove `any`, duplicated date/time logic, ad-hoc response shapes, broad catch/rethrow, and unnecessary abstractions after security/correctness tests are in place. |

## 1. Critical server review

### 1.1 Better Auth role escalation and user lifecycle — P0

**Observed:** `src/auth/auth.ts` exposes `role` as an `additionalFields` string with default `PATIENT`; the database create hook branches on `user.role` and creates a doctor profile for `DOCTOR`. The code shown does not establish a strict server-controlled role allowlist at signup.

**Risk:** If Better Auth accepts the role field from public signup or social-auth user input, a caller may attempt to self-assign `ADMIN` or another privileged role. Whether this is exploitable depends on Better Auth's field input configuration and the deployed auth configuration; treat it as a release blocker until verified.

**Required changes**
1. Do not expose a writable `role` field to public signup. Set patient role in trusted server-side hooks/configuration.
2. Provide a separate, authenticated admin-only workflow for promoting users, with audit log and re-authentication for privileged changes.
3. Enforce enum values at the database layer (`UserRole` enum), not an unconstrained string.
4. Test password signup, Google signup, user update, session update, and direct API payloads attempting `role: "ADMIN"`, `role: "DOCTOR"`, or arbitrary values.
5. Make the doctor onboarding flow create a pending doctor profile without granting admin capabilities; verification must be a separate admin-controlled state transition.

### 1.2 Medical report confidentiality — P0

**Observed:** `medical-reports.service.ts` uploads to Cloudinary with `resourceType: 'auto'`. It stores `secureUrl`; non-PDF view/download may use the stored URL directly. The service performs meaningful ownership checks before streaming, which is good, but the storage visibility and upload validation must be confirmed.

**Risks**
- Publicly accessible Cloudinary assets can expose medical records if a URL leaks through logs, browser history, API responses, referrers, or analytics.
- Extension-based PDF detection is not a trustworthy content-type check.
- `resourceType: 'auto'` and unrestricted upload limits can allow unexpected file types or oversized payloads unless the upload middleware independently blocks them.
- Doctor-upload logic should also enforce appointment state and allowed report category, not only doctor ownership.

**Required changes**
1. Store medical files as private/authenticated assets. Do not return raw permanent public storage URLs to clients.
2. Use short-lived signed delivery URLs or stream files through an authenticated endpoint; set `Cache-Control: private, no-store`, safe `Content-Disposition`, and `X-Content-Type-Options: nosniff`.
3. Validate MIME by inspecting file signatures (magic bytes), enforce a small explicit allowlist (PDF/JPEG/PNG as product requires), file size, and image/PDF parsing limits. Reject SVG, HTML, executables, archives and unknown formats.
4. Use explicit Cloudinary resource types and access mode; confirm deletion uses the correct public ID/resource type and works for raw PDFs.
5. Verify doctor is assigned to the booking, patient owns it, booking is in a permitted state, and report type is allowed.
6. Remove sensitive report URLs and patient information from logs and generic API responses.
7. Add tests for IDOR: patient A cannot read/delete patient B's report; unrelated doctor cannot read; only assigned doctor can read; admin access is audited.

### 1.3 Appointment double booking and state machine — P0

The archive includes appointment service/repository and characterization tests, but source-level review cannot establish that the deployed database guarantees slot exclusivity under simultaneous requests.

**Required invariants**
- Two patients cannot reserve the same doctor/time interval, including simultaneous requests.
- Booking creation and slot reservation must be atomic.
- Only valid transitions are allowed (for example, pending → confirmed/cancelled; completed only after an eligible appointment).
- A patient cannot change another patient's booking; a doctor can act only on their own appointments.
- Time comparisons use one canonical timezone strategy (UTC instants in storage, explicit clinic/doctor timezone for schedule interpretation).
- Cancellation, rescheduling, and Google event creation must be idempotent and recoverable if one external step fails.

**Implementation direction**
- Use a database transaction with a database-level uniqueness/exclusion strategy appropriate to the schema. For arbitrary overlapping durations, a simple unique `(doctorId, startAt)` may not be enough; enforce non-overlapping ranges with PostgreSQL exclusion constraints or a transaction/locking strategy.
- Add integration tests with parallel requests against a real PostgreSQL test database. Assert exactly one successful booking.
- Add idempotency keys for retry-prone booking and external calendar operations.
- Use a transactional outbox/job for calendar and notification side effects; do not leave a confirmed booking with silently failed calendar creation.

### 1.4 Google OAuth and Calendar integration — P0/P1

**Observed:** Google integration has token encryption calls and repository persistence. Review all OAuth paths as a security boundary.

**Required checks**
- OAuth `state` must be cryptographically random, tied to the authenticated user and purpose, expire quickly, and be consumed exactly once.
- Validate exact redirect URI and allowed origins; never accept a client-supplied arbitrary redirect target.
- Encrypt refresh tokens using authenticated encryption (for example AES-256-GCM) with a dedicated secret from a secret manager. Include key versioning and a rotation plan. Never log access/refresh/id tokens or OAuth codes.
- Preserve an existing refresh token when Google omits a new one; handle `invalid_grant`, revoked consent, expired access tokens, and reconnect UX.
- Restrict scopes to the minimum required and clearly disclose calendar access.
- Prevent one Google account from being linked to multiple users unless the product explicitly supports it; enforce provider/account uniqueness in the database and handle races.
- Ensure disconnect revokes/deletes stored credentials and cancels or retains events according to an explicit product policy.
- Test state replay, cross-user callback, stale state, duplicate account linking, refresh failure, and Google API timeout/rate-limit behavior.

### 1.5 Request parsing, CORS and HTTP hardening — P1

**Observed:** `main.ts` creates Nest with `bodyParser: false`, enables CORS using comma-separated `TRUSTED_ORIGINS`, and configures Helmet with CSP disabled. Static uploads are served from a local `uploads` directory.

**Actions**
1. Confirm JSON and URL-encoded parsers are registered intentionally. Verify all JSON endpoints and Better Auth endpoints work in a clean production build. Register parsers with explicit body-size limits.
2. For multipart, use Multer limits for file size, fields, files and parts; reject unexpected fields and file types before upload.
3. Parse and normalize trusted origins; trim whitespace, reject wildcard origins with credentials, and fail startup on malformed production origins.
4. Reassess `contentSecurityPolicy: false`; if the API does not serve a browser app, document why. Keep Helmet defaults where compatible.
5. Avoid serving user-uploaded files from the application origin. If local uploads are used, use a separate host/bucket and safe content headers.
6. Add proxy/trust-proxy configuration only for known deployment infrastructure; rate limiting behind a proxy must use a correctly configured client IP.
7. Ensure production errors never expose stack traces, SQL details, tokens, or internal provider responses.

## 2. Configuration and deployment

### 2.1 Production environment validation

`src/config/env.schema.ts` allows optional values for Better Auth secret, Google credentials, Cloudinary, SMTP, and redirect URIs; it also supplies localhost defaults. This is convenient in development but unsafe if production can start with those defaults.

**Make validation conditional on `NODE_ENV`:**
- Production must require a high-entropy `BETTER_AUTH_SECRET`, explicit `BETTER_AUTH_URL`, `CLIENT_URL`, exact `TRUSTED_ORIGINS`, `DATABASE_URL`, Cloudinary credentials (if used), SMTP credentials (if email flows are enabled), Google OAuth credentials (if Calendar/login is enabled), and the token-encryption key.
- Validate URL schemes/hosts and reject localhost in production.
- Validate numeric bounds for port, pool size, upload limits, rate limits and timeout values.
- Do not silently default missing secrets to empty strings.
- Keep `.env` out of version control; use platform secrets/secret manager and rotate any credentials that were ever committed or shared.

### 2.2 Database and Prisma lifecycle

`auth.ts` constructs a separate `pg.Pool`, `PrismaPg`, and `PrismaClient` at module scope. Confirm the main Prisma service and Better Auth do not create excessive pools in serverless/multi-instance deployments.

- Centralize pool sizing and lifecycle where possible.
- Close Prisma and the underlying pool on application shutdown.
- Set connection, statement and transaction timeouts; configure SSL appropriately in production.
- Run migrations as a controlled deployment step (`prisma migrate deploy`), not from each application instance.
- Add indexes for common filters/sorts and foreign keys; verify query plans for dashboards, doctor search, appointment lists and report access.
- Ensure production seed scripts cannot create default/admin credentials without an explicit secure process.

### 2.3 Health, logs and monitoring

- Separate liveness (`/health/live`) from readiness (`/health/ready`, checks database and required dependencies with timeouts).
- Add centralized error reporting with correlation/request ID.
- Redact `Authorization`, cookies, Better Auth tokens, Google OAuth data, patient medical data, uploaded filenames where sensitive, and signed URLs.
- Add metrics for request latency/error rate, database pool saturation, booking conflicts, Google failures, email failures and upload failures.
- Set alerts and retention policies that are appropriate for medical data.
- Avoid logging full request/response bodies on auth, report, booking and profile endpoints.

## 3. Authorization audit checklist by module

Do not mark a module complete until each route has a written authorization rule and automated test.

| Module | Must enforce |
|---|---|
| Admin | ADMIN role on every route at controller/service boundary; audit verification/rejection, user-role changes, and data exports. |
| Doctors | Doctor owns profile/availability; only verified/approved doctors are publicly bookable; profile edits cannot alter verification/admin fields. |
| Patients | Patient can read/update only own profile and bookings. |
| Appointments | Patient/assigned doctor/admin permissions; valid state transitions; concurrency-safe booking and cancellation. |
| Medical reports | Patient owner, assigned treating doctor, or audited admin only; private storage and strict file checks. |
| Google | Authenticated user can only connect/disconnect their own Google account; state is user-bound and one-use. |
| Notifications | User can only list/read/update own notifications; no arbitrary user ID accepted from client. |
| CMS/blogs | Public read only for published content; create/update/delete restricted to authorized admin/editor roles. |
| Contacts | Public creation is rate-limited and validated; only authorized staff can list/export messages. |
| Cloudinary/upload | Signed upload policy, strict folder/type/size restrictions; never trust client-supplied public IDs or URLs. |

## 4. API contract and code-quality improvements

These are important after the blockers above:
- Replace service/repository `any` and `Record<string, any>` with DTO/input and Prisma select result types.
- Standardize success/error response format. Avoid a global transform that accidentally wraps streaming, file, auth callback, or already-wrapped responses.
- Ensure pagination DTOs enforce integer bounds (`page >= 1`, `limit` capped), and validate sorting/filter fields against allowlists.
- Use explicit select projections; never return full Prisma user, OAuth account, session, or medical-report records by default.
- Map Prisma errors centrally but preserve domain-specific conflict/not-found semantics.
- Keep business rules in services, persistence in repositories, and provider SDK logic in integration services; avoid redundant pass-through layers.
- Avoid broad `catch` blocks that swallow provider/database errors or convert every error to 500.
- Add API versioning and generated OpenAPI types for the frontend if the contract is changing frequently.

## 5. Required release gates

Run these against a production-like environment before launch:

- [ ] Clean install, typecheck, lint, unit tests, integration tests and production build pass in CI.
- [ ] PostgreSQL migrations apply from an empty database and from the previous release.
- [ ] Role escalation tests pass for password signup, Google signup and profile updates.
- [ ] Parallel booking test proves no double booking.
- [ ] IDOR tests cover appointments, reports, profiles and notifications.
- [ ] Upload tests cover spoofed MIME, oversized files, malformed PDFs/images and unauthorized access.
- [ ] Google OAuth state replay/cross-user/token-refresh/revocation tests pass.
- [ ] Production environment refuses to boot with missing/unsafe secrets and localhost origins.
- [ ] Backup/restore and migration rollback/forward plan documented.
- [ ] Logs and error monitoring verified to contain no secrets or patient data.

**Bottom line:** The structure is promising, but authentication role trust, private medical-file delivery, concurrency-safe booking, and OAuth token/state handling are the highest-risk areas. Resolve and test those before real patient use.
