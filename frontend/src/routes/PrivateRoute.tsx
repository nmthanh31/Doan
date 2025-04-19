import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;
  if (token) {
    return <>{children}</>;
  }
};

export default PrivateRoute;
