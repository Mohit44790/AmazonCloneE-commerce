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

    return data.data.user;
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

     return data.data.user;
  },

  // =========================
  // UPDATE MY PROFILE
  // =========================
  updateMe: async (payload) => {
    const { data } = await api.patch("/auth/me", payload);

    return data.data.user;
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

  // =========================
  // GET ALL USERS (Admin)
  // =========================
  getAllUsers: async (params = {}) => {
    const { data } = await api.get("/auth", { params });

    return data; // { success, pagination, data: { users } }
  },

  // =========================
  // GET SINGLE USER (Admin)
  // =========================
  getUser: async (id) => {
    const { data } = await api.get(`/auth/${id}`);

    return data.data.user;
  },

  // =========================
  // GET USER STATS (Admin)
  // =========================
  getUserStats: async () => {
    const { data } = await api.get("/auth/stats");

    return data.data;
  },

  // =========================
  // BAN USER (Admin)
  // =========================
  banUser: async (id, reason) => {
    const { data } = await api.patch(`/auth/${id}/ban`, {
      reason,
    });

    return data;
  },

  // =========================
  // UNBAN USER (Admin)
  // =========================
  unbanUser: async (id) => {
    const { data } = await api.patch(`/auth/${id}/unban`);

    return data;
  },

  // =========================
  // VERIFY SELLER (Admin)
  // =========================
  verifySeller: async (id, verified = true) => {
    const { data } = await api.patch(
      `/auth/${id}/verify-seller`,
      { verified }
    );

    return data.data.user;
  },

  // =========================
  // CHANGE ROLE (Super Admin)
  // =========================
  changeRole: async (id, role) => {
    const { data } = await api.patch(`/auth/${id}/role`, {
      role,
    });

    return data.data.user;
  },

  // =========================
  // DELETE USER (Super Admin)
  // =========================
  deleteUser: async (id) => {
    const { data } = await api.delete(`/auth/${id}`);

    return data;
  },
};