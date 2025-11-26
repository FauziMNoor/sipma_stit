import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';

export function useAuth() {
  const { user, isLoading, isFetching, hasFetched, setUser, setLoading, setFetching, logout } = useAuthStore();

  useEffect(() => {
    // Skip if already fetching or already fetched
    if (isFetching || hasFetched) {
      console.log('⏭️ useAuth - Skipping fetch:', { isFetching, hasFetched, user: !!user, isLoading });
      // Ensure isLoading is false if we already have user data
      if (hasFetched && isLoading) {
        console.log('🔧 useAuth - Setting isLoading to false (already fetched)');
        setLoading(false);
      }
      return;
    }

    // Fetch current user on mount
    async function fetchUser() {
      const token = localStorage.getItem('auth-token');

      try {
        setFetching(true);

        console.log('🔍 useAuth - Fetching user, token from localStorage:', { hasToken: !!token, tokenLength: token?.length });

        // If no token, skip API call
        if (!token) {
          console.log('⏭️ useAuth - No token found, skipping API call');
          setUser(null);
          setLoading(false);
          setFetching(false);
          return;
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers,
        });

        console.log('🔍 useAuth - /api/auth/me response:', { status: response.status, ok: response.ok });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ useAuth - User fetched:', { role: data.user?.role, nama: data.user?.nama });
          setUser(data.user);
        } else {
          console.log('❌ useAuth - Failed to fetch user, status:', response.status);
          setUser(null);
          // Clear localStorage if unauthorized
          if (response.status === 401) {
            localStorage.removeItem('auth-token');
          }
        }
      } catch (error) {
        console.error('❌ useAuth - Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setFetching(false);
      }
    }

    fetchUser();
  }, [isFetching, hasFetched, user, isLoading, setUser, setLoading, setFetching]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login gagal');
      }

      // Store token in localStorage and sync with cookie for Vercel Edge Runtime
      if (data.token) {
        localStorage.setItem('auth-token', data.token);
        // Also set cookie from client-side for better persistence across Edge/Node runtimes
        document.cookie = `auth-token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
        console.log('✅ Token saved to localStorage and cookie:', { tokenLength: data.token.length });
      }

      // Update user state immediately
      setUser(data.user);
      console.log('✅ User state updated:', { role: data.user?.role, nama: data.user?.nama });

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      // Clear local state first
      logout();
      localStorage.removeItem('auth-token');
      document.cookie = 'auth-token=; path=/; max-age=0';
      
      // Call logout API
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Use window.location to force full page reload and clear all state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      logout();
      localStorage.removeItem('auth-token');
      document.cookie = 'auth-token=; path=/; max-age=0';
      window.location.href = '/login';
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout: handleLogout,
  };
}

