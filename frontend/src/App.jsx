import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./component/Layout";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";

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
    path: "/adminDashboard",
    element: <AdminLayout />,
    children: [
      { index: true,              element: <AdminDashboard /> },
  
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;