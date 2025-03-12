
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, useLocation } from 'react-router-dom';

export type UserRole = 'managing_director' | 'general_manager' | 'production_manager' | 'stock_manager' | 'accountant';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

interface AuthContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ROLE_BASED_ROUTES = {
  accountant: ['/finance', '/reports/financial', '/reports/ledger'],
  stock_manager: ['/stock', '/suppliers', '/reports/stock'],
  production_manager: ['/treatment', '/reports/treatment'],
  managing_director: ['*'], // All routes
  general_manager: ['*'], // All routes
} as const;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
        setIsAuthenticated(true);
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          fetchProfile(session.user.id);
          setIsAuthenticated(true);
        } else {
          setProfile(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        throw error;
      }
      
      setProfile(data as Profile);
    } catch (error) {
      setError(error as Error);
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!profile) return false;
    if (profile.role === 'managing_director' || profile.role === 'general_manager') return true;
    return allowedRoles.includes(profile.role);
  };

  return (
    <AuthContext.Provider value={{ profile, isLoading, error, isAuthenticated, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected Route component
export function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: ReactNode;
  allowedRoles: UserRole[];
}) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
