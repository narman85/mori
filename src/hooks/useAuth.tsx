import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { pb } from '@/integrations/supabase/client';
import type { RecordModel } from 'pocketbase';

interface AuthContextType {
  user: RecordModel | null;
  session: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<RecordModel | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up PocketBase auth state listener
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setSession(token);
      setUser(model);
      setLoading(false);
    });

    // Check if user is already authenticated
    if (pb.authStore.isValid) {
      setSession(pb.authStore.token);
      setUser(pb.authStore.model);
    }
    setLoading(false);

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      setSession(pb.authStore.token);
      setUser(pb.authStore.model);
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Create new user
      const userData = {
        email,
        password,
        passwordConfirm: password,
      };

      const record = await pb.collection('users').create(userData);
      
      // Automatically sign in after registration
      const authData = await pb.collection('users').authWithPassword(email, password);
      setSession(pb.authStore.token);
      setUser(pb.authStore.model);
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    pb.authStore.clear();
    setSession(null);
    setUser(null);
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};