'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: Session['user'] | null;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Session['user'] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
