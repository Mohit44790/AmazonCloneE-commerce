// store/authStore.js

import { create } from "zustand";
import { authApi } from "../api/authApi";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // =========================
  // LOGIN
  // =========================
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const user = await authApi.login(
        email,
        password
      );

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });

      return user;
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Login failed",
        loading: false,
      });

      throw err;
    }
  },

  // =========================
  // REGISTER
  // =========================
  register: async (payload) => {
    set({ loading: true, error: null });

    try {
      const user = await authApi.register(
        payload
      );

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });

      return user;
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          "Register failed",
        loading: false,
      });

      throw err;
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  // =========================
  // RESTORE SESSION
  // =========================
  hydrate: async () => {
    set({ loading: true });

    try {
      const user = await authApi.getMe();

      set({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  // =========================
  // CLEAR ERROR
  // =========================
  clearError: () =>
    set({
      error: null,
    }),
}));