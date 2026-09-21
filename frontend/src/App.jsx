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
import TopsTshirts from "./pages/womenfashion/womenClothing/westernWear/topsTshirts/TopsTshirts";
import Customers from "./pages/admin/products/Customers";
import Moods from "./pages/customerpage/Moods";
import AdminSetting from "./pages/admin/products/AdminSetting";
import Tshirts from "./pages/womenfashion/womenClothing/westernWear/topsTshirts/Tshirts";
import Shirts from "./pages/womenfashion/womenClothing/westernWear/topsTshirts/Shirts";
import Polos from "./pages/womenfashion/womenClothing/westernWear/topsTshirts/Polos";
import ButtonDownshirt from "./pages/womenfashion/womenClothing/westernWear/topsTshirts/ButtonDownshirt";
import DressesJumpsuits from "./pages/womenfashion/womenClothing/westernWear/dressesJumpsuits/DressesJumpsuits";
import Dresses from "./pages/womenfashion/womenClothing/westernWear/dressesJumpsuits/Dresses";
import Jumpsuits from "./pages/womenfashion/womenClothing/westernWear/dressesJumpsuits/Jumpsuits";
import Trousers from "./pages/womenfashion/womenClothing/westernWear/Trousers";
import JeansJeggings from "./pages/womenfashion/womenClothing/westernWear/JeansJeggings";
import SkirtsShorts from "./pages/womenfashion/womenClothing/westernWear/skirtsShorts/SkirtsShorts";
import Skirts from "./pages/womenfashion/womenClothing/westernWear/skirtsShorts/Skirts";
import Shorts from "./pages/womenfashion/womenClothing/westernWear/skirtsShorts/Shorts";
import Shrugs from "./pages/womenfashion/womenClothing/westernWear/Shrugs";
import Leggings from "./pages/womenfashion/womenClothing/westernWear/skirtsShorts/Leggings";
import ActiveDresses from "./pages/womenfashion/womenClothing/clothing/sportswear/ActiveDresses";
import AthleticSocks from "./pages/womenfashion/womenClothing/clothing/sportswear/athleticSocks/AthleticSocks";
import Vests from "./pages/womenfashion/womenClothing/clothing/sportswear/Vests";
import Innerwear from "./pages/womenfashion/womenClothing/clothing/sportswear/innerwear/Innerwear";
import Sets from "./pages/womenfashion/womenClothing/clothing/sportswear/sets/Sets";
import ShirtTees from "./pages/womenfashion/womenClothing/clothing/sportswear/shirtsTees/ShirtTees";
import SweatshirtsHoodies from "./pages/womenfashion/womenClothing/clothing/sportswear/SweatshirtsHoodies";
import TrackJackets from "./pages/womenfashion/womenClothing/clothing/sportswear/TrackJackets";
import BaseLayersCompression from "./pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/BaseLayersCompression";
import SkirtsSkorts from "./pages/womenfashion/womenClothing/clothing/sportswear/skirtsSkorts/SkirtsSkorts";
import SportShorts from "./pages/womenfashion/womenClothing/clothing/sportswear/SportShorts";
import SportLeggings from "./pages/womenfashion/womenClothing/clothing/sportswear/SportLeggings";
import SportTrousers from "./pages/womenfashion/womenClothing/clothing/sportswear/SportTrousers";
import AnkleSocks from "./pages/womenfashion/womenClothing/clothing/sportswear/athleticSocks/AnkleSocks";
import CrewSocks from "./pages/womenfashion/womenClothing/clothing/sportswear/athleticSocks/CrewSocks";
import KneeHighSock from "./pages/womenfashion/womenClothing/clothing/sportswear/athleticSocks/KneeHighSock";
import Briefs from "./pages/womenfashion/womenClothing/clothing/sportswear/innerwear/Briefs";
import SportsBras from "./pages/womenfashion/womenClothing/clothing/sportswear/innerwear/SportsBras";
import ProtectiveSportsBras from "./pages/womenfashion/womenClothing/clothing/sportswear/innerwear/ProtectiveSportsBras";
import Tracksuits from "./pages/womenfashion/womenClothing/clothing/sportswear/sets/Tracksuits";
import Sweatsuits from "./pages/womenfashion/womenClothing/clothing/sportswear/sets/Sweatsuits";
import WorkoutBottom from "./pages/womenfashion/womenClothing/clothing/sportswear/sets/WorkoutBottom";
import ButtonDownShirts from "./pages/womenfashion/womenClothing/clothing/sportswear/shirtsTees/ButtonDownShirts";
import TankTops from "./pages/womenfashion/womenClothing/clothing/sportswear/shirtsTees/TankTops";
import SportTshirts from "./pages/womenfashion/womenClothing/clothing/sportswear/shirtsTees/SportTshirts";
import ArmWarmers from "./pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/ArmWarmers";
import CompressionSocks from "./pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/CompressionSocks";
import LegWarmers from "./pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/LegWarmers";
import Pants from "./pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/Pants";
import ThermalUnderwear from "./pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/ThermalUnderwear";
import BaseShirts from "./pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/BaseShirts";
import BaseShorts from "./pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/BaseShorts";
import Skorts from "./pages/womenfashion/womenClothing/clothing/sportswear/skirtsSkorts/Skorts";
import Skirt from "./pages/womenfashion/womenClothing/clothing/sportswear/skirtsSkorts/Skirt";
// import Symptoms from "./pages/customerpage/Symptoms";

const router = createBrowserRouter([
  { path: "/login", element: <Register /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products/:id",      element: <ProductDetail /> },
      // { path: "himanshi",      element: <Symptoms /> },
       { path: "himanshi",      element: <Moods /> },
      
      { path: "cart",              element: <Cart /> },
      { path: "my-orders",         element: <MyOrders /> },
      {path:"products",element:<ProductListing/>},
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
      {path:"/western-wear/tops-t-shirts-shirts", element:<TopsTshirts/>},
      {path:"/women/western-wear/tshirts", element:<Tshirts/>},
      {path:"/women/western-wear/shirts", element:<Shirts/>},
      {path:"/women/western-wear/polos", element:<Polos/>},
      {path:"/western-wear/tops-t-shirts-shirts", element:<ButtonDownshirt/>},
      {path:"/western-wear/dresses-jumpsuits", element:<DressesJumpsuits/>},
      {path:"/western-wear/dresses-jumpsuits/dresses", element:<Dresses/>},
      {path:"/western-wear/dresses-jumpsuits/jumpsuits", element:<Jumpsuits/>},
      {path:"/western-wear/trousers", element:<Trousers/>},
      {path:"/western-wear/jeans-jeggings", element:<JeansJeggings/>},
      {path:"/western-wear/skirts-shortss", element:<SkirtsShorts/>},
      {path:"/western-wear/skirts-shortss/skirts", element:<Skirts/>},
      {path:"/western-wear/skirts-shortss/shorts", element:<Shorts/>},
      {path:"/western-wear/shrugs", element:<Shrugs/>},
      {path:"/western-wear/leggings", element:<Leggings/>},
      {path:"/women/clothing/sports-wear/active-dresses", element:<ActiveDresses/>},
      {path:"/women/clothing/sports-wear/athletic-socks", element:<AthleticSocks/>},
      {path:"/women/clothing/sports-wear/ankle-socks", element:<AnkleSocks/>},
      {path:"/women/clothing/sports-wear/crew-socks", element:<CrewSocks/>},
      {path:"/women/clothing/sports-wear/knee-high-socks", element:<KneeHighSock/>},
      {path:"/women/clothing/sports-wear/vests", element:<Vests/>},
      {path:"/women/clothing/sports-wear/shorts", element:<SportShorts/>},
      {path:"/women/clothing/sports-wear/innerwear", element:<Innerwear/>},
      {path:"/women/clothing/sports-wear/briefs", element:<Briefs/>},
      {path:"/women/clothing/sports-wear/protective-sport-bras", element:<ProtectiveSportsBras/>},
      {path:"/women/clothing/sports-wear/sports-bras", element:<SportsBras/>},
      {path:"/women/clothing/sports-wear/sets", element:<Sets/>},
      {path:"/women/clothing/sports-wear/tracksuits", element:<Tracksuits/>},
      {path:"/women/clothing/sports-wear/sweatsuits", element:<Sweatsuits/>},
      {path:"/women/clothing/sports-wear/workout-sets", element:<WorkoutBottom/>},
      {path:"/women/clothing/sports-wear/leggings", element:<SportLeggings/>},
      {path:"/women/clothing/sports-wear/shirts-tees", element:<ShirtTees/>},
      {path:"/women/clothing/sports-wear/shirts-tees/button-down-shirts", element:<ButtonDownShirts/>},
      {path:"/women/clothing/sports-wear/shirts-tees/polos", element:<Polos/>},
      {path:"/women/clothing/sports-wear/shirts-tees/t-shirts", element:<SportTshirts/>},
      {path:"/women/clothing/sports-wear/shirts-tees/tank-tops", element:<TankTops/>},
      {path:"/women/clothing/sports-wear/sweatshirts-hoodies", element:<SweatshirtsHoodies/>},
      {path:"/women/clothing/sports-wear/track-jackets", element:<TrackJackets/>},
      {path:"/women/clothing/sports-wear/trousers", element:<SportTrousers/>},
      {path:"/women/clothing/sports-wear/base-layers-compression", element:<BaseLayersCompression/>},
      {path:"/women/clothing/sports-wear/base-layers-compression/armwarmers", element:<ArmWarmers/>},
      {path:"/women/clothing/sports-wear/base-layers-compression/compression-socks", element:<CompressionSocks/>},
      {path:"/women/clothing/sports-wear/base-layers-compression/legwarmers", element:<LegWarmers/>},
      {path:"/women/clothing/sports-wear/base-layers-compression/pants", element:<Pants/>},
      {path:"/women/clothing/sports-wear/base-layers-compression/shirts", element:<BaseShirts/>},
      {path:"/women/clothing/sports-wear/base-layers-compression/shorts", element:<BaseShorts/>},
      {path:"/women/clothing/sports-wear/base-layers-compression/thermal-underwear", element:<ThermalUnderwear/>},
      {path:"/women/clothing/sports-wear/skirts-skorts", element:<SkirtsSkorts/>},
      {path:"/women/clothing/sports-wear/skirts-skorts/skorts", element:<Skorts/>},
      {path:"/women/clothing/sports-wear/skirts-skorts/skirt", element:<Skirt/>},
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
          { path: "/admin/customers", element: <Customers />},
          { path: "/admin/settings", element: <AdminSetting/>},
         
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