import api from "./axiosInstance";

export const authApi = {
  // =========================
  // REGISTER
  // =========================
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);

    // agar backend accessToken bhej raha hai
    if (data.accessToken) {
      window.__ACCESS_TOKEN__ = data.accessToken;
    }

    return data.user;
  },

  // =========================
  // LOGIN
  // =========================
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    // store access token in memory only
    window.__ACCESS_TOKEN__ = data.accessToken;

    return data.user;
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    await api.post("/auth/logout");

    // remove token from memory
    window.__ACCESS_TOKEN__ = null;
  },

  // =========================
  // LOGOUT ALL DEVICES
  // =========================
  logoutAll: async () => {
    await api.post("/auth/logout-all");

    window.__ACCESS_TOKEN__ = null;
  },

  // =========================
  // GET CURRENT USER
  // =========================
  getMe: async () => {
    const { data } = await api.get("/auth/me");

    return data.user;
  },

  // =========================
  // REFRESH TOKEN
  // =========================
  refreshToken: async () => {
    const { data } = await api.post("/auth/refresh-token");

    window.__ACCESS_TOKEN__ = data.accessToken;

    return data;
  },

  // =========================
  // FORGOT PASSWORD
  // =========================
  forgotPassword: async (email) => {
    const { data } = await api.post("/auth/forgot-password", {
      email,
    });

    return data;
  },

  // =========================
  // RESET PASSWORD
  // =========================
  resetPassword: async (token, password) => {
    const { data } = await api.patch(
      `/auth/reset-password/${token}`,
      { password }
    );

    return data;
  },

  // =========================
  // CHANGE PASSWORD
  // =========================
  changePassword: async (
    currentPassword,
    newPassword
  ) => {
    const { data } = await api.patch(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      }
    );

    return data;
  },

  // =========================
  // VERIFY EMAIL
  // =========================
  verifyEmail: async (token) => {
    const { data } = await api.get(
      `/auth/verify-email/${token}`
    );

    return data;
  },

  // =========================
  // RESEND VERIFICATION EMAIL
  // =========================
  resendVerificationEmail: async () => {
    const { data } = await api.post(
      "/auth/resend-verification"
    );

    return data;
  },
};