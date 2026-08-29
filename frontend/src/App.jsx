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
import Clothing from "./pages/womenfashion/womenClothing/clothing/Clothing";
import Purchase from "./pages/admin/products/Purchase";
import Shipping from "./pages/admin/products/Shipping";
import EthnicWear from "./pages/womenfashion/womenClothing/ethinicWear/EthnicWear";
import WesternWear from "./pages/womenfashion/womenClothing/westernWear/WesternWear";
import LingerieNightwear from "./pages/womenfashion/womenClothing/LingerieAndNightwear/LingerieNightwear";
import TopBrands from "./pages/womenfashion/womenClothing/TopBrands/TopBrands";
import Sportswear from "./pages/womenfashion/womenClothing/clothing/sportswear/Sportswear";
import Lingerie from "./pages/womenfashion/womenClothing/clothing/lingerie/Lingerie";
import SleepLoungeWear from "./pages/womenfashion/womenClothing/clothing/sleepLoungeWear/SleepLoungeWear";
import Blouses from "./pages/womenfashion/womenClothing/ethinicWear/Blouses";
import BottomWear from "./pages/womenfashion/womenClothing/ethinicWear/BottomWear";
import ChunnisDupattas from "./pages/womenfashion/womenClothing/ethinicWear/ChunnisDupattas";
import DressMaterial from "./pages/womenfashion/womenClothing/ethinicWear/DressMaterial";
import Gowns from "./pages/womenfashion/womenClothing/ethinicWear/Gowns";
import KurtasKurtis from "./pages/womenfashion/womenClothing/ethinicWear/KurtasKurtis";
import LehengaCholis from "./pages/womenfashion/womenClothing/ethinicWear/LehengaCholis";
import Sarees from "./pages/womenfashion/womenClothing/ethinicWear/Sarees";
import ProductListing from "./pages/customerpage/ProductListing";
import ProductDetail from "./pages/customerpage/ProductDetail";
import Cart from "./pages/customerpage/Cart";
import MyOrders from "./pages/customerpage/MyOrders";

const router = createBrowserRouter([
  { path: "/login", element: <Register /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      
      { path: "products/:id",      element: <ProductDetail /> },
      { path: "cart",              element: <Cart /> },
      { path: "my-orders",         element: <MyOrders /> },
      {path:"/women/clothing",element:<Clothing/>},
      {path:"/women/ethnic-wear", element:<EthnicWear/>},
      {path:"/women/westernwear",element:<WesternWear/>},
      {path:"/women/lingere&nightwear",element:<LingerieNightwear/>},
      {path:"/women/topbrands" , element:<TopBrands/>},
      {path:"/women/clothing/sports-wear" , element:<Sportswear/>},
      {path:"/women/clothing/lingerie", element:<Lingerie/>},
      {path:"/women/clothing/sleep-lounge-wear",element:<SleepLoungeWear/>},
      {path:"/womenfashion/womenClothing/ethinicWear/blouses", element:<Blouses/>},
      {path:"/womenfashion/womenClothing/ethinicWear/Bottoms-wear",element:<BottomWear/>},
      {path:"/womenfashion/womenClothing/ethinicWear/Chunnis-Dupattas",element:<ChunnisDupattas/>},
      {path:"/womenfashion/womenClothing/ethinicWear/Dress-Material",element:<DressMaterial/>},
      {path:"/womenfashion/womenClothing/ethinicWear/Gowns",element:<Gowns/>},
      {path:"/womenfashion/womenClothing/ethinicWear/Kurtas-Suits",element:<KurtasKurtis/>},
      {path:"/womenfashion/womenClothing/ethinicWear/Lehenga-Cholis",element:<LehengaCholis/>},
      {path:"/womenfashion/womenClothing/ethinicWear/Sarees",element:<Sarees/>},
      {path:"products",element:<ProductListing/>}
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
          { path: "/admin/update-product/:id", element: <UpdateProducts />},
          { path: "/admin/purchase", element: <Purchase />},
          { path: "/admin/shipping", element: <Shipping />},
         
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