import { create } from "zustand";

interface AuthData {
  token: string;
  userId: string;
  email: string;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  email: string | null;
  username: string | null;
  isHydrated: boolean;
  setAuth: (data: AuthData) => void;
  logout: () => void;
  hydrate: () => void;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  token: null,
  userId: null,
  email: null,
  username: null,
  isHydrated: false,

  setAuth: (data) => {
    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({
          userId: data.userId,
          email: data.email,
          username: data.username,
        })
      );
    }

    set({
      isAuthenticated: true,
      token: data.token,
      userId: data.userId,
      email: data.email,
      username: data.username,
    });
  },

  logout: () => {
    // Clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    set({
      isAuthenticated: false,
      token: null,
      userId: null,
      email: null,
      username: null,
    });
  },

  hydrate: () => {
    if (typeof window === "undefined") {
      set({ isHydrated: true });
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          isAuthenticated: true,
          token,
          userId: user.userId,
          email: user.email,
          username: user.username,
          isHydrated: true,
        });
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        set({ isHydrated: true });
      }
    } else {
      set({ isHydrated: true });
    }
  },
}));
