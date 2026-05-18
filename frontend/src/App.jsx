import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./pages/Home";       // create this page
import Layout from "./component/Layout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
     
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;