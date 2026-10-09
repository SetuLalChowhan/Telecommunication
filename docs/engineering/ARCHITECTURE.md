# System Architecture & Clean Separation Model

**Project:** Telecommunication Platform  
**Target:** Unified 3-Tier Web Architecture  
**Date:** October 2026  

---

## 1. High-Level Architectural Diagram

```
+-------------------------------------------------------------------------+
|                              END USERS                                  |
|     Patients / Doctors (Web Client)        Hospital Admins (SPA)        |
+-------------------------------------------------------------------------+
                               |                                 |
                               v                                 v
                +------------------------------+  +-------------------------------+
                |     Next.js 16 Web Client    |  |     React 19 / Vite Admin     |
                |  (SSR / ISR / CSR Hybrid)    |  |       (Client-Side SPA)       |
                |   Port: 3000 / Vercel Edge   |  |   Port: 5173 / Vercel Static  |
                +------------------------------+  +-------------------------------+
                               |                                 |
                               +----------------+----------------+
                                                |
                                                v
                               +----------------------------------+
                               |     NestJS 12 API Backend        |
                               | (Express 5 / Better Auth / Guard)|
                               |   Port: 5000 / Vercel Serverless |
                               +----------------------------------+
                                                |
                                                v
                               +----------------------------------+
                               |     Prisma ORM & PostgreSQL      |
                               |  (@prisma/adapter-pg / Neon DB)  |
                               +----------------------------------+
```

---

## 2. Layer Responsibilities & Transport Standards

### A. Next.js Client (`client/`)
- **Server Transport (`client/lib/api/server.ts`):** 
  - Uses `server-only` to prevent bundling into client code.
  - Automatically captures incoming request cookies via Next.js `cookies()` store and passes them upstream.
  - Exposes `serverFetch`, `serverGet`, and `serverGetPage` for clean unwrapping.
- **Browser Transport (`client/lib/api/client.ts`):**
  - Canonical Axios instance configured with `withCredentials: true`.
  - Attaches `Authorization: Bearer <token>` from `localStorage` if present.
  - Captures `set-auth-token` headers from Better Auth responses.
  - Exposes `http.get`, `http.post`, `http.patch`, `http.put`, `http.delete` helpers.
- **Auth Client (`client/features/auth/api/client.ts`):**
  - Better Auth React client linked to the canonical API endpoint with bearer token injection.

### B. React/Vite Admin (`admin/`)
- Pure client-side application.
- Uses TanStack Query for all server-state caching, optimistic updates, and background refetching.
- Communicates via `Authorization: Bearer <token>` session tokens.

### C. NestJS Backend (`server/`)
- **Controllers:** HTTP boundary handling route parameters, query validation, and standard HTTP status codes.
- **Services:** Pure business domain rules (appointment booking state transitions, availability calculations, slug generation).
- **Guards & Decorators:** Role-based access control (`@Roles('DOCTOR', 'ADMIN')`) and Better Auth session resolution.
- **Interceptors & Filters:** `TransformInterceptor` outputs uniform JSON `{ success: true, data, meta }`, and `HttpExceptionFilter` formats all exceptions.
