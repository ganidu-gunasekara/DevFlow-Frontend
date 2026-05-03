import { create } from "zustand";

type User = {
  id : string | number
  email: string;
  name?: string;
  avatarUrl?: string;
  profileComplete?: boolean;
  user_type: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'DEVELOPER' | 'QA_ENGINEER' | 'DESIGNER' | 'PRODUCT_OWNER';
};

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthReady: boolean;
  setAuth: (token: string, user: User) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  setAuthReady: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthReady: false,
  setAuth: (token, user) => set({ accessToken: token, user }),
  setAccessToken: (token) => set({ accessToken: token }),
  setAuthReady: (v) => set({ isAuthReady: v }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
