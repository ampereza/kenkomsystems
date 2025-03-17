
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define user roles
export type UserRole = 'managing_director' | 'general_manager' | 'production_manager' | 'stock_manager' | 'accountant' | 'developer';

// Profile interface
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

// Auth context type
export interface AuthContextType {
  profile: Profile | null;
  user: any | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
  signOut: () => Promise<void>;
  getExternalUrlForRole: (role: UserRole) => string;
}

// Example ProtectedRoute component
export const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode,
  allowedRoles: UserRole[]
}) => {
  const { hasPermission } = useAuth();

  // Check if user has permission
  if (!hasPermission(allowedRoles)) {
    return <div>Unauthorized - You don't have permission to access this page</div>;
  }

  return <>{children}</>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Default profile with general_manager role
  const defaultProfile: Profile = {
    id: 'default-user-id',
    email: 'admin@example.com',
    full_name: 'Admin User',
    role: 'managing_director'
  };

  // Authentication is always true
  const isAuthenticated = true;

  const signOut = async () => {
    // Do nothing since authentication is disabled
    console.log('Sign out attempted, but authentication is disabled');
    return Promise.resolve();
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    // Always return true since we're using the default admin profile
    return allowedRoles.includes(defaultProfile.role);
  };

  const getExternalUrlForRole = (role: UserRole): string => {
    const roleUrls: Record<UserRole, string> = {
      managing_director: '/dashboards/md',
      general_manager: '/dashboards/gm',
      production_manager: '/pm',
      stock_manager: '/sm',
      accountant: '/finance',
      developer: '/maindashboard',
    };
    return roleUrls[role];
  };

  return (
    <AuthContext.Provider
      value={{
        profile: defaultProfile,
        user: null,
        isLoading,
        error,
        isAuthenticated,
        hasPermission,
        signOut,
        getExternalUrlForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
