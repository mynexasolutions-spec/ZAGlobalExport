import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthContext } from './authContextInstance';


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.warn('Supabase getSession warning:', sessionError);
          }

          if (data?.session?.user && mounted) {
            setSession(data.session);
            setUser(data.session.user);
            setLoading(false);
            return;
          }
        }


      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initSession();

    // Supabase auth state listener
    let authListener = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (mounted) {
          if (currentSession?.user) {
            setSession(currentSession);
            setUser(currentSession.user);
          } else {
            setSession(null);
            setUser(null);
          }
        }
      });
      authListener = data?.subscription;
    }

    return () => {
      mounted = false;
      authListener?.unsubscribe();
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      const msg = 'Please enter both email and password.';
      setError(msg);
      throw new Error(msg);
    }

    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase is not configured. Cannot log in.';
      setError(msg);
      throw new Error(msg);
    }

    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (supabaseError || !data?.user) {
      const errMessage = supabaseError?.message || 'Invalid email or password.';
      setError(errMessage);
      throw new Error(errMessage);
    }

    setUser(data.user);
    setSession(data.session);
    return data.user;
  };

  // Logout handler
  const logout = async () => {
    setError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Supabase signOut warning:', err);
    } finally {
      setUser(null);
      setSession(null);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: Boolean(user),
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
