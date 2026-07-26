import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

// Persist configuration
const persistConfig: PersistOptions<AuthState> = {
  name: 'auth-storage',
  // only persist user and token, not loading state
  partialize: (state) => ({ user: state.user, token: state.token }),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      login: (token, user) => {
        set({ token, user, isLoading: false });
      },
      logout: () => {
        set({ user: null, token: null, isLoading: false });
      },
      updateUser: (partial) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
          isLoading: false,
        }));
      },
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    persistConfig
  )
);