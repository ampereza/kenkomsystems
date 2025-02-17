
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Temporarily disable auth checks and just render children
  return <>{children}</>;
}
