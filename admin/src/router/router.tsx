import { createBrowserRouter, Navigate } from "react-router-dom"
import PublicLayout from "../layout/PublicLayout"
import AdminLayout from "../layout/AdminLayout"
import Home from "../pages/sites/Home"
import Login from "../pages/sites/Login"
import ForgotPassword from "../pages/sites/ForgotPassword"
import ResetPassword from "../pages/sites/ResetPassword"
import Dashboard from "../pages/admin/Dashboard"
import Settings from "../pages/admin/Settings"
import ComponentsShowcase from "../pages/admin/ComponentsShowcase"

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "/dashboard",
    element: <AdminLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      
      // Settings sub-routes
      { path: "/dashboard/settings", element: <Navigate to="/dashboard/settings/profile" replace /> },
      { path: "/dashboard/settings/profile", element: <Settings /> },
      { path: "/dashboard/settings/security", element: <Settings /> },
      
      // Components Showcase route
      { path: "/dashboard/showcase", element: <ComponentsShowcase /> },
      
      // Redirect any mismatch in dashboard to dashboard root
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])

export default router
