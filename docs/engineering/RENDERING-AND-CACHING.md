# Rendering & Caching Policy

**Project:** Telecommunication Platform  
**Scope:** Next.js App Router (Client) & TanStack Query (Admin/Client)  
**Date:** October 2026  

---

## 1. Decision Matrix: When to Use SSR, ISR, and CSR

| Page / Route Category | Rendering Strategy | Caching Behavior | Rationale |
|---|---|---|---|
| **Public Landing (`/`, `/about`, `/privacy`, `/terms`)** | **Dynamic SSR / ISR** | Cached with periodic revalidation / CMS fallback | Public marketing content; fast TTFB with fallback on outage. |
| **Doctor Directory (`/doctors`)** | **Dynamic SSR + CSR Filtering** | Dynamic server fetch + client query cache | Fresh doctor list with interactive specialty, rating, and fee filters. |
| **Doctor Profile (`/doctors/[idOrSlug]`)** | **Dynamic SSR** | Revalidated public profile | High SEO value for doctor profiles; availability fetched on-demand. |
| **Blog Articles (`/blogs`, `/blogs/[slug]`)** | **ISR (On-Demand)** | Cached with tag invalidation | Public articles rarely change; ISR minimizes backend database load. |
| **Doctor & Patient Dashboards** | **CSR + Route Guards** | `no-store` / Private | Highly confidential clinical data; authenticated per session. |
| **Appointment Booking & Video Consultation** | **CSR (TanStack Query)** | `no-store` / Real-Time | State transitions must be strictly real-time to avoid double-booking. |

---

## 2. Privacy & Shared Cache Safety Rules

1. **Strict No-Store for Confidential Data:**
   - Patient records, medical report URLs, lab test results, prescription data, and appointment slots are **never** stored in public or CDN caches.
2. **Cookie-Aware Server Fetching:**
   - Server-side calls that carry authentication cookies must never be cached globally across multiple users.
3. **Hard-coded Fallbacks for Critical Public Sections:**
   - Homepage CMS sections and specialty carousels fall back to built-in default copy if the CMS API is temporarily unreachable, ensuring 100% uptime for end users.
