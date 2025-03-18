
import React from "react";
import { useLocation } from "react-router-dom";

// Simple context to replace authentication
export const AuthContext = React.createContext<{isAuthenticated: boolean}>({
  isAuthenticated: true
});

// Simplified auth provider that always provides authenticated access
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    isAuthenticated: true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Modified ProtectedRoute to always allow access
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  // Authentication check is removed, so all routes are accessible
  return <>{children}</>;
};
