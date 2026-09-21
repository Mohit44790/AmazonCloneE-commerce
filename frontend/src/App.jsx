// src/App.jsx
import { Suspense, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy } from "react";

import { useAuthStore }  from "./apiData/store/authStore";
import { adminRoutes }   from "./routes/adminRoutes";
import { customerRoutes } from "./routes/customerRoutes";
import { womenRoutes }   from "./routes/womenRoutes";

const Layout   = lazy(() => import("./component/Layout"));
const Register = lazy(() => import("./pages/auth/Register"));

/* ── Full-page loading spinner ── */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-10 h-10 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin"/>
  </div>
);

/* ════════════════════════════════════════
   ROUTER — composed from route modules
════════════════════════════════════════ */
const router = createBrowserRouter([

  // Auth
  { path: "/login", element: <Register /> },

  // Public + Customer routes
  {
    path: "/",
    element: <Layout />,
    children: [
      ...customerRoutes,
      ...womenRoutes,
    ],
  },

  // Admin routes (protected)
  adminRoutes,
]);

/* ════════════════════════════════════════
   APP
════════════════════════════════════════ */
export default function App() {
  const hydrate = useAuthStore(s => s.hydrate);

  // Restore session from httpOnly cookie on every page load
  useEffect(() => {
    hydrate();
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}