
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

export function DashboardRedirect() {
  const { profile } = useAuth();
  
  if (!profile || !profile.role) {
    return <Navigate to="/login" />;
  }
  
  // Redirect based on user role
  switch (profile.role) {
    case "accountant":
      return <Navigate to="/dashboards/financial" />;
    case "stock_manager":
      return <Navigate to="/dashboards/stock" />;
    case "production_manager":
      return <Navigate to="/dashboards/treatment" />;
    case "general_manager":
      return <Navigate to="/dashboards/general-manager" />;
    case "managing_director":
      return <Navigate to="/dashboards/md" />;
    default:
      // Fallback to financial dashboard
      return <Navigate to="/dashboards/financial" />;
  }
}

