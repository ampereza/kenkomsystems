import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session?.user) {
          await fetchUserProfile(data.session.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Session initialization error:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id);
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

  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user email from auth
      const { data: authData } = await supabase.auth.getUser();
      const userEmail = authData.user?.email || '';
      const userFullName = authData.user?.user_metadata?.full_name || null;
      
      // Try to get user from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        // Profile doesn't exist, create one
        console.log("Profile not found, creating new profile");
        
        // Default role - you might want to adjust this based on your requirements
        const defaultRole: UserRole = 'accountant';
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: userId, 
              email: userEmail,
              full_name: userFullName,
              role: defaultRole
            }
          ])
          .select();
        
        if (insertError) {
          console.error("Error creating profile:", insertError);
          toast({
            title: "Error Creating Profile",
            description: "There was a problem creating your user profile. Please try again or contact support.",
            variant: "destructive"
          });
          throw new Error(`Database error saving new user: ${insertError.message}`);
        }
        
        setProfile({
          id: userId,
          email: userEmail,
          full_name: userFullName,
          role: defaultRole
        });
        
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully."
        });
      } else {
        // Profile exists
        setProfile({
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          role: profileData.role as UserRole
        });
      }
      
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Profile fetch/creation error:", err);
      setError(err as Error);
      toast({
        title: "Authentication Error",
        description: "There was a problem with your account. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setIsAuthenticated(false);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (err) {
      console.error("Error signing out:", err);
      setError(err as Error);
      toast({
        title: "Sign Out Error",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}