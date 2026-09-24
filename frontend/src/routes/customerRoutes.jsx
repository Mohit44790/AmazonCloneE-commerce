// src/routes/customerRoutes.jsx
import { lazy } from "react";


const Home          = lazy(() => import("../pages/Home"));
const ProductListing= lazy(() => import("../pages/customerpage/ProductListing"));
const ProductDetail = lazy(() => import("../pages/customerpage/ProductDetail"));
const Cart          = lazy(() => import("../pages/customerpage/Cart"));
const MyOrders      = lazy(() => import("../pages/customerpage/MyOrders"));
const Moods         = lazy(() => import("../pages/customerpage/Moods"));
const LocalProductDetails = lazy(() => import("../pages/customerpage/LocalProductDetails"));

export const customerRoutes = [
  { index: true,              element: <Home />           },
  { path: "products",         element: <ProductListing /> },
  { path: "products/:id",     element: <ProductDetail />  },
  { path: "product/:id",     element: <LocalProductDetails />  },
  { path: "cart",             element: <Cart />           },
  { path: "my-orders",        element: <MyOrders />       },
  { path: "himanshi",         element: <Moods />          },
];