import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthContext } from './authContextInstance';

const DEFAULT_ADMIN_EMAIL = 'admin@gmail.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';
const LOCAL_STORAGE_KEY = 'za_admin_session';

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

        // Check fallback local storage session
        const storedLocalSession = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedLocalSession && mounted) {
          try {
            const parsed = JSON.parse(storedLocalSession);
            if (parsed?.email === DEFAULT_ADMIN_EMAIL) {
              setUser(parsed);
              setSession({ user: parsed });
            }
          } catch (e) {
            console.error('Error parsing stored session:', e);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
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
          } else if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
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

    // Try Supabase auth first if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (!supabaseError && data?.user) {
          setUser(data.user);
          setSession(data.session);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          return data.user;
        }

        // If Supabase returned an error, and it doesn't match default admin credentials
        if (cleanEmail !== DEFAULT_ADMIN_EMAIL || cleanPassword !== DEFAULT_ADMIN_PASSWORD) {
          const errMessage = supabaseError?.message || 'Invalid email or password.';
          setError(errMessage);
          throw new Error(errMessage);
        }
      } catch (err) {
        // If it matches default credentials, proceed with default admin fallback below
        if (cleanEmail !== DEFAULT_ADMIN_EMAIL || cleanPassword !== DEFAULT_ADMIN_PASSWORD) {
          setError(err.message || 'Login failed.');
          throw err;
        }
      }
    }

    // Default admin credential validation
    if (cleanEmail === DEFAULT_ADMIN_EMAIL && cleanPassword === DEFAULT_ADMIN_PASSWORD) {
      const adminUser = {
        id: 'admin-za-global',
        email: DEFAULT_ADMIN_EMAIL,
        role: 'admin',
        user_metadata: { name: 'ZA Global Admin' },
      };
      setUser(adminUser);
      setSession({ user: adminUser });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(adminUser));
      return adminUser;
    }

    const invalidMsg = 'Invalid email or password. Use default admin credentials or registered Supabase account.';
    setError(invalidMsg);
    throw new Error(invalidMsg);
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
      localStorage.removeItem(LOCAL_STORAGE_KEY);
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
