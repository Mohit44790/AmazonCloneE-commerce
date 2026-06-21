import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./component/Layout";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import CreateProducts from "./pages/admin/products/CreateProducts";
import GetAllProducts from "./pages/admin/products/GetAllProducts";
import Category from "./pages/admin/category/Category";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "./apiData/store/authStore";
import { useEffect } from "react";
import UpdateProducts from "./pages/admin/products/UpdateProducts";

const router = createBrowserRouter([
  { path: "/login", element: <Register /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  // Admin routes — protected, admin only
  {
    path: "/admin",
    element: <ProtectedRoute adminOnly />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "create-product",element: <CreateProducts />  },
          { path: "products",element: <GetAllProducts />     },
          { path: "category",element: <Category />        },
          { path: "admin/update-product/:id", element: <UpdateProducts />},
         
        ],
      },
    ],
  },
]);

function App() {
   const hydrate = useAuthStore(
    (state) => state.hydrate
  );

  useEffect(() => {
    hydrate();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;