import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';

export function useAuth() {
  const { user, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    // Fetch current user on mount
    async function fetchUser() {
      try {
        // Get token from localStorage (fallback for Next.js 16 bug)
        const token = localStorage.getItem('auth-token');
        console.log('🔍 useAuth - Fetching user, token from localStorage:', { hasToken: !!token, tokenLength: token?.length });

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        // Add Authorization header if token exists in localStorage
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/auth/me', {
          credentials: 'include', // Include cookies
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
      }
    }

    fetchUser();
  }, [setUser, setLoading]);

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

      // Store token in localStorage as fallback (for Next.js 16 Turbopack bug)
      if (data.token) {
        localStorage.setItem('auth-token', data.token);
        console.log('✅ Token saved to localStorage:', { tokenLength: data.token.length });
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
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

