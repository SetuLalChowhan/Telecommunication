# Engineering Baseline Document

**Project:** Telecommunication Platform  
**Target Applications:** Next.js Client, React/Vite Admin, NestJS Server  
**Date:** October 2026  
**Status:** Verified  

---

## 1. Application Inventory & Framework Mapping

### A. Server (`server/`)
- **Framework:** NestJS 12.x on Express 5.x
- **ORM & Database:** Prisma ORM 7.x with `@prisma/adapter-pg` connecting to PostgreSQL (Neon Serverless).
- **Authentication Engine:** Better Auth with Prisma adapter, Bearer plugin, and OneTap plugin.
- **Security & Utilities:** Helmet, Express Rate Limit, NestJS ValidationPipe with class-validator/class-transformer.
- **Deployment:** Vercel Serverless Function (`src/serverless.ts`) and Node.js process (`src/main.ts`).
- **Build Command:** `npm run build` (`npx prisma generate && npx nest build`).

### B. Client (`client/`)
- **Framework:** Next.js 16.2.x (Turbopack, App Router).
- **Styling:** Tailwind CSS with Lucide icons and Radix UI primitives.
- **Data Fetching:** 
  - Server Transport: `client/lib/api/server.ts` (`serverFetch`, `serverGet`, `serverGetPage` forwarding cookies).
  - Browser Transport: `client/lib/api/client.ts` (`apiClient` Axios instance with Bearer token interceptor).
  - Auth Client: `client/features/auth/api/client.ts` (`better-auth/react`).
- **Build Command:** `npm run build` (`next build`).

### C. Admin Console (`admin/`)
- **Framework:** React 19.x with Vite 7.x.
- **Routing & State:** React Router 7.x, TanStack Query 5.x.
- **Build Command:** `npm run build` (`tsc -b && vite build`).

---

## 2. Baseline Test & Build Status

| Application | Build Command | Baseline Status | Notes |
|---|---|---|---|
| **Server** | `npm run build` in `server/` | ✅ PASS | Prisma client generated, NestJS TypeScript compiled with 0 errors. |
| **Client** | `npm run build` in `client/` | ✅ PASS | 37 static & dynamic routes compiled with 0 errors. |
| **Admin** | `npm run build` in `admin/` | ✅ PASS | TypeScript typecheck and Vite production bundle generated cleanly. |

---

## 3. Inventory of Critical Functional Flows

1. **Authentication & Session Lifecycle:**
   - Email/password registration, login, email verification, password reset.
   - Cross-domain cookie support via `sameSite: 'none'`, `secure: true`, and `Authorization: Bearer <token>` fallback in `localStorage`.
   - Google One-Tap & OAuth integration.
2. **Clinical Doctor Operations:**
   - Doctor directory, public profile (`/doctors/[idOrSlug]`), specialty filtering.
   - Doctor dashboard, schedule/availability configuration, days off, patient list.
3. **Patient Experience:**
   - Appointment booking flow, payment status tracking, medical record uploads.
   - Patient consultation lobby, prescription view, notifications.
4. **Content & Administration:**
   - CMS section storage and dynamic homepage rendering with hard-coded fallbacks.
   - Blog publishing, category filtering, and featured articles.
   - Admin verification of doctors, patient management, and system metrics.

---

## 4. Key Architectural Risks Identified & Addressed

1. **Serverless Bootstrap Crashes:** Strict schema validation in production previously aborted server startup when optional variables were omitted. Replaced with resilient defaults and non-fatal logging.
2. **Cross-Site Origin Mismatches:** Dynamic origin matching ensures preview deployments, custom domains, and localhost environments authenticate seamlessly without CORS blocks.
3. **RSC Failure Propagation:** Server component data fetchers on the homepage now have graceful fallback mechanisms preventing Next.js 500 render errors when upstream services are unreachable.
