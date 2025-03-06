
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'managing_director' | 'general_manager' | 'production_manager' | 'stock_manager' | 'accountant';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', newSession.user.id)
              .single();
            
            if (error) {
              throw error;
            }
            
            setProfile(data as UserProfile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching user profile:', error);
              setProfile(null);
            } else {
              setProfile(data as UserProfile);
            }
            setIsLoading(false);
          });
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      navigate('/auth');
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
