// store/authStore.js  (Zustand)
// npm install zustand
import { create } from "zustand";
import { authApi } from "../api/authApi";


export const useAuthStore = create((set) => ({
  user:    null,
  loading: false,
  error:   null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.login(email, password);
      set({ user, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Login failed", loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const user = await authApi.register(payload);
      set({ user, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Register failed", loading: false });
    }
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null });
  },

  // Call on app start to restore session from httpOnly cookie
  hydrate: async () => {
    set({ loading: true });
    try {
      const user = await authApi.getMe();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));