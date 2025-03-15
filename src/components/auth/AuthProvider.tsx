import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Navigate } from 'react-router-dom';


const isAuthenticated = true; // TEMP: Force true to test rendering


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
  user: User | null;
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
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!hasPermission(allowedRoles)) {
    return <Navigate to="/unauthorized" />;
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        const isValidUserRole = (role: string): role is UserRole => {
          const validRoles = [
            'managing_director', 
            'general_manager', 
            'production_manager', 
            'stock_manager', 
            'accountant', 
            'developer'
          ];
          return validRoles.includes(role);
        };
        
        if (data.role && isValidUserRole(data.role)) {
          setProfile({
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role
          });
        } else {
          throw new Error(`Invalid role: ${data.role}`);
        }
      }
    } catch (err: any) {
      setError(err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }

      setSession(data.session);
      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      }

      setIsLoading(false);
    };

    initializeAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    return allowedRoles.includes(profile?.role as UserRole);
  };

  const getExternalUrlForRole = (role: UserRole): string => {
    const roleUrls: Record<UserRole, string> = {
      managing_director: 'https://kdl.kenkomdistributorsltd.com/dashboards/md',
      general_manager: 'https://kdl.kenkomdistributorsltd.com/dashboards/gm',
      production_manager: 'https://kdl.kenkomdistributorsltd.com/pm',
      stock_manager: 'https://kdl.kenkomdistributorsltd.com/sm',
      accountant: 'https://kdl.kenkomdistributorsltd.com/finance',
      developer: '/maindashboard',
    };
    return roleUrls[role];
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        profile,
        user,
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
