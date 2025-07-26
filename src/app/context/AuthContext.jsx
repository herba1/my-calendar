"use client";
import { useState, useEffect, useContext, createContext } from "react";
import { createClient } from "../utils/supabase/client";
const supabase = createClient();

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user && !user.is_anonymous;
  const isAnonymous = !!user && user.is_anonymous;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      console.log('auth change,',session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    isAnonymous
  }

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>
}

export function useAuth(){
    return useContext(AuthContext);
}
