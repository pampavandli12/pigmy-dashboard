import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

export const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const location = useLocation();

  if (!isHydrated) return <div>Loading...</div>;

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
