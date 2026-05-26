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
          { index: true,             element: <AdminDashboard /> },
          { path: "create-product",  element: <CreateProducts />  },
          { path: "all-products",        element: <GetAllProducts />     },
          { path: "category",        element: <Category />        },
         
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;