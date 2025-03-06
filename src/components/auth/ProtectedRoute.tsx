
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (allowedRoles && profile) {
    if (!allowedRoles.includes(profile.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authenticated and has the required role (if specified)
  return <>{children}</>;
}
