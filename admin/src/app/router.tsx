import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { FullPageSpinner } from "@/components/common/States";
import AdminLayout from "@/layout/AdminLayout";
import PublicLayout from "@/layout/PublicLayout";
import { RequireAuth, RequireRole } from "@/routes/guards";

const Home = lazy(() => import("@/pages/sites/Home"));
const Login = lazy(() => import("@/pages/sites/Login"));
const ForgotPassword = lazy(() => import("@/pages/sites/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/sites/ResetPassword"));
const Unauthorized = lazy(() => import("@/pages/sites/Unauthorized"));

const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Doctors = lazy(() => import("@/pages/admin/Doctors"));
const DoctorDetails = lazy(() => import("@/pages/admin/DoctorDetails"));
const Patients = lazy(() => import("@/pages/admin/Patients"));
const PatientDetails = lazy(() => import("@/pages/admin/PatientDetails"));
const Appointments = lazy(() => import("@/pages/admin/Appointments"));
const Reviews = lazy(() => import("@/pages/admin/Reviews"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const ComponentsShowcase = lazy(() => import("@/pages/admin/ComponentsShowcase"));

// The component showcase is a development-only reference page and must not be
// reachable (or bundled into navigation) in a production build.
const isDev = import.meta.env.DEV;

const withSuspense = (node: ReactNode) => (
  <Suspense fallback={<FullPageSpinner />}>{node}</Suspense>
);

/**
 * Admin routes.
 *
 * Access control is applied once, at the layout boundary, rather than in every
 * page. The `/dashboard/*` prefix is preserved from the existing app — changing
 * it to `/admin/*` would break existing links for no functional gain.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(<Home />) },
      { path: "login", element: withSuspense(<Login />) },
      { path: "forgot-password", element: withSuspense(<ForgotPassword />) },
      { path: "reset-password", element: withSuspense(<ResetPassword />) },
      { path: "unauthorized", element: withSuspense(<Unauthorized />) },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <RequireRole role="ADMIN">
          <AdminLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: "doctors", element: withSuspense(<Doctors />) },
      { path: "doctors/:id", element: withSuspense(<DoctorDetails />) },
      { path: "patients", element: withSuspense(<Patients />) },
      { path: "patients/:id", element: withSuspense(<PatientDetails />) },
      { path: "appointments", element: withSuspense(<Appointments />) },
      { path: "reviews", element: withSuspense(<Reviews />) },
      { path: "settings", element: <Navigate to="/dashboard/settings/profile" replace /> },
      { path: "settings/:tab", element: withSuspense(<Settings />) },
      ...(isDev ? [{ path: "showcase", element: withSuspense(<ComponentsShowcase />) }] : []),
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;
