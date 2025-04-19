import { Navigate, useRoutes } from "react-router-dom";
import ProductList from "../pages/ProductList";
import LoginPage from "../pages/Login";
import SignUpPage from "../pages/SignUp";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/OrderPage";

const AppRoutes = () => {
  const routes = useRoutes([
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    {
      path: "/products",
      element: (
        <PrivateRoute>
          <ProductList />
        </PrivateRoute>
      ),
    },
    {
      path: "/orders",
      element: (
        <PrivateRoute>
          <OrderPage />
        </PrivateRoute>
      ),
    },
    { path: "*", element: <Navigate to="/products" replace /> },
  ]);

  return routes;
};

export default AppRoutes;
