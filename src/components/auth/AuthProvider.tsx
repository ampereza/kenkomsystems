
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
  signOut: () => Promise<void>;
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

  // Handle URL parameters for OAuth callback
  useEffect(() => {
    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const provider = urlParams.get('provider');
      const success = urlParams.get('success');
      
      if (provider === 'google' && success === 'true') {
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };
    
    handleAuthCallback();
  }, []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data, error }) => {
      if (data?.session?.user) {
        const userId = data.session.user.id;
        const email = data.session.user.email || '';
        const role = (localStorage.getItem('userRole') || 'accountant') as UserRole;
        const name = localStorage.getItem('userName') || '';
        
        setProfile({
          id: userId,
          email: email,
          full_name: name,
          role: role
        });
        
        setIsAuthenticated(true);
      }
      setIsLoading(false);
      
      if (error) {
        console.error("Session error:", error);
        setError(error as Error);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const userId = session.user.id;
          const email = session.user.email || '';
          const role = (localStorage.getItem('userRole') || 'accountant') as UserRole;
          const name = localStorage.getItem('userName') || '';
          
          setProfile({
            id: userId,
            email: email,
            full_name: name,
            role: role
          });
          
          setIsAuthenticated(true);
        } else {
          setProfile(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error signing out:", error);
      setError(error as Error);
    }
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!profile) return false;
    if (profile.role === 'managing_director' || profile.role === 'general_manager') return true;
    return allowedRoles.includes(profile.role);
  };

  return (
    <AuthContext.Provider value={{ profile, isLoading, error, isAuthenticated, hasPermission, signOut }}>
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
