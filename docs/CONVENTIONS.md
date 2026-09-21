# Code Conventions & Engineering Standards

**Repository:** `Telecommunication`  
**Last Updated:** 2026-09-21  

---

## 1. Backend Engineering Rules (`server/`)

1. **Native ESM Mandatory**:
   - The backend runs on Native ESM (`"type": "module"` in `package.json`).
   - Every relative import **MUST** include the `.js` file extension:
     ```typescript
     // Correct
     import { UsersRepository } from './users.repository.js';
     import { createPaginationMeta } from '../common/pagination/pagination.utils.js';

     // Forbidden (will fail runtime execution)
     import { UsersRepository } from './users.repository';
     ```

2. **Repository Decoupling**:
   - **Zero Prisma access in Services:** `PrismaService` must only be injected into `*.repository.ts` files.
   - Services interact strictly with domain repositories (`this.repo.findX(...)`, `this.repo.create(...)`).

3. **Transaction Management**:
   - Transactions requiring multi-table atomic updates should be delegated to repository transaction helpers (`this.repo.runTransaction(async (tx) => ...)`) or atomic repository transaction methods.

4. **150-Line Guideline**:
   - Keep controllers, services, and repositories focused. When logic grows, split into sub-services, domain helpers, or strategy classes rather than accumulating monolithic files.

---

## 2. Frontend Engineering Rules (`client/`)

1. **No Direct HTTP in UI Components**:
   - React components (`*.tsx`) must never directly import `axios` or execute raw `fetch()` calls.
   - All data fetching and mutations must use TanStack Query hooks defined in `features/*/api/queries.ts` or `features/*/hooks/`.

2. **Server / Client Component Separation**:
   - Use Server Components (`page.tsx`) for prefetching data using `prefetchQuery()` and hydrating via `<HydrationBoundary>`.
   - Mark interactive UI files with `'use client'` at the top and encapsulate state/events.

3. **Loading & Error Boundaries**:
   - Every route directory must provide a matching `loading.tsx` and `error.tsx`.
   - `error.tsx` must be a client component (`'use client'`) receiving `{ error, reset }`.

4. **Type Safety & Mock Data Separation**:
   - No mock fixtures should be imported into production paths.
   - Types must reside in `features/*/types.ts` or shared contract interfaces.

---

## 3. Testing Conventions

1. **Vitest Unit & Integration Tests**:
   - Unit tests use mock repositories and services to verify business logic and error handling in isolation.
   - Characterization tests ensure status transition invariants and slot calculations remain stable against regressions.
   - Test files are named `*.spec.ts` or `*.characterization.spec.ts`.
