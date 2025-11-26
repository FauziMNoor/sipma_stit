import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isFetching: boolean;
  hasFetched: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setFetching: (fetching: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isFetching: false,
  hasFetched: false,
  setUser: (user) => set({ user, isLoading: false, hasFetched: true }),
  setLoading: (loading) => set({ isLoading: loading }),
  setFetching: (fetching) => set({ isFetching: fetching }),
  logout: () => set({ user: null, isLoading: false, hasFetched: false }),
}));

