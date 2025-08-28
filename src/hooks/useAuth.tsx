import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  session: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('auth-user');
    const savedSession = localStorage.getItem('auth-session');
    
    if (savedUser && savedSession) {
      try {
        setUser(JSON.parse(savedUser));
        setSession(savedSession);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('auth-user');
        localStorage.removeItem('auth-session');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For demo purposes, create a dummy user
      // In real app, this would make API call
      const demoUser: User = {
        id: 'demo-user',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user'
      };
      
      const demoSession = `session-${Date.now()}`;
      
      setUser(demoUser);
      setSession(demoSession);
      
      localStorage.setItem('auth-user', JSON.stringify(demoUser));
      localStorage.setItem('auth-session', demoSession);
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    // Same as signIn for demo
    return signIn(email, password);
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, create a dummy Google user
      const googleUser: User = {
        id: 'google-demo-user',
        email: 'demo@google.com',
        name: 'Google Demo User',
        role: 'user'
      };
      
      const demoSession = `google-session-${Date.now()}`;
      
      setUser(googleUser);
      setSession(demoSession);
      
      localStorage.setItem('auth-user', JSON.stringify(googleUser));
      localStorage.setItem('auth-session', demoSession);
      
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-session');
  };

  const value: AuthContextType = {
    user,
    session,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};