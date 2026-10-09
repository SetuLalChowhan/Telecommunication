# Production Readiness & Deployment Checklist

**Project:** Telecommunication Platform  
**Date:** October 2026  

---

## 1. Environment Variables Checklist

### Backend (`server/`)
- `DATABASE_URL`: PostgreSQL connection string with SSL (`?sslmode=require`).
- `BETTER_AUTH_SECRET`: Secret string (min 32 chars) for Better Auth signing.
- `BETTER_AUTH_URL`: Canonical backend URL (e.g. `https://telecommunication-beta.vercel.app`).
- `CLIENT_URL`: Canonical frontend URL (e.g. `https://telecommunication-sy4h.vercel.app`).
- `TRUSTED_ORIGINS`: Comma-separated allowed frontend origins.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: OAuth credentials (optional).
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`: Media storage (optional).
- `EMAIL_HOST` / `EMAIL_USER` / `EMAIL_PASS`: SMTP credentials for password reset & email verification (optional).

### Frontend (`client/`)
- `NEXT_PUBLIC_API_URL` (or `NEXT_PRIVATE_API_URL`): Pointing to the backend URL (e.g. `https://telecommunication-beta.vercel.app`).
- `NEXT_PUBLIC_CLIENT_URL` (or `NEXT_PRIVATE_APP_URL`): Pointing to the frontend URL (e.g. `https://telecommunication-sy4h.vercel.app`).
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID (optional).

### Admin (`admin/`)
- `VITE_API_URL`: Backend URL (e.g. `https://telecommunication-beta.vercel.app`).

---

## 2. Security & Operational Controls

- **HTTPS Only:** Production URLs must use HTTPS.
- **Database Pooling:** Managed via Neon PostgreSQL / `pg.Pool` with connection timeout handling.
- **Health Checks:** `/health` endpoint available on the backend to monitor system status.
- **Swagger Documentation:** Available on `/api/docs` in non-production environments.
- **Rollback Procedure:** Vercel instant rollback available via git commit revert or dashboard rollback.
