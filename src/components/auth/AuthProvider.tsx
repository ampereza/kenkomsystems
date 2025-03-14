import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

// ------------------ Types -------------------
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
  getExternalUrlForRole: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ROLE_BASED_ROUTES = {
  accountant: ['/finance', '/reports/financial', '/reports/ledger'],
  stock_manager: ['/stock', '/suppliers', '/reports/stock'],
  production_manager: ['/treatment', '/reports/treatment'],
  managing_director: ['*'], // All routes
  general_manager: ['*'],  // All routes
} as const;

// External domain mapping for roles
export const ROLE_EXTERNAL_DOMAINS = {
  accountant: 'kdl.kenkomdistributorsltd.com/accountant',
  stock_manager: 'kdl.kenkomdistributorsltd.com/stock-manager',
  production_manager: 'kdl.kenkomdistributorsltd.com/production-manager',
  general_manager: 'kdl.kenkomdistributorsltd.com/general-manager',
  managing_director: 'kdl.kenkomdistributorsltd.com/managing-director',
  developer: 'kdl.kenkomdistributorsltd.com/maindashboard',
} as const;

// ------------------ Provider -------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // ---------- Fetch or Create User Profile ----------
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: authData, error: userError } = await supabase.auth.getUser();
      if (userError || !authData.user) throw userError || new Error('User not found in auth.');

      const userEmail = authData.user.email || '';
      const userFullName = authData.user.user_metadata?.full_name || null;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.warn("Profile not found, creating...");
        const defaultRole: UserRole = 'accountant';

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, email: userEmail, full_name: userFullName, role: defaultRole }])
          .select()
          .single();

        if (insertError) throw new Error(`Failed to create profile: ${insertError.message}`);

        // Type assertion to ensure role is treated as UserRole
        setProfile({
          ...newProfile,
          role: newProfile.role as UserRole
        });
        toast({ title: "Welcome!", description: "Your account has been created successfully." });
      } else {
        // Type assertion to ensure role is treated as UserRole
        setProfile({
          ...profileData,
          role: profileData.role as UserRole
        });
      }

      setIsAuthenticated(true);
    } catch (err) {
      console.error("Profile fetch/creation error:", err);
      setError(err as Error);
      toast({
        title: "Authentication Error",
        description: "Problem with your account. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- Initialize Session ----------
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const user = data?.session?.user;
        if (user) {
          console.log("User session found:", user);
          await fetchUserProfile(user.id);
        } else {
          console.log("No active session.");
          setIsAuthenticated(false);
          setProfile(null);
        }
      } catch (err) {
        console.error("Session initialization error:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event, session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    }).data;

    return () => subscription.unsubscribe();
  }, []);

  // ---------- Sign Out ----------
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setIsAuthenticated(false);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
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

  // ---------- Role-based Permission ----------
  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!profile) return false;
    return profile.role === 'managing_director' || profile.role === 'general_manager' || allowedRoles.includes(profile.role);
  };

  // ---------- Get External URL for Role ----------
  const getExternalUrlForRole = (role: UserRole): string => {
    return `https://${ROLE_EXTERNAL_DOMAINS[role]}`;
  };

  // ---------- Return Provider ----------
  return (
    <AuthContext.Provider value={{ 
      profile, 
      isLoading, 
      error, 
      isAuthenticated, 
      hasPermission, 
      signOut,
      getExternalUrlForRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ------------------ Hook -------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

// ------------------ Protected Route -------------------
export function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: ReactNode;
  allowedRoles: UserRole[];
}) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute', { isAuthenticated, isLoading, allowedRoles });

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
