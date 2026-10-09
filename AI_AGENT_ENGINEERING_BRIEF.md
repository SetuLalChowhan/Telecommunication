# AI Agent Engineering Brief — Production Hardening and Codebase Simplification

**Project:** Telecommunication Platform  
**Applications:** Next.js client, React/Vite admin, NestJS server  
**Audience:** AI coding agents and senior engineers  
**Primary goal:** Reduce unnecessary code and duplicated logic while preserving all existing features and API behavior, and improve production security.

---

## 1. Mission

Inspect the **entire repository** before changing code. Then refactor incrementally to achieve:

- A small, understandable, maintainable architecture.
- Minimal duplication across API clients, feature API functions, hooks, components, and backend modules.
- Clear, correct use of SSR, ISR, and CSR.
- Production-grade authentication, authorization, input validation, file access, configuration, logging, and error handling.
- No regressions in existing product behavior.

Think like a principal engineer responsible for a production application: prefer the simplest design that is secure, testable, observable, and easy to operate. Do not optimize for the fewest lines at the expense of clarity or safety.

## 2. Non-negotiable constraints

1. **Preserve all existing features, routes, screens, user journeys, business rules, database semantics, API endpoints, request payloads, response shapes, status codes, and URL formats unless a security fix makes a change essential.**
2. Do not perform a wholesale rewrite.
3. Do not change the database schema or migrate data unless demonstrably necessary and explicitly documented.
4. Do not remove files, abstractions, dependencies, guards, validation, or error handling until you have searched for all usages and established that removal is safe.
5. Do not add a new library if the existing stack can solve the problem simply and safely.
6. Do not introduce a universal API factory, service framework, repository layer, or generic page component merely to reduce file count.
7. Keep browser-only, server-only, and secret-bearing code separated. Never expose server secrets in client bundles.
8. Do not weaken security to preserve convenience. If a secure fix changes behavior, explain the impact and use the smallest safe change.
9. Never claim tests/builds passed unless you ran them and observed the successful result.
10. Work in small, reviewable steps. Inspect `git status` first and never overwrite unrelated user changes.

## 3. Required workflow

### Phase 0 — Repository discovery and baseline

Before editing:

- Read the root README and package manifests for all three applications.
- Map the directory structure and identify the framework versions, package manager, scripts, test setup, environment variables, deployment targets, and generated files.
- Trace authentication from login to API calls, token/session storage, guards, logout, and refresh behavior.
- Trace important business flows end to end: appointment booking and state transitions, doctors, patients, reports/uploads, Google integration, admin actions, CMS, notifications, and other existing feature modules.
- Map all API endpoints, DTOs, response envelopes, error handling, query keys, cache rules, and client/server data-fetching paths.
- Identify duplicate code using searches and call-site analysis, not visual similarity alone.
- Run baseline lint, typecheck, tests, and builds where available. Record existing failures separately.
- Create `docs/engineering/BASELINE.md` with findings, commands, known failures, and an inventory of risky areas.

**Do not begin broad refactoring until the baseline and dependency map are documented.**

### Phase 1 — Security fixes first

Investigate and address the following findings, confirming each against the current source rather than blindly applying assumptions from this brief.

#### 1. CORS

Inspect `server/src/main.ts` and `server/src/serverless.ts`.

- Remove any permissive fallback that approves arbitrary origins.
- Define explicit allowed production origins from validated configuration.
- Allow localhost only in development.
- Handle requests with no `Origin` header appropriately for non-browser clients; do not treat this as a reason to approve arbitrary browser origins.
- Use credentials only with explicit trusted origins.
- Do not broadly trust all deployment preview domains.
- Add tests for allowed origins, rejected origins, development origins, and credential behavior.

CORS is not authorization. Every private endpoint must still authenticate the caller and enforce roles and resource ownership.

#### 2. Environment validation

Inspect `server/src/config/env.schema.ts` and every environment-variable access.

- Implement actual startup validation using the validator already installed or a small established schema library already in the dependency tree.
- Validate required variables, URL formats, enum values, numeric limits, key lengths, and production HTTPS requirements where appropriate.
- Require production secrets rather than falling back to fixed defaults.
- Only require provider-specific variables when that integration is enabled.
- Fail fast with safe, actionable messages. Never print secret values.
- Keep `.env.example` accurate and free of real credentials.

#### 3. Authentication and sessions

Inspect `server/src/auth/auth.ts`, the Next.js client API layer, and the admin API client.

- Remove hard-coded production authentication-secret fallbacks.
- Verify cookie flags, `HttpOnly`, `Secure`, `SameSite`, domain, path, expiration, session invalidation, and logout behavior.
- Check CSRF protections for cookie-authenticated state-changing requests.
- Review bearer-token storage. Do not move authentication to a new mechanism without tracing compatibility. Prefer secure HttpOnly cookies where the existing architecture supports them; document residual risk if the admin SPA requires bearer tokens.
- Ensure auth errors do not leak sensitive details.
- Test unauthenticated, expired-session, wrong-role, and cross-user access.

#### 4. Uploads and private file access

Inspect static upload serving, upload helpers, medical reports, and all download routes.

- Inventory what is stored in the upload directory and which database URLs depend on it.
- Identify public assets separately from private files.
- Private medical reports and other user-specific files must not be exposed by a public static route.
- Preserve legitimate public asset URLs and migrate them safely if needed.
- Enforce authentication, role/ownership checks, file size limits, safe filenames, and appropriate file-signature/content validation.
- Do not trust file extensions or client-provided MIME types alone.
- Prevent path traversal and unsafe file path construction.
- Avoid leaking filesystem paths or private information in errors/logs.
- Add tests proving one user cannot download another user's private file.
- Do not delete existing storage behavior until compatibility and migration requirements are understood.

#### 5. Object-level authorization

Build an endpoint/resource matrix for doctors, patients, appointments, reports, user profiles, Google connections, and admin operations.

For every sensitive operation, confirm:
- Authentication is required where appropriate.
- Role checks are enforced server-side.
- Resource ownership/tenant scope is verified.
- IDs supplied by the client cannot bypass authorization.
- Update operations cannot modify protected fields by mass assignment.
- Booking state transitions and scheduling conflict checks remain atomic where necessary.

Add regression tests for cross-user ID substitution and role escalation.

#### 6. Other security checks

Inspect and address as applicable:

- Login, registration, password reset, OTP/email verification, upload and expensive endpoint rate limiting.
- Rate-limit behavior across multiple instances/serverless deployment.
- HTML escaping in email templates and safe URL generation.
- OAuth state/CSRF validation, redirect allowlists, token encryption, connection ownership, and disconnect/revocation.
- Request validation and DTO whitelisting.
- Security headers and trusted proxy configuration.
- Structured logging with request/correlation IDs, redaction of tokens, secrets, medical data and sensitive request bodies.
- Consistent public error responses without stack traces, SQL details or filesystem paths.
- Dependency vulnerability review and compatible updates only.

Do not claim an issue exists unless source inspection or a test confirms it. Record findings by severity, evidence, impact, fix, and test.

### Phase 2 — Simplify the Next.js client API layer

Review `client/lib/api/`, `client/lib/cache/`, all feature API modules, query hooks, server components, and hydration boundaries.

Target responsibilities:

- **Browser transport:** one shared browser HTTP client with consistent headers, auth behavior, and error normalization.
- **Server transport:** one server-only transport that handles request-scoped cookies/auth correctly and applies explicit caching behavior.
- **Feature API functions:** small, named endpoint functions with feature-specific types.
- **Query hooks:** TanStack Query hooks and mutations only where client interactivity/cache management is needed.
- **Page boundary:** decides whether data should be server-rendered, cached/revalidated, or fetched in the browser.

Rules:

- Keep browser and server transports separate when their authentication/caching needs differ.
- Remove repeated response-envelope decoding and duplicate query-string logic where it can be centralized safely.
- Do not create an extra service, repository, factory, or wrapper for a function that simply forwards a request without adding meaningful behavior.
- Keep endpoint functions explicit and easy to search.
- Use consistent query-key conventions and invalidation.
- Preserve response types, errors, cookies, credentials, and API URLs.
- Do not create query hooks for every endpoint automatically; use them when query caching, mutations, or UI lifecycle makes them useful.
- Do not hydrate data that has no meaningful need for server prefetching.
- Avoid duplicate server fetch + client query fetches.
- Ensure server-only modules cannot be imported into browser bundles.

A simple endpoint function is preferred over unnecessary class-based architecture. Use `encodeURIComponent` or a URL utility for dynamic path segments and a query serializer for query parameters.

### Phase 3 — Apply clear SSR / ISR / CSR rules

Choose per page/data requirement, not by habit.

- **SSR/request-specific server rendering:** personalized or cookie-dependent initial data that must be fresh and private.
- **ISR/revalidation:** public content that can tolerate a defined stale window and is safe to share between users.
- **CSR/TanStack Query:** interactive tables, filters, pagination, mutations, rapidly changing data, and client-driven workflows.
- **Hybrid:** server-render initial data when useful, then use TanStack Query for subsequent interaction.

Mandatory cache rules:

- Never put patient data, medical reports, user-specific dashboard responses, session data, or other private responses in a shared cache.
- Verify the behavior of the actual installed Next.js version and its caching APIs. Do not copy version-specific examples blindly.
- Set explicit revalidation or no-store behavior where required.
- Use tags/on-demand invalidation only for data that is safe to cache.
- Keep hydrated query keys and data shapes consistent.
- Avoid duplicate fetches and stale availability for appointments.
- Document the rendering choice for important routes in `docs/engineering/RENDERING-AND-CACHING.md`.

### Phase 4 — Simplify the React/Vite admin

The admin is a client-side application. Do not add Next.js SSR/ISR infrastructure to it.

Use a straightforward feature-oriented structure, adapted to the existing code rather than imposed mechanically:

```text
admin/src/
  app/                 # providers, router, app setup
  components/
    common/             # genuinely reusable UI
    ui/                 # shared primitives
  features/
    auth/
    doctors/
    patients/
    appointments/
    reports/
    settings/
  lib/
    api/                # one shared API client
    auth/               # auth helpers
    query/              # shared query configuration
```

Feature files can be small:
- `api.ts` for named endpoint functions.
- `queries.ts` for useful query hooks/mutations.
- `types.ts` only when feature types need a separate home.
- `components/` for feature-specific UI.

Do not create all files for every feature if the feature does not need them.

- Centralize token/header behavior and error normalization.
- Preserve current authentication and API contracts.
- Standardize mutation notifications and cache invalidation where behavior is genuinely shared.
- Keep operation-specific invalidation explicit.
- Validate `VITE_API_URL` for production builds rather than silently using an empty base URL.
- Remove dead code only after checking all references and routes.

### Phase 5 — Simplify NestJS without weakening boundaries

Keep domain modules. Do not flatten the application into one controller/service.

Preferred responsibilities:

- **Controller:** HTTP boundary, DTOs, status codes, response contract.
- **Service:** business rules and orchestration.
- **Repository:** only when it encapsulates meaningful query complexity, transaction boundaries, or a useful testing seam.
- **DTO/schema:** validated input contracts.
- **Guards/decorators:** authentication and authorization.
- **Shared filters/interceptors:** cross-cutting behavior only.

Actions:

- Remove pass-through layers that add no behavior and have no architectural value.
- Reuse existing guards/decorators where semantics are identical.
- Keep scheduling, booking transitions, role assignment, ownership, and report-access rules explicit.
- Centralize error mapping and input validation without changing public error contracts unintentionally.
- Review Prisma transactions, concurrent booking conflicts, unique constraints, indexes, and database connection-pool sizing.
- Ensure database/auth clients are initialized and shut down correctly for the real deployment model.
- Avoid generic CRUD helpers that bypass domain-specific authorization or validation.

### Phase 6 — Reusable UI components

Create or retain common components only when they remove real duplication while preserving readability.

Good candidates:
- DataTable
- PageHeader
- ConfirmDialog
- FormField
- StatusBadge
- LoadingState
- EmptyState
- ErrorState

Prefer composition and typed props. Keep feature-specific columns, actions, permissions, validation, and business behavior inside their feature.

Do not build a giant universal page/component that handles all API calls, forms, dialogs, roles, tables, and business rules.

### Phase 7 — Remove dead code and unnecessary dependencies

Before removal:
- Search all imports, dynamic imports, route references, exports, tests, scripts, and runtime usage.
- Check whether a file is loaded by framework convention or configuration even if it has no direct import.
- Check whether a dependency is used in scripts, build configuration, or deployment.
- Remove only confirmed dead code.
- Update lockfiles with the repository's package manager.
- Do not perform broad dependency upgrades as part of unrelated cleanup.
- Keep a deletion/change log for risky removals.

## 4. Target structure (guidance, not a mandatory rewrite)

Keep the existing repository layout if it is already understandable. Improve it incrementally.

```text
client/
  app/
  components/
    common/
    ui/
  features/
    doctors/
    patients/
    appointments/
    reports/
    ...
  lib/
    api/
      client.ts
      server.ts
      errors.ts           # only if useful
    query/
    cache/                # only if needed for clear cache policy
  types/                  # only for genuinely shared types

admin/
  src/
    app/
    components/
      common/
      ui/
    features/
    lib/
      api/
      auth/
      query/

server/
  src/
    config/
    common/
      decorators/
      filters/
      guards/
      interceptors/
    auth/
    prisma/
    doctors/
    patients/
    appointments/
    reports/
    ...
```

Do not move files only to match this diagram. Move them when doing so makes ownership or imports clearer and the change is safe.

## 5. Testing and acceptance criteria

Do not mark work complete until all applicable criteria are checked.

### Build quality
- Run the documented build, lint, typecheck, and test commands for each application.
- Record exact commands and results.
- Separate pre-existing failures from regressions introduced by the work.
- Add regression tests for every security fix.
- Do not hide errors with `any`, `@ts-ignore`, blanket lint disables, or broad exception catches.

### Compatibility
- Existing routes and page behavior remain intact.
- Existing API URLs, request payloads, response shapes, and status codes remain intact unless a security change explicitly requires otherwise.
- Existing database records remain readable.
- Authentication, logout, role permissions, and session expiry continue to work.
- Google integration and its callback URLs continue to work.
- Appointment workflows, reports, uploads, notifications, and CMS behavior remain intact.
- SSR/ISR/CSR choices are verified against the actual route and data requirements.
- Private data is never shared between users through caching.

### Security
- Unapproved CORS origins are rejected.
- Missing/invalid required production environment variables stop startup safely.
- No hard-coded production auth secret remains.
- Cross-user resource access tests fail safely.
- Private uploads cannot be fetched without proper authorization.
- Rate limiting and input validation are active where required.
- Logs and errors do not expose secrets or sensitive data.

### Simplicity
- Repeated transport/error/envelope logic is centralized.
- No unnecessary wrapper or abstraction was added to replace another.
- Shared components are reusable without feature-specific conditional complexity.
- Dead code is removed only with evidence.
- Important business/security logic remains easy to locate and review.

## 6. Required deliverables

Create or update these documents in the repository:

1. `docs/engineering/BASELINE.md`
   - App inventory, scripts, dependencies, architecture map, baseline build/test results, known issues.

2. `docs/engineering/SECURITY-AUDIT.md`
   - Findings with severity, evidence (file/line), impact, remediation, tests, and residual risks.
   - Clearly distinguish confirmed issues from unverified risks.

3. `docs/engineering/ARCHITECTURE.md`
   - Final directory structure, ownership boundaries, API transport pattern, and rules for adding new features.

4. `docs/engineering/RENDERING-AND-CACHING.md`
   - When to use SSR, ISR, CSR, server fetch, TanStack Query, hydration, and cache invalidation; include privacy rules.

5. `docs/engineering/REFACTOR-LOG.md`
   - Changes by phase, removed abstractions/files and evidence they were unused, behavior-preservation notes, tests, and unresolved items.

6. `docs/engineering/PRODUCTION-READINESS.md`
   - Deployment checklist, required environment variables, security controls, health checks, logging, backups, monitoring, rollback, and known limitations.

7. `docs/engineering/AI-AGENT-REPORT.md`
   - Summary of files changed, rationale, before/after architecture, commands actually run and results, tests added, risks, and remaining work.

Do not write documentation claiming that unexecuted tests passed or unimplemented fixes are complete.

## 7. Execution strategy for coding agents

Work in separate, reviewable batches. If multiple agents are used, assign non-overlapping ownership:

- Agent A: repository discovery, baseline and architecture documentation.
- Agent B: backend security fixes and tests.
- Agent C: Next.js API/caching simplification.
- Agent D: admin API/UI simplification.
- Integrator: resolve conflicts, review shared contracts, run full regression tests, and update final documentation.

Agents must not concurrently edit the same files without coordination. The integrator must review every diff and reject changes that alter business behavior without an explicit reason.

Recommended order:
1. Baseline and threat model.
2. Confirmed security fixes.
3. Security regression tests.
4. API transport simplification.
5. Rendering/cache simplification.
6. Admin and shared component cleanup.
7. Backend abstraction cleanup.
8. Dead-code/dependency cleanup.
9. Full regression verification and final report.

If the repository is too large for one pass, stop after a complete phase, report the exact state, and continue in the next pass. Do not claim the entire repository was reviewed if only a subset was inspected.

## 8. Definition of done

The work is done only when:
- All three apps have been inspected.
- Confirmed critical/high security findings are fixed or documented with a clear blocker and mitigation.
- Existing product behavior is preserved and tested.
- Builds and relevant tests are run and reported honestly.
- The codebase is demonstrably simpler, with no unnecessary abstraction introduced.
- All seven required engineering documents are present and accurate.
- The final report lists changed files, verification results, unresolved risks, and deployment cautions.

**Final instruction to the AI agent:** First understand the current system. Then make the smallest safe change that solves the verified problem. Prefer boring, explicit, production-tested patterns over clever abstractions. Security and behavior preservation take precedence over code reduction.
