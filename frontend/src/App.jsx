import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./component/Layout";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import CreateProducts from "./pages/admin/products/CreateProducts";
import GetProducts from "./pages/admin/products/GetProducts";
import Category from "./pages/admin/category/Category";

const router = createBrowserRouter([
  { path: "/login", element: <Register /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true,element: <AdminDashboard /> },
      { path:"/create-product" ,element:<CreateProducts/>},
      {path:"/getAllProducts" ,element:<GetProducts/>},
      {path:"/category",element:<Category/>}


  
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;