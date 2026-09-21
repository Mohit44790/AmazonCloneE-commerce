// src/routes/adminRoutes.jsx
import { lazy } from "react";
import ProtectedRoute from "../ProtectedRoute";
import AdminLayout    from "../pages/admin/AdminLayout";

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const CreateProducts = lazy(() => import("../pages/admin/products/CreateProducts"));
const GetAllProducts = lazy(() => import("../pages/admin/products/GetAllProducts"));
const UpdateProducts = lazy(() => import("../pages/admin/products/UpdateProducts"));
const Category       = lazy(() => import("../pages/admin/category/Category"));
const Purchase       = lazy(() => import("../pages/admin/products/Purchase"));
const Shipping       = lazy(() => import("../pages/admin/products/Shipping"));
const Customers      = lazy(() => import("../pages/admin/products/Customers"));
const AdminSetting   = lazy(() => import("../pages/admin/products/AdminSetting"));

export const adminRoutes = {
  path: "/admin",
  element: <ProtectedRoute adminOnly />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true,                       element: <AdminDashboard /> },
        { path: "create-product",            element: <CreateProducts /> },
        { path: "products",                  element: <GetAllProducts /> },
        { path: "category",                  element: <Category />       },
        { path: "update-product/:id",        element: <UpdateProducts /> },
        { path: "purchase",                  element: <Purchase />       },
        { path: "shipping",                  element: <Shipping />       },
        { path: "customers",                 element: <Customers />      },
        { path: "settings",                  element: <AdminSetting />   },
      ],
    },
  ],
};