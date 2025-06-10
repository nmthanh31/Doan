import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default PrivateRoute;
