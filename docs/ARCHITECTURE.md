# System Architecture & Technical Design Blueprint

**Repository:** `Telecommunication` (Monorepo: `server/`, `client/`, `admin/`)  
**Last Updated:** 2026-09-21  
**Status:** Production Standard  

---

## 1. Monorepo Overview

The Telemedicine platform is structured into three distinct applications within a unified monorepo:

```
c:\Setu\2026\Tele\
├── server/          # NestJS 12 REST API + Native ESM + Prisma 7 ORM
├── client/          # Next.js 16.2 App Router Web Application (Patients & Doctors)
├── admin/           # Vite 7 + React 19 SPA (Administrative Portal)
├── docs/            # Architecture specifications, OpenAPI contracts, system design
└── templates/       # Boilerplate scaffolding templates for new modules & features
```

---

## 2. Backend Architecture (`server/`)

The backend follows a strict **3-Layer Domain Architecture** with clear separation of concerns and dependency inversion:

```mermaid
graph TD
    Client[HTTP Client / Frontend] -->|REST / JSON| Controller[1. Controller Layer]
    Controller -->|DTO Validation / Guards| Service[2. Service Layer (Domain Logic)]
    Service -->|Data Access Methods| Repository[3. Repository Layer (Database Access)]
    Repository -->|Prisma Client Queries| DB[(Neon PostgreSQL)]
    Service -.->|File Storage| Cloudinary[Cloudinary Service]
    Service -.->|OAuth & Calendar| Google[Google Service]
    Service -.->|Transfers| Email[Email / Notification Service]
```

### 2.1 Layer Responsibilities

1. **Controller Layer (`*.controller.ts`)**:
   - Handles HTTP routing, path parameters, query parameters, request bodies.
   - Applies decorators: `@UseGuards(AuthGuard, RolesGuard)`, `@Roles(Role.DOCTOR)`, `@UseInterceptors(FileInterceptor)`.
   - Validates incoming payloads using `class-validator` DTOs via the global `ValidationPipe`.
   - **Rule:** Never contains database queries or domain business logic.

2. **Service Layer (`*.service.ts`)**:
   - Encapsulates pure domain logic, workflow orchestration, status transitions, validations, and authorization business rules.
   - Coordinates multi-step operations and database transactions through repository methods.
   - Orchestrates third-party side effects (Cloudinary file uploads, Google Meet links, email dispatches).
   - **Rule:** Never imports `PrismaService` or executes raw queries directly.

3. **Repository Layer (`*.repository.ts`)**:
   - Sole owner of database interactions and `@prisma/client` queries.
   - Standardizes query shapes, includes, selects, filtering, sorting, and pagination offset calculation (`getPaginationParams`).
   - Handles transaction scopes via `prisma.$transaction`.
   - **Rule:** Zero HTTP logic, zero business validation throwing HTTP exceptions.

4. **Module Layer (`*.module.ts`)**:
   - Declares and encapsulates module dependencies (`imports`, `controllers`, `providers`, `exports`).
   - Always exports both the Service and Repository providers for clean cross-module dependency injection.

---

## 3. Frontend Architecture (`client/`)

The Next.js client application follows a **Feature-Sliced Architecture** with strict separation between UI rendering and data fetching:

```
client/
├── app/                     # App Router pages and route layouts
│   ├── (auth)/              # Authentication route group (login, register, forgot-password)
│   ├── (doctor)/doctor/     # Doctor portal route group (dashboard, appointments, patients, schedule, settings)
│   ├── (patient)/patient/   # Patient portal route group (dashboard, appointments, records, profile, settings)
│   └── (site)/              # Public website (doctors directory, specialties, blogs, about)
├── features/                # Domain-driven feature modules
│   ├── appointments/        # Booking flows, scheduling hooks, calendar UI
│   ├── auth/                # Session hooks, Better-Auth integration
│   ├── blogs/               # Articles list, blog reader, categories
│   ├── doctors/             # Doctor cards, directory, registry, profile forms
│   ├── medical-reports/     # File uploads, report viewer, prescriptions
│   ├── notifications/       # Toast listeners, notification dropdown
│   ├── patients/            # Patient profile forms, health records
│   └── specialties/         # Specialty cards, filter pills
├── components/              # Shared design system components & shadcn/ui primitives
└── lib/                     # Global utilities, API client, TanStack Query provider
```

### 3.1 Route Boundaries & UX Resilience
Every route directory implements:
- `loading.tsx`: Pre-rendered skeleton state preventing cumulative layout shift (CLS).
- `error.tsx`: Client-side error boundary catching unhandled rendering/runtime exceptions with a retry trigger (`reset()`).

---

## 4. Cross-Cutting Concerns

1. **Authentication & Authorization**:
   - Powered by **Better-Auth** (`@thallesp/nestjs-better-auth`) with session persistence in PostgreSQL.
   - Role-Based Access Control (RBAC) via `@Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)`.

2. **Standardized Error Handling**:
   - `HttpExceptionFilter`: Captures all exceptions, formatting standard RFC-compliant JSON responses:
     ```json
     {
       "statusCode": 400,
       "error": "BAD_REQUEST",
       "message": "Detailed description of error",
       "timestamp": "2026-09-21T14:00:00.000Z",
       "path": "/api/v1/..."
     }
     ```

3. **Standardized Pagination**:
   - `PaginationDto` (`page`, `limit`) parsed with `getPaginationParams(page, limit)`.
   - `createPaginationMeta(page, limit, total)` emits standardized pagination metadata:
     ```json
     {
       "page": 1,
       "limit": 10,
       "total": 42,
       "totalPages": 5,
       "hasNextPage": true,
       "hasPreviousPage": false
     }
     ```
