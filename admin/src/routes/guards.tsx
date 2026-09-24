import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { FullPageSpinner } from "@/components/common/States";
import { useSession } from "@/features/auth/api/auth.queries";
import type { Role } from "@/features/auth/types";

/**
 * Centralized route protection. Pages never perform their own auth checks.
 *
 * Expected flow:
 *   unauthenticated        -> /login
 *   authenticated non-admin -> /unauthorized
 *   authenticated admin     -> the requested dashboard route
 *
 * The server remains the authorization authority; these guards only shape the
 * navigation experience.
 */

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isPending } = useSession();
  const location = useLocation();

  if (isPending) {
    return <FullPageSpinner label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, isPending } = useSession();

  if (isPending) {
    return <FullPageSpinner label="Checking permissions…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
